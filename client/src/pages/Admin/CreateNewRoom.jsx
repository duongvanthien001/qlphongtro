import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { createRoom } from "../../services/roomService";
import { useNavigate } from "react-router-dom";

export default function CreateNewRoom() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    area: 0,
    price: 0,
    status: "available",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createRoom(formData);
      navigate("/admin/list-room");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container className="my-5">
      <h2 className="mb-4">Thêm Phòng</h2>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="name">
              <Form.Label>Tên phòng</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên phòng"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="area">
              <Form.Label>
                Diện tích (m<sup>2</sup>)
              </Form.Label>
              <Form.Control
                type="number"
                placeholder="Nhập diện tích phòng"
                name="area"
                value={formData.area}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="price">
              <Form.Label>Tiền phòng (tháng)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Nhập tiền phòng"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
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
