import { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import { createContract } from "../../services/contractService";
import { toast } from "react-hot-toast";
import { getUsers } from "../../services/userService";
import { formatAxiosError } from "../../utils/formatAxiosError";

const INITIAL_VALUES = {
  tenant_id: "",
  start_date: new Date().toISOString().split("T")[0],
  end_date: "",
  deposit: 0,
};

export default function CreateContractModal({
  show,
  handleClose,
  handleCloseRoomDetailModal,
  room_id,
  setRooms,
}) {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [users, setUsers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const data = await createContract({ ...values, room_id });
      setValues(INITIAL_VALUES);
      setRooms((prevRooms) =>
        prevRooms.map((room) => {
          if (room.id === room_id) {
            return { ...room, status: "occupied" };
          }
          return room;
        })
      );
      toast.success(data.message);
      handleClose();
      handleCloseRoomDetailModal();
    } catch (error) {
      toast.error(formatAxiosError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (show) {
      getUsers({ role: "tenant" }).then((users) => setUsers(users));
    }
  }, [show]);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Tạo hợp đồng</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Row>
            <Col xs={12}>
              <Form.Group controlId="formBasicTenant" className="mb-4">
                <Form.Label>Người thuê</Form.Label>
                <Form.Select
                  placeholder="Chọn người thuê"
                  name="tenant_id"
                  value={values.tenant_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Chọn người thuê</option>
                  {users.map((user) => (
                    <option key={user.tenants.id} value={user.tenants.id}>
                      {user.full_name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12}>
              <Form.Group controlId="formBasicStartDate" className="mb-4">
                <Form.Label>Ngày bắt đầu</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Chọn ngày"
                  name="start_date"
                  value={values.start_date}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col xs={12}>
              <Form.Group controlId="formBasicEndDate" className="mb-4">
                <Form.Label>Ngày kết thúc</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Chọn ngày"
                  name="end_date"
                  value={values.end_date}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col xs={12}>
              <Form.Group controlId="formBasicDeposit" className="mb-4">
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
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner animation="border" size="sm" /> Loading...
              </>
            ) : (
              "Tạo"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
