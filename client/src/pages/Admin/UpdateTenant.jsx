import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useLoaderData, useNavigate } from "react-router-dom";
import { formatAxiosError } from "../../utils/formatAxiosError";
import { updateUser } from "../../services/userService";

export default function UpdateTenant() {
  const user = useLoaderData();
  const [formData, setFormData] = useState({
    username: user.username,
    full_name: user.full_name,
    email: user.email,
    phone: user.phone,
    id_card: user.tenants.id_card || "",
    date_of_birth: user.tenants.date_of_birth || "",
    address: user.tenants.address || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
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
      setIsSubmitting(true);
      await updateUser(user.id, formData);
      navigate("/admin/list-tenant");
    } catch (error) {
      setError(formatAxiosError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="my-5">
      <h2 className="mb-4">Cập Nhật Thông Tin Khách Thuê</h2>

      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                disabled
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Họ và tên</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên khách"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập số điện thoại"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>CCCD/CMND</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập số CCCD/CMND"
                name="id_card"
                value={formData.id_card}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Ngày sinh</Form.Label>
              <Form.Control
                type="date"
                name="date_of_birth"
                value={
                  new Date(formData.date_of_birth).toISOString().split("T")[0]
                }
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={12}>
            <Form.Group>
              <Form.Label>Địa chỉ</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập địa chỉ"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Button variant="primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Spinner animation="border" size="sm" />
              Loading...
            </>
          ) : (
            "Lưu"
          )}
        </Button>
      </Form>
    </Container>
  );
}
