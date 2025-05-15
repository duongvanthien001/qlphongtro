import React, { useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { updateMaintenance } from "../../services/maintenancesService";
import { formatAxiosError } from "../../utils/formatAxiosError";
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";

export default function UpdateMaintenance() {
  const maintenance = useLoaderData();
  const [values, setValues] = useState({
    description: maintenance.description,
    status: maintenance.status,
    request_date: maintenance.request_date,
    resolved_date: maintenance.resolved_date,
  });

  const navigate = useNavigate();
  const [error, setError] = useState(null);
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
      await updateMaintenance(maintenance.id, values);
      navigate("/admin/list-maintenances");
    } catch (error) {
      setError(formatAxiosError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="my-5">
      <h2 className="mb-4">Sửa Bảo Trì</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Trạng thái</Form.Label>
              <Form.Select
                as="select"
                name="status"
                value={values.status}
                onChange={handleChange}
                required
              >
                <option value="pending">Chờ xử lý</option>
                <option value="in_progress">Đang xử lý</option>
                <option value="completed">Đã xử lý</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Ngày yêu cầu</Form.Label>
              <Form.Control
                type="date"
                name="request_date"
                value={
                  new Date(values.request_date).toISOString().split("T")[0]
                }
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Ngày giải quyết</Form.Label>
              <Form.Control
                type="date"
                name="resolved_date"
                value={
                  values.resolved_date
                    ? new Date(values.resolved_date).toISOString().split("T")[0]
                    : ""
                }
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Nhập mô tả"
                name="description"
                value={values.description}
                onChange={handleChange}
              />
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
