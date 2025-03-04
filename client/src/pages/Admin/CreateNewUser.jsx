import { useState } from "react";
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";
import { createUser } from "../../services/userService";
import { formatAxiosError } from "../../utils/formatAxiosError";
import { useNavigate } from "react-router-dom";

export default function CreateNewUser() {
  const [values, setValues] = useState({
    full_name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    role: "admin",
    date_of_birth: "",
    id_card: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTenant, setIsTenant] = useState(false);
  const navigate = useNavigate();

  const handleChange = async (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setValues({ ...values, [name]: value });

    if (name === "role") {
      setIsTenant(value === "tenant");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (values.role !== "tenant") {
      delete values.date_of_birth;
      delete values.id_card;
      delete values.address;
    }

    try {
      setIsSubmitting(true);
      await createUser(values);
      navigate("/admin/list-user");
    } catch (error) {
      setError(formatAxiosError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="d-flex align-items-center vh-100">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={8} md={6} className="login-form">
            <h2 className="text-center">Thêm người dùng</h2>

            {/* Error message */}
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group controlId="formBasicFullName" className="mb-4">
                    <Form.Label>Ho và tên</Form.Label>
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
                      required
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
                  <Form.Group controlId="formBasicRole" className="mb-4">
                    <Form.Label>Vai trò</Form.Label>
                    <Form.Select
                      placeholder="Chọn vai trò"
                      name="role"
                      value={values.role}
                      onChange={handleChange}
                      required
                    >
                      <option value="admin">Chủ trọ</option>
                      <option value="staff">Nhân viên</option>
                      <option value="tenant">Người thuê</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                {isTenant && (
                  <>
                    <Col md={6}>
                      <Form.Group
                        controlId="formBasicDateOfBirth"
                        className="mb-4"
                      >
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
                          required
                        />
                      </Form.Group>
                    </Col>
                  </>
                )}
              </Row>

              {/* Submit button */}
              <Button
                variant="primary"
                type="submit"
                className="w-100"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Spinner animation="border" size="sm" /> Loading...
                  </>
                ) : (
                  "Lưu"
                )}
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
