import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { createContract } from "../../services/contractService";
import { formatAxiosError } from "../../utils/formatAxiosError";
import { Button, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import toast from "react-hot-toast";

const INITIAL_VALUES = {
  room_id: "",
  tenant_id: "",
  start_date: new Date().toISOString().split("T")[0],
  end_date: "",
  deposit: "",
};

export default function CreateNewContract() {
  const { rooms, users } = useLoaderData();
  const [values, setValues] = useState(INITIAL_VALUES);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = async (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      const { message } = await createContract(values);
      setValues(INITIAL_VALUES);
      navigate("/admin/list-contract");
      toast.success(message);
    } catch (error) {
      setError(formatAxiosError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="my-5">
      <h2 className="mb-4">Thêm hợp đồng</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Ngày bắt đầu</Form.Label>
              <Form.Control
                type="date"
                name="start_date"
                value={values.start_date}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Ngày kết thúc</Form.Label>
              <Form.Control
                type="date"
                name="end_date"
                value={values.end_date}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Tiền cọc</Form.Label>
              <Form.Control
                type="number"
                placeholder="Nhập tiền cọc"
                name="deposit"
                value={values.deposit}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Chọn phòng</Form.Label>
              <Form.Select name="room_id" onChange={handleChange} required>
                <option value="">Chọn phòng</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.room_number}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Chọn người thuê</Form.Label>
              <Form.Select name="tenant_id" onChange={handleChange} required>
                <option value="">Chọn người thuê</option>
                {users.map((user) => (
                  <option key={user.tenants.id} value={user.tenants.id}>
                    {user.full_name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
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
