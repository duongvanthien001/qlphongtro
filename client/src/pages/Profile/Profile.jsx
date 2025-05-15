import { useState } from "react";
import {
  Row,
  Col,
  Form,
  Card,
  CardBody,
  Button,
  Spinner,
} from "react-bootstrap";
import { useLoaderData, useNavigate } from "react-router-dom";
import { changePassword, updateCurrentUser } from "../../services/userService";
import { toast } from "react-hot-toast";
import { formatAxiosError } from "../../utils/formatAxiosError";

export default function Profile() {
  const user = useLoaderData();
  const [values, setValues] = useState({
    full_name: user.full_name,
    email: user.email,
    phone: user.phone,
    id_card: user?.tenants?.id_card || "",
    date_of_birth: user?.tenants?.date_of_birth,
    address: user?.tenants?.address || "",
  });
  const [isSubmittingUpdate, setIsSubmittingUpdate] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const [errorUpdate, setErrorUpdate] = useState(null);
  const [errorPassword, setErrorPassword] = useState(null);
  const [password, setPassword] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const navigate = useNavigate();

  const handleChangePassword = (e) => {
    const { name, value } = e.target;
    setPassword({ ...password, [name]: value });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();

    try {
      setIsSubmittingUpdate(true);
      const { user, message } = await updateCurrentUser(values);
      setValues({
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        id_card: user?.tenants?.id_card || "",
        date_of_birth: user?.tenants?.date_of_birth,
        address: user?.tenants?.address || "",
      });
      toast.success(message);
    } catch (error) {
      setErrorUpdate(formatAxiosError(error));
    } finally {
      setIsSubmittingUpdate(false);
    }
  };

  const handleSubmitPassword = async (e) => {
    e.preventDefault();

    try {
      setIsSubmittingPassword(true);
      const { message } = await changePassword(password);
      toast.success(message);
      navigate("/logout");
    } catch (error) {
      setErrorPassword(formatAxiosError(error));
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  return (
    <Col md={9}>
      <Card className="mb-4">
        <CardBody>
          <h3 className="mb-4">Thông tin cá nhân</h3>
          <Form
            className="d-flex flex-column align-items-end"
            onSubmit={handleSubmitUpdate}
          >
            {errorUpdate && (
              <div className="alert alert-danger">{errorUpdate}</div>
            )}
            <Row>
              <Col md={6} className="mb-4">
                <Form.Group>
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={user.username}
                    onChange={handleChange}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-4">
                <Form.Group>
                  <Form.Label>Họ và tên</Form.Label>
                  <Form.Control
                    type="text"
                    name="full_name"
                    value={values.full_name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-4">
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="text"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-4">
                <Form.Group>
                  <Form.Label>Số điện thoại</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={values.phone}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              {user.role === "tenant" && (
                <>
                  <Col md={6} className="mb-4">
                    <Form.Group>
                      <Form.Label>CCCD/CMND</Form.Label>
                      <Form.Control
                        type="text"
                        name="id_card"
                        value={values.id_card}
                        onChange={handleChange}
                        placeholder="Nhập CCCD/CMND"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-4">
                    <Form.Group>
                      <Form.Label>Ngày sinh</Form.Label>
                      <Form.Control
                        type="date"
                        name="date_of_birth"
                        value={
                          new Date(values.date_of_birth)
                            .toISOString()
                            .split("T")[0]
                        }
                        onChange={handleChange}
                        placeholder="Chọn ngày sinh"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-4">
                    <Form.Group>
                      <Form.Label>Địa chỉ (không bắt buộc)</Form.Label>
                      <Form.Control
                        type="text"
                        name="address"
                        value={values.address}
                        onChange={handleChange}
                        placeholder="Nhập địa chỉ"
                      />
                    </Form.Group>
                  </Col>
                </>
              )}
            </Row>

            <Button
              type="submit"
              variant="primary"
              disabled={isSubmittingUpdate}
            >
              {isSubmittingUpdate ? (
                <span>
                  <Spinner animation="border" size="sm" /> Loading...
                </span>
              ) : (
                "Cập nhật"
              )}
            </Button>
          </Form>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <h3 className="mb-4">Đổi mật khẩu</h3>
          {errorPassword && (
            <div className="alert alert-danger">{errorPassword}</div>
          )}
          <Form onSubmit={handleSubmitPassword}>
            <Row>
              <Col xs={12} className="mb-4">
                <Form.Group>
                  <Form.Label>Mật khẩu cũ</Form.Label>
                  <Form.Control
                    type="password"
                    name="old_password"
                    onChange={handleChangePassword}
                    required
                  />
                </Form.Group>
              </Col>
              <Col xs={12} className="mb-4">
                <Form.Group>
                  <Form.Label>Mật khẩu mới</Form.Label>
                  <Form.Control
                    type="password"
                    name="new_password"
                    placeholder="Nhập mật khẩu mới"
                    onChange={handleChangePassword}
                    required
                  />
                </Form.Group>
              </Col>
              <Col xs={12} className="mb-4">
                <Form.Group>
                  <Form.Label>Nhập lại mật khẩu mới</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirm_password"
                    onChange={handleChangePassword}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <div className="d-flex justify-content-end">
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmittingPassword}
              >
                {isSubmittingPassword ? (
                  <span>
                    <Spinner animation="border" size="sm" /> Loading...
                  </span>
                ) : (
                  "Đổi mật khẩu"
                )}
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
    </Col>
  );
}
