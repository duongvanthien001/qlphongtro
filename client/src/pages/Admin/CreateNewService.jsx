import { useState } from "react";
import { Container, Form, Button, Spinner } from "react-bootstrap";
import { createService } from "../../services/serviceService";
import { formatAxiosError } from "../../utils/formatAxiosError";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function CreateNewService() {
  const [formData, setFormData] = useState({
    name: "",
    unit_price: 0,
    unit: "",
    type: "",
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
      const { message } = await createService(formData);
      navigate("/admin/list-service");
      toast.success(message);
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
        <Form.Group controlId="type" className="mb-3">
          <Form.Label>Loại dịch vụ</Form.Label>
          <Form.Select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="">Chọn loại dịch vụ</option>
            <option value="electricity">Điện</option>
            <option value="water">Nước</option>
            <option value="internet">Internet</option>
            <option value="other">Dịch vụ khác</option>
          </Form.Select>
        </Form.Group>

        <Button variant="primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Spinner animation="border" size="sm" /> Loading...
            </>
          ) : (
            "Lưu"
          )}
        </Button>
      </Form>
    </Container>
  );
}
