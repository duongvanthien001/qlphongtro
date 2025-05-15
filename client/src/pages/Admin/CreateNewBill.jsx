import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { createBill } from "../../services/billService";
import { formatAxiosError } from "../../utils/formatAxiosError";
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { formatVnd } from "../../utils/formatVnd";
import toast from "react-hot-toast";

const date = new Date();
date.setDate(date.getDate() + 3);

const INITIAL_VALUES = {
  contract_id: "",
  due_date: date.toISOString().split("T")[0],
  electricity_index: 0,
  water_index: 0,
  service_ids: [],
};

export default function CreateNewBill() {
  const { contracts, services } = useLoaderData();
  const [values, setValues] = useState(INITIAL_VALUES);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = async (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const type = e.target.type;

    if (type === "checkbox") {
      const serviceId = parseInt(name.split("_")[1]);
      const isChecked = e.target.checked;

      setValues((prev) => {
        if (isChecked) {
          return { ...prev, service_ids: [...prev.service_ids, serviceId] };
        }
        return {
          ...prev,
          service_ids: prev.service_ids.filter((id) => id !== serviceId),
        };
      });

      return;
    }

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      const { message } = await createBill(values);
      setValues(INITIAL_VALUES);
      navigate("/admin/list-bill");
      toast.success(message);
    } catch (error) {
      setError(formatAxiosError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="my-5">
      <h2 className="mb-4">Thêm hóa đơn</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col xs={12} md={6}>
            <Form.Group>
              <Form.Label>Chỉ số điện (kWh)</Form.Label>
              <Form.Control
                type="number"
                name="electricity_index"
                value={values.electricity_index}
                onChange={handleChange}
                step={0.01}
                min={1}
                required
              />
            </Form.Group>
          </Col>
          <Col xs={12} md={6}>
            <Form.Group>
              <Form.Label>Chỉ số nước (m³)</Form.Label>
              <Form.Control
                type="number"
                value={values.water_index}
                name="water_index"
                onChange={handleChange}
                step={0.01}
                min={1}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col xs={12} md={6}>
            <Form.Group>
              <Form.Label>Phòng</Form.Label>
              <Form.Select name="contract_id" onChange={handleChange} required>
                <option value="">Chọn phòng</option>
                {contracts.map((contract) => (
                  <option key={contract.id} value={contract.id}>
                    {contract.rooms.room_number} -{" "}
                    {contract.tenants.users.full_name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col xs={12} md={6}>
            <Form.Group>
              <Form.Label>Hạn thanh toán</Form.Label>
              <Form.Control
                type="date"
                value={values.due_date}
                name="due_date"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          {services.map((service) => (
            <Col key={service.id}>
              <Form.Check
                type="checkbox"
                label={`Tiền ${service.name} - ${formatVnd(
                  service.unit_price
                )}/${service.unit}`}
                id={`service_${service.id}`}
                name={`service_${service.id}`}
                checked={values.service_ids.includes(service.id)}
                onChange={handleChange}
              />
            </Col>
          ))}
        </Row>

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
