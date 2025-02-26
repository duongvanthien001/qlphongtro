import React, { useState } from "react";
import { Container, Row, Col, Table, Button, Form } from "react-bootstrap";
import { FaFileExcel, FaTrashAlt } from "react-icons/fa";

export default function Report() {
  const [reportData, setReportData] = useState([
    {
      id: 1,
      roomName: "Phòng 0",
      date: "03/07/2023",
      rent: "1,000,000 vnđ",
      electricity: "17,500 vnđ",
      water: "125,000 vnđ",
      extraFee: "0 vnđ",
      total: "1,142,500 vnđ",
      status: "Đã thanh toán",
    },
  ]);

  const totalIncome = "1,142,500 vnđ";
  const totalDebt = "0 vnđ";
  const totalElectricity = "17,500 vnđ";
  const totalWater = "17,500 vnđ";

  const handleDelete = (id) => {
    setReportData(reportData.filter((item) => item.id !== id));
  };

  return (
    <Container className="my-5">
      {/* Tổng quan */}
      <Row className="mb-4">
        <Col md={3} className="text-center ">
          <div className="border p-3">
            <h5>Tổng thu</h5>
            <p>{totalIncome}</p>
          </div>
        </Col>

        <Col md={3} className="text-center">
          <div className="border p-3">
            <h5>Tổng nợ</h5>
            <p>{totalDebt}</p>
          </div>
        </Col>

        <Col md={3} className="text-center">
          <div className="border p-3">
            <h5>Tổng điện</h5>
            <p>{totalElectricity}</p>
          </div>
        </Col>

        <Col md={3} className="text-center">
          <div className="border p-3">
            <h5>Tổng nước</h5>
            <p>{totalWater}</p>
          </div>
        </Col>
      </Row>

      {/* Bộ lọc */}
      <Row className="mb-4">
        <Col md={4}>
          <Form.Control type="date" placeholder="Từ ngày đến ngày" />
        </Col>
        <Col md={4}>
          <Form.Control as="select">
            <option>Tháng 7</option>
            <option>Tháng 8</option>
            <option>Tháng 9</option>
          </Form.Control>
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
            <th>Tên phòng</th>
            <th>Ngày</th>
            <th>Tiền phòng</th>
            <th>Tiền điện</th>
            <th>Tiền nước</th>
            <th>Tiền phụ thu</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {reportData.map((data, index) => (
            <tr key={data.id}>
              <td>{data.roomName}</td>
              <td>{data.date}</td>
              <td>{data.rent}</td>
              <td>{data.electricity}</td>
              <td>{data.water}</td>
              <td>{data.extraFee}</td>
              <td>{data.total}</td>
              <td>{data.status}</td>
              <td>
                <Button variant="danger" onClick={() => handleDelete(data.id)}>
                  <FaTrashAlt /> Xóa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
