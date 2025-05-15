import React, { useState } from "react";
import { Navigate, useLoaderData, useNavigate } from "react-router-dom";
import { updateBill } from "../../services/billService";
import {
  Form,
  Button,
  Col,
  Container,
  Row,
  Spinner,
  Alert,
} from "react-bootstrap";
import { formatAxiosError } from "../../utils/formatAxiosError";

export default function UpdateBill() {
  const bill = useLoaderData();
  const [values, setValues] = useState({
    total_amount: bill.total_amount,
    status: bill.status,
    due_date: bill.due_date,
    created_at: bill.created_at,
  });
  const navigate = useNavigate();
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmiting(true);
      await updateBill(bill.id, values);
      navigate("/admin/list-bill");
    } catch (error) {
      setError(formatAxiosError(error));
    } finally {
      setIsSubmiting(false);
    }
  };

  if (!bill) return <Navigate to="/admin/list-bill" />;

  return (
    <Container className="my-5">
      <h2 className="mb-4">Sửa hóa đơn</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Tổng cộng</Form.Label>
              <Form.Control
                type="number"
                name="total_amount"
                value={values.total_amount}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label>Hạn thanh toán</Form.Label>
              <Form.Control
                type="date"
                name="due_date"
                value={new Date(values.due_date).toISOString().split("T")[0]}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Ngày tạo</Form.Label>
              <Form.Control
                type="date"
                name="created_at"
                value={new Date(values.created_at).toISOString().split("T")[0]}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Trạng thái</Form.Label>
              <Form.Select
                name="status"
                value={values.status}
                onChange={handleChange}
              >
                <option value="pending">Chưa thanh toán</option>
                <option value="paid">Đã thanh toán</option>
                <option value="partially_paid">Đã thanh toán một phần</option>
                <option value="overdue">Quá hạn</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Button variant="primary" type="submit" disabled={isSubmiting}>
          {isSubmiting ? (
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
