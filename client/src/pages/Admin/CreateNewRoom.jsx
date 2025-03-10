import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Spinner } from "react-bootstrap";
import { createRoom } from "../../services/roomService";
import { useNavigate } from "react-router-dom";
import { formatAxiosError } from "../../utils/formatAxiosError";
import toast from "react-hot-toast";

export default function CreateNewRoom() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    room_number: "",
    area: 0,
    price: 0,
    status: "available",
    description: "",
  });
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
      const { message } = await createRoom(formData);
      navigate("/admin/list-room");
      toast.success(message);
    } catch (error) {
      setError(formatAxiosError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="my-5">
      <h2 className="mb-4">Thêm Phòng</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={4}>
            <Form.Group controlId="room_number">
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
          <Col md={4}>
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
          <Col md={4}>
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

        <Row className="mb-3">
          <Col>
            <Form.Group controlId="description">
              <Form.Label>Mô tả (không bắt buộc)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Nhập mô tả"
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Button variant="primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Spinner animation="border" /> Loading...
            </>
          ) : (
            "Lưu"
          )}
        </Button>
      </Form>
    </Container>
  );
}
