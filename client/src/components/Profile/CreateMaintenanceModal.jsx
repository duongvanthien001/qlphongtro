import { useEffect, useState } from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import { getRoomsCurrentUser } from "../../services/roomService";
import { formatAxiosError } from "../../utils/formatAxiosError";
import { createMaintenance } from "../../services/maintenancesService";
import { toast } from "react-hot-toast";

export default function CreateMaintenanceModal({
  show,
  handleClose,
  setMaintenances,
}) {
  const [rooms, setRooms] = useState([]);
  const [values, setValues] = useState({
    room_id: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

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
      const { maintenances, message } = await createMaintenance(values);
      setMaintenances((prev) => [maintenances, ...prev]);
      setValues({
        room_id: "",
        description: "",
      });
      toast.success(message);
      handleClose();
    } catch (error) {
      setError(formatAxiosError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (show) {
      getRoomsCurrentUser().then((rooms) => {
        setRooms(rooms);
      });
    }
  }, [show]);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Tạo phiếu bảo trì</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <div className="alert alert-danger">{error}</div>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4">
            <Form.Label>Phòng</Form.Label>
            <Form.Select
              name="room_id"
              value={values.room_id}
              onChange={handleChange}
              required
            >
              <option value="">
                {rooms.length === 0 ? "Không có phòng" : "Chọn phòng"}
              </option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.room_number}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>Mô tả</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={values.description}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="text-end">
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner animation="border" size="sm" />
                  Loading...
                </>
              ) : (
                "Tạo"
              )}
            </Button>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
