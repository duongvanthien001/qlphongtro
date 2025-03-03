import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Container,
  Row,
  Col,
  Spinner,
  Alert,
} from "react-bootstrap";
import "./Login.css";
import { login } from "../../services/authService";
import { formatAxiosError } from "../../utils/formatAxiosError";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const { token, message, user } = await login(username, password);
      localStorage.setItem("token", token);
      toast.success(message);
      navigate(user.role === "tenant" ? "/profile" : "/admin");
    } catch (error) {
      setError(formatAxiosError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="login-page">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={8} md={6} lg={4} className="login-form">
            <h2 className="text-center">Đăng Nhập</h2>

            {/* Error message */}
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              {/* Username */}
              <Form.Group controlId="formBasicUsername" className="mb-4">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập username của bạn"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Form.Group>

              {/* Password */}
              <Form.Group controlId="formBasicPassword" className="mb-4">
                <Form.Label>Mật khẩu</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

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
                  "Đăng nhập"
                )}
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
