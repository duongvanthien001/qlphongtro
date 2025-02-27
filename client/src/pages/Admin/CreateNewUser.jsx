import { useEffect, useState } from "react";
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
import { getTenants } from "../../services/tenantService";

export default function CreateNewUser() {
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    role: "owner",
    tenant: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tenants, setTenants] = useState([]);
  // const [isTenant, setIsTenant] = useState(false);
  const navigate = useNavigate();

  const handleChange = async (e) => {
    const name = e.target.name;
    const value = e.target.value;
    if (name === "role") {
      if (value === "tenant") {
        const tenants = await getTenants();
        setTenants(tenants);
        setValues({ ...values, [name]: value, tenant: tenants[0].id });
        return;
      }

      setValues({ ...values, [name]: value });
      setTenants([]);

      return;
    }
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (values.role === "owner") {
      delete values.tenant;
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
          <Col xs={12} sm={8} md={6} lg={4} className="login-form">
            <h2 className="text-center">Thêm người dùng</h2>

            {/* Error message */}
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              {/* Username */}
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

              {/* Email */}
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

              {/* Password */}
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

              {/* Role */}
              <Form.Group controlId="formBasicRole" className="mb-4">
                <Form.Label>Vai trò</Form.Label>
                <Form.Select
                  placeholder="Chọn vai trò"
                  name="role"
                  value={values.role}
                  onChange={handleChange}
                  required
                >
                  <option value="owner">Chủ trọ</option>
                  <option value="tenant">Người thuê trọ</option>
                </Form.Select>
              </Form.Group>

              {/* Select Tenant */}
              {tenants.length > 0 && (
                <Form.Group controlId="formBasicTenant" className="mb-4">
                  <Form.Label>Chọn người thuê trọ</Form.Label>
                  <Form.Select
                    placeholder="Chọn người thuê trọ"
                    name="tenant"
                    value={values.tenant}
                    onChange={handleChange}
                    required
                  >
                    {tenants.map((tenant) => (
                      <option key={tenant.id} value={tenant.id}>
                        {tenant.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              )}
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
                  "Thêm mới"
                )}
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
