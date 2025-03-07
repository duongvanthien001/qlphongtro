import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { createBill } from "../../services/billService";
import { formatAxiosError } from "../../utils/formatAxiosError";
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";

const date = new Date();
date.setDate(date.getDate() + 3);

const INITIAL_VALUES = {
  contract_id: "",
  due_date: date.toISOString().split("T")[0],
  electricity_index: 0,
  water_index: 0,
  include_garbage_fee: false,
};

export default function CreateNewBill() {
  const contracts = useLoaderData();
  const [values, setValues] = useState(INITIAL_VALUES);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = async (e) => {
    const type = e.target.type;
    const name = e.target.name;
    const value = e.target.value;
    setValues({
      ...values,
      [name]: type === "checkbox" ? e.target.checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      await createBill(values);
      setValues(INITIAL_VALUES);
      navigate("/admin/list-bill");
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
          <Col md={4}>
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
          <Col md={4}>
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
          <Col md={4}>
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
          <Col md={12}>
            <Form.Group className="mb-3">
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
          <Col md={12}>
            <Form.Check
              type="checkbox"
              label="Bao gồm tiền rác"
              id="include_garbage_fee"
              checked={values.include_garbage_fee}
              name="include_garbage_fee"
              onChange={handleChange}
            />
          </Col>
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
