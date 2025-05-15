import React, { useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { updateUser } from "../../services/userService";
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";
import { toast } from "react-hot-toast";
import { formatAxiosError } from "../../utils/formatAxiosError";

export default function UpdateUser() {
  const loaderUser = useLoaderData();

  const id_card = loaderUser?.tenants?.id_card || "";

  const date_of_birth = loaderUser.tenants
    ? new Date(loaderUser.tenants.date_of_birth).toISOString().split("T")[0]
    : "";

  const address = loaderUser?.tenants?.address || "";

  const [values, setValues] = useState({
    username: loaderUser.username,
    full_name: loaderUser.full_name,
    email: loaderUser.email,
    phone: loaderUser.phone,
    role: loaderUser.role,
    password: "",
    id_card,
    date_of_birth,
    address,
  });
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (values.role !== "tenant") {
      delete values.id_card;
      delete values.date_of_birth;
      delete values.address;
    }

    if (!values.password) {
      delete values.password;
    }

    try {
      setIsSubmitting(true);
      const { message } = await updateUser(loaderUser.id, values);
      navigate("/admin/list-user");
      toast.success(message);
    } catch (error) {
      setError(formatAxiosError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="my-5">
      <h2 className="mb-4">Sửa người dùng</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={4}>
            <Form.Group controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập username"
                name="username"
                value={values.username}
                onChange={handleChange}
                required
                disabled
              />
            </Form.Group>
          </Col>
          <Col md={4}>
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
          <Col md={4}>
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
        </Row>

        <Row className="mb-3">
          <Col md={4}>
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
          <Col md={4}>
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
          <Col md={4}>
            <Form.Group controlId="password">
              <Form.Label>Mật khẩu</Form.Label>
              <Form.Control
                type="password"
                placeholder="Để trống nếu không muốn thay đổi"
                name="password"
                value={values.password}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        {values.role === "tenant" && (
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group controlId="id_card">
                <Form.Label>CCCD/CMND</Form.Label>
                <Form.Control
                  type="text"
                  name="id_card"
                  placeholder="Nhập CCCD/CMND"
                  value={values.id_card}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="date_of_birth">
                <Form.Label>Ngày sinh</Form.Label>
                <Form.Control
                  type="date"
                  name="date_of_birth"
                  value={values.date_of_birth}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="address">
                <Form.Label>Địa chỉ</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập địa chỉ"
                  name="address"
                  value={values.address}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
        )}

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
