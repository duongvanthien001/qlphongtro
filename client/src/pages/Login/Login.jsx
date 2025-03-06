import { useState } from "react";
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
import { Navigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const { token, refreshToken, message } = await login(username, password);
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);
      toast.success(message);
    } catch (error) {
      setError(formatAxiosError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (localStorage.getItem("token")) {
    return <Navigate to="/" />;
  }

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
