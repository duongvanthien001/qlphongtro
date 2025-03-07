import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Form,
  Card,
} from "react-bootstrap";
import { FaFileExcel } from "react-icons/fa";
import { useLoaderData } from "react-router-dom";
import { formatVnd } from "../../utils/formatVnd";
import CountUp from "react-countup";
import { getBills } from "../../services/billService";

export default function Report() {
  const loaderData = useLoaderData();
  const { report, initialBills } = loaderData;
  const [bills, setBills] = useState(initialBills);
  const [month, setMonth] = useState("");

  const fetchBills = async ({ month }) => {
    try {
      const bills = await getBills({
        month,
      });
      setBills(bills);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeMonth = (e) => {
    setMonth(e.target.value);
    fetchBills({ month: e.target.value });
  };

  return (
    <Container className="my-5">
      {/* Tổng quan */}
      <Row className="mb-4">
        <Col md={3} className="text-center">
          <Card className="border p-3">
            <h5>Tổng thu</h5>
            <CountUp end={report.totalIncome} suffix=" ₫" />
          </Card>
        </Col>

        <Col md={3} className="text-center">
          <Card className="border p-3">
            <h5>Tổng nợ</h5>
            <CountUp end={report.totalDebt} suffix=" ₫" />
          </Card>
        </Col>

        <Col md={3} className="text-center">
          <Card className="border p-3">
            <h5>Tổng điện</h5>
            <CountUp end={report.totalElectricity} suffix=" ₫" />
          </Card>
        </Col>

        <Col md={3} className="text-center">
          <Card className="border p-3">
            <h5>Tổng nước</h5>
            <CountUp end={report.totalWater} suffix=" ₫" />
          </Card>
        </Col>
      </Row>

      {/* Bộ lọc */}
      <Row className="mb-4">
        <Col md={4}>
          <Form.Control type="date" placeholder="Từ ngày đến ngày" />
        </Col>
        <Col md={4}>
          <Form.Select value={month} onChange={handleChangeMonth}>
            <option value="">Chọn tháng</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i + 1}>
                Tháng {i + 1}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={4} className="text-right">
          <Button variant="primary">
            <FaFileExcel /> Xuất Excel báo cáo
          </Button>
        </Col>
      </Row>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Phòng</th>
            <th>Ngày</th>
            <th>Tiền phòng</th>
            <th>Tiền dịch vụ</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {bills.map((bill) => {
            return (
              <tr key={bill.id}>
                <td>{bill.contracts.rooms.room_number}</td>
                <td>{new Date(bill.created_at).toLocaleDateString()}</td>
                <td>{formatVnd(bill.contracts.rooms.price)}</td>
                <td>{formatVnd(bill.service_fee)}</td>
                <td>{formatVnd(bill.total_amount)}</td>
                <td>
                  {bill.status === "pending" && "Chưa thanh toán"}
                  {bill.status === "paid" && "Đã thanh toán"}
                  {bill.status === "partially_paid" && "Đã thanh toán một phần"}
                  {bill.status === "overdue" && "Quá hạn"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Container>
  );
}
