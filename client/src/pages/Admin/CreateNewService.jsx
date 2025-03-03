import { useState } from "react";
import { Container, Form, Button, Spinner } from "react-bootstrap";
import { createService } from "../../services/serviceService";
import { formatAxiosError } from "../../utils/formatAxiosError";
import { useNavigate } from "react-router-dom";

export default function CreateNewService() {
  const [formData, setFormData] = useState({
    name: "",
    unit_price: 0,
    unit: "",
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
      setIsSubmitting(true);
      await createService(formData);
      navigate("/admin/list-service");
    } catch (error) {
      setError(formatAxiosError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="my-5">
      <h2 className="mb-4">Thêm dịch vụ</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <Form className="mb-3" onSubmit={handleSubmit}>
        <Form.Group controlId="name" className="mb-3">
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
        <Form.Group controlId="unit_price" className="mb-3">
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
        <Form.Group controlId="unit" className="mb-3">
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

        <Button variant="primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Spinner animation="border" /> Loading...
            </>
          ) : (
            "Lưu"
          )}
        </Button>
      </Form>
    </Container>
  );
}
