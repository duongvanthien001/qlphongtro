import { useState } from "react";
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { useLoaderData, useNavigate } from "react-router-dom";
import { updateService } from "../../services/serviceService";
import { formatAxiosError } from "../../utils/formatAxiosError";

export default function UpdateService() {
  const loaderService = useLoaderData();
  const [formData, setFormData] = useState({
    name: loaderService.name,
    unit_price: loaderService.unit_price,
    unit: loaderService.unit,
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(false);
      await updateService(loaderService.id, formData);
      navigate("/admin/list-service");
    } catch (error) {
      setError(formatAxiosError(error));
    } finally {
      setIsSubmitting(true);
    }
  };

  return (
    <Container className="my-5">
      <h2 className="mb-4">Sửa dịch vụ</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={4}>
            <Form.Group controlId="name">
              <Form.Label>Tên</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên dịch vụ"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group controlId="unit_price">
              <Form.Label>Giá theo đơn vị</Form.Label>
              <Form.Control
                type="number"
                placeholder="Nhập giá"
                name="unit_price"
                value={formData.unit_price}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="unit">
              <Form.Label>Đơn vị</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập đơn vị"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

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
