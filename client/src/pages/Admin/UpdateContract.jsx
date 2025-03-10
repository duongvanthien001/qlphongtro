import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { updateContract } from "../../services/contractService";
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";
import toast from "react-hot-toast";
import { formatAxiosError } from "../../utils/formatAxiosError";

export default function UpdateContract() {
  const contract = useLoaderData();
  const [values, setValues] = useState({
    start_date: contract.start_date,
    end_date: contract.end_date,
    deposit: contract.deposit,
    status: contract.status,
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
      const { message } = await updateContract(contract.id, values);
      navigate("/admin/list-contract");
      toast.success(message);
    } catch (error) {
      setError(formatAxiosError(error));
    } finally {
      setIsSubmiting(false);
    }
  };

  return (
    <Container className="my-5">
      <h2 className="mb-4">Sửa hợp đồng</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Ngày bắt đầu</Form.Label>
              <Form.Control
                type="date"
                name="start_date"
                value={new Date(values.start_date).toISOString().split("T")[0]}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label>Ngày kết thúc</Form.Label>
              <Form.Control
                type="date"
                name="end_date"
                value={new Date(values.end_date).toISOString().split("T")[0]}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
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
          <Col md={6}>
            <Form.Group controlId="status">
              <Form.Label>Trạng thái</Form.Label>
              <Form.Select
                as="select"
                name="status"
                value={values.status}
                onChange={handleChange}
                required
              >
                <option value="active">Hoạt động</option>
                <option value="expired">Hết hạn</option>
                <option value="terminated">Chấm dứt</option>
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
