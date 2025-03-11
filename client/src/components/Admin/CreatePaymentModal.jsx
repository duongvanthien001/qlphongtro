import { useState } from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import { createPayment } from "../../services/paymentService";
import { toast } from "react-hot-toast";
import { formatAxiosError } from "../../utils/formatAxiosError";
import { useNavigate } from "react-router-dom";

export default function CreatePaymentModal({ show, handleClose, bill }) {
  const total_paid = bill.payments.reduce(
    (acc, payment) => acc + payment.amount,
    0
  );

  const [values, setValues] = useState({
    amount: bill.total_amount - total_paid,
    payment_method: "cash",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
      const { message, payment } = await createPayment({
        bill_id: bill.id,
        ...values,
      });
      toast.success(message);
      setValues({
        amount: bill.total_amount - total_paid - payment.amount,
        payment_method: "cash",
      });
      navigate("/admin/list-bill");
    } catch (error) {
      setError(formatAxiosError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Thêm thanh toán</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <div className="alert alert-danger">{error}</div>}

          <Form.Group className="mb-4">
            <Form.Label>Số tiền</Form.Label>
            <Form.Control
              type="number"
              name="amount"
              value={values.amount}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Phương thức thanh toán</Form.Label>
            <Form.Select
              value={values.payment_method}
              onChange={handleChange}
              name="payment_method"
            >
              <option value="cash">Tiền mặt</option>
              <option value="bank_transfer">Chuyển khoản</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
          <Button variant="success" type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner animation="border" size="sm" /> Loading...
              </>
            ) : (
              "Thanh toán"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
