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
import { useLoaderData, useNavigate } from "react-router-dom";
import { updatePayment } from "../../services/paymentService";
import { formatAxiosError } from "../../utils/formatAxiosError";

export default function UpdatePayment() {
  const payment = useLoaderData();
  const [values, setValues] = useState({
    amount: payment.amount,
    payment_date: new Date(payment.payment_date).toISOString().split("T")[0],
    payment_method: payment.payment_method,
  });
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const type = e.target.type;
    setValues({
      ...values,
      [e.target.name]: type === "checkbox" ? e.target.checked : e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await updatePayment(payment.id, values);
      navigate("/admin/list-payment");
    } catch (error) {
      setError(formatAxiosError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="my-5">
      <h2 className="mb-4">Sửa Thanh Toán</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Số tiền</Form.Label>
              <Form.Control
                type="number"
                placeholder="Nhập số tiền"
                name="amount"
                value={values.amount}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label>Ngày thanh toán</Form.Label>
              <Form.Control
                type="date"
                name="payment_date"
                value={values.payment_date}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Phương thức thanh toán</Form.Label>
              <Form.Select
                name="payment_method"
                value={values.payment_method}
                onChange={handleChange}
                required
              >
                <option value="cash">Tiền mặt</option>
                <option value="bank_transfer">Chuyển khoản </option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Button variant="primary" type="submit">
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
