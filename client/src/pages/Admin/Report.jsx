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
import { Navigate, useLoaderData } from "react-router-dom";
import { formatVnd } from "../../utils/formatVnd";
import CountUp from "react-countup";
import { getBills } from "../../services/billService";
import exportToExcel from "../../utils/exportToExcel";

const currentYear = new Date().getFullYear();

export default function Report() {
  const loaderData = useLoaderData();
  const [bills, setBills] = useState(loaderData?.initialBills || []);
  const [date, setDate] = useState({
    month: "",
    year: "",
  });

  const fetchBills = async (date) => {
    try {
      const bills = await getBills(date);
      setBills(bills);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeDate = (e) => {
    const { name, value } = e.target;
    setDate({
      ...date,
      [name]: value,
    });
    fetchBills({ ...date, [name]: value });
  };

  if (!loaderData) {
    return <Navigate to="/admin" />;
  }

  const { report } = loaderData;

  const excelBills = bills.map((bill) => {
    const totalPayment = bill.payments.reduce(
      (acc, payment) => acc + payment.amount,
      0
    );

    let status = "";
    if (bill.status === "pending") {
      status = "Chưa thanh toán";
    } else if (bill.status === "paid") {
      status = "Đã thanh toán";
    } else if (bill.status === "partially_paid") {
      status = `Đã thanh toán một phần (${formatVnd(totalPayment)})`;
    } else if (bill.status === "overdue") {
      status = "Quá hạn";
    }

    return {
      Phòng: bill.contracts.rooms.room_number,
      Ngày: new Date(bill.created_at).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      "Tiền phòng": formatVnd(bill.contracts.rooms.price),
      "Tiền dịch vụ": formatVnd(bill.service_fee),
      "Tổng tiền": formatVnd(bill.total_amount),
      "Trạng thái": status,
    };
  });

  const years = Array.from(
    { length: currentYear - (report.oldestYearOfBill - 1) },
    (_, i) => currentYear - i
  );

  return (
    <Container className="my-5">
      {/* Tổng quan */}
      <Row className="mb-4 g-3">
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
      <Row className="mb-4 g-3">
        <Col md={2}>
          <Form.Select
            name="month"
            value={date.month}
            onChange={handleChangeDate}
          >
            <option value="">Chọn tháng</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i + 1}>
                Tháng {i + 1}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={2} className="me-auto">
          <Form.Select
            name="year"
            value={date.year}
            onChange={handleChangeDate}
          >
            <option value="">Chọn năm</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={2} className="d-flex justify-content-end">
          <Button
            variant="primary"
            onClick={() => exportToExcel(excelBills, "report.xlsx")}
          >
            <FaFileExcel /> Xuất Excel
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
            const totalPayment = bill.payments.reduce(
              (acc, payment) => acc + payment.amount,
              0
            );
            return (
              <tr key={bill.id}>
                <td>{bill.contracts.rooms.room_number}</td>
                <td>
                  {new Date(bill.created_at).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </td>
                <td>{formatVnd(bill.contracts.rooms.price)}</td>
                <td>{formatVnd(bill.service_fee)}</td>
                <td>{formatVnd(bill.total_amount)}</td>
                <td>
                  {bill.status === "pending" && "Chưa thanh toán"}
                  {bill.status === "paid" && "Đã thanh toán"}
                  {bill.status === "partially_paid" &&
                    `Đã thanh toán một phần (${formatVnd(totalPayment)})`}
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
