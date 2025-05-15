import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { updateRoom } from "../../services/roomService";
import { useLoaderData, useNavigate } from "react-router-dom";
import { formatAxiosError } from "../../utils/formatAxiosError";

export default function UpdateRoom() {
  const room = useLoaderData();
  const [formData, setFormData] = useState({
    room_number: room.room_number,
    area: room.area,
    price: room.price,
    status: room.status,
    description: room.description,
  });
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await updateRoom(room.id, formData);
      navigate("/admin/list-room");
    } catch (error) {
      setError(formatAxiosError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="my-5">
      <h2 className="mb-4">Sửa Phòng</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="name">
              <Form.Label>Số phòng</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập số phòng"
                name="room_number"
                value={formData.room_number}
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
          <Col md={6}>
            <Form.Group controlId="status">
              <Form.Label>Trạng thái</Form.Label>
              <Form.Select
                as="select"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="available">Trống</option>
                <option value="occupied">Đã thuê</option>
                <option value="maintenance">Bảo trì</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Group controlId="description">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Nhập mô tả"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Button variant="primary" type="submit" disabled={isSubmitting}>
          Lưu
        </Button>
      </Form>
    </Container>
  );
}
