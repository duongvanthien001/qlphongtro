import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { getRoomById, updateRoom } from "../../services/roomService";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateRoom() {
  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    area: "",
    price: 0,
    status: "available",
  });
  const { id } = useParams();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateRoom(id, formData);

      navigate("/admin/list-room");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!id) return;
    getRoomById(id)
      .then((room) => {
        setFormData(room);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id]);

  return (
    <Container className="my-5">
      <h2 className="mb-4">Sửa Phòng</h2>
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
              </Form.Select>
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
