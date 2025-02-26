import React from "react";
import { Container, Row, Col, Table, Button } from "react-bootstrap";
import { FaPrint, FaDollarSign } from "react-icons/fa";

export default function ListBill() {
  const billDetails = [
    { name: "Tiền phòng", amount: "1,000,000 vnđ" },
    { name: "Tiền điện", amount: "17,500 vnđ" },
    { name: "Tiền nước", amount: "125,000 vnđ" },
  ];

  const totalAmount = "1,142,500 vnđ";

  return (
    <Container className="my-5">
      <h5 className="mb-4">Hóa đơn: Phòng 0</h5>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Loại tiền</th>
            <th>Chỉ số</th>
            <th>Số tiền</th>
          </tr>
        </thead>
        <tbody>
          {billDetails.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>
                {item.name === "Tiền phòng"
                  ? "1,000,000 vnđ"
                  : item.name === "Tiền điện"
                  ? "(15kwh - 10kwh = 5kwh x 3500đ)"
                  : "(15mm - 10mm = 5mm x 25000đ)"}
              </td>
              <td>{item.amount}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Row className="mb-4">
        <Col md={6}>
          <h5 className="text-danger">Tổng tiền: {totalAmount}</h5>
        </Col>
        <Col md={6} className="text-right">
          <Button variant="warning" className="mr-2 ">
            <FaPrint /> In hóa đơn
          </Button>
          <Button variant="success" className="mr-2">
            <FaDollarSign /> Thanh toán
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
