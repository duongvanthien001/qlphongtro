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
import { useNavigate } from "react-router-dom";
import { createUser } from "../../services/userService";
import { formatAxiosError } from "../../utils/formatAxiosError";
import toast from "react-hot-toast";

export default function CreateNewTenant() {
  const [values, setValues] = useState({
    full_name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    date_of_birth: "",
    role: "tenant",
    id_card: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = async (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      const { message } = await createUser(values);
      navigate("/admin/list-tenant");
      toast.success(message);
    } catch (error) {
      setError(formatAxiosError(error));
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Container className="my-5">
      <h2 className="mb-4">Thêm Khách Thuê</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group controlId="formBasicFullName" className="mb-4">
              <Form.Label>Họ và tên</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập họ và tên của bạn"
                name="full_name"
                value={values.full_name}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="formBasicUsername" className="mb-4">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập username của bạn"
                name="username"
                value={values.username}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="formBasicEmail" className="mb-4">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập email của bạn"
                name="email"
                value={values.email}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="formBasicPhone" className="mb-4">
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập số điện thoại của bạn"
                name="phone"
                value={values.phone}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="formBasicPassword" className="mb-4">
              <Form.Label>Mật khẩu</Form.Label>
              <Form.Control
                type="password"
                placeholder="Nhập mật khẩu"
                name="password"
                value={values.password}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="formBasicDateOfBirth" className="mb-4">
              <Form.Label>Ngày sinh</Form.Label>
              <Form.Control
                type="date"
                placeholder="Chọn ngày sinh"
                name="date_of_birth"
                value={values.date_of_birth}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="formBasicIdCard" className="mb-4">
              <Form.Label>CCCD/CMND</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập số CCCD/CMND"
                name="id_card"
                value={values.id_card}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group controlId="formBasicAddress" className="mb-4">
              <Form.Label>Địa chỉ (không bắt buộc)</Form.Label>
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

        {/* Submit button */}
        <Button variant="primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Spinner animation="border" size="sm" /> Loading...
            </>
          ) : (
            "Lưu"
          )}
        </Button>
      </Form>
    </Container>
  );
}
