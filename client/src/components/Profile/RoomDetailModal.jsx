import { Col, Form, Modal, Row } from "react-bootstrap";
import { formatVnd } from "../../utils/formatVnd";

export default function RoomDetailModal({ show, handleClose, room }) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Thông tin phòng</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {room && (
          <Form>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="roomNumber">
                  <Form.Label>Số phòng</Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={room.room_number}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="roomArea">
                  <Form.Label>Diện tích</Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={`${room.area}m²`}
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="roomPrice">
                  <Form.Label>Giá phòng</Form.Label>
                  <Form.Control
                    type="text"
                    data-value={room.price}
                    defaultValue={formatVnd(room.price)}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="roomStatus">
                  <Form.Label>Trạng thái</Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={
                      room.status === "available"
                        ? "Trống"
                        : room.status === "occupied"
                        ? "Đã thuê"
                        : "Đang sửa"
                    }
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <Form.Group controlId="description">
                  <Form.Label>Mô tả</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={room.description || ""}
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
}
