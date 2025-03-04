import React, { useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { updateUser } from "../../services/userService";
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { toast } from "react-hot-toast";

export default function UpdateUser() {
  const loaderUser = useLoaderData();
  const [values, setValues] = useState({
    username: loaderUser.username,
    full_name: loaderUser.full_name,
    email: loaderUser.email,
    phone: loaderUser.phone,
    role: loaderUser.role,
  });
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const { message } = await updateUser(loaderUser.id, values);
      navigate("/admin/list-user");
      toast.success(message);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="my-5">
      <h2 className="mb-4">Sửa người dùng</h2>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập username"
                name="username"
                value={values.username}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="full_name">
              <Form.Label>Họ và tên</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập họ và tên"
                name="full_name"
                value={values.full_name}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập email"
                name="email"
                value={values.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="phone">
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control
                type="string"
                placeholder="Nhập số điện thoại"
                name="phone"
                value={values.phone}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Group controlId="role">
              <Form.Label>Vai trò</Form.Label>
              <Form.Select
                name="role"
                value={values.role}
                onChange={handleChange}
              >
                <option value="admin">Chủ trọ</option>
                <option value="staff">Nhân viên</option>
                <option value="tenant">Người thuê</option>
              </Form.Select>
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
