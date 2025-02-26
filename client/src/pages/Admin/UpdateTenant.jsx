import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

export default function UpdateTenant() {
  const [formData, setFormData] = useState({
    roomName: "Phòng 0",
    rent: 1,
    electricityIndex: 1,
    electricityFee: 1,
    waterIndex: 1,
    waterFee: 1,
    wifiFee: 0,
    airConditionerFee: 0,
    wasteFee: 0,
    extraFee: 0,
    billingDate: "00/00/0000",
    roomType: "Phòng bình thường",
    roomStatus: "Phòng trống",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data submitted:", formData);
  };
  return (
    <Container className="my-5">
      <h2 className="mb-4">Cập Nhật Thông Tin Khách Thuê</h2>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="roomName">
              <Form.Label>Họ và tên</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên khách"
                name="roomName"
                value={formData.roomName}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="rent">
              <Form.Label>Tuổi</Form.Label>
              <Form.Control
                type="number"
                placeholder="Nhập tuổi"
                name="rent"
                value={formData.rent}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="wasteFee">
              <Form.Label>Số diện thoại</Form.Label>
              <Form.Control
                type="number"
                placeholder="Nhập số điện thoại"
                name="wasteFee"
                value={formData.wasteFee}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="roomStatus">
              <Form.Label>Phòng</Form.Label>
              <Form.Control
                as="select"
                name="roomStatus"
                value={formData.roomStatus}
                onChange={handleChange}
                required
              >
                <option>Phòng 1</option>
                <option>Phòng 2</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>

        <Button variant="primary" type="submit">
          Lưu
        </Button>
      </Form>
    </Container>
  );
}
