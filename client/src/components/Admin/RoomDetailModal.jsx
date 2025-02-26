import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import { formatVnd } from "../../utils/formatVnd";

export default function RoomDetailModal({ show, handleClose, roomInfo }) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Thông tin phòng</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {roomInfo && (
          <Form>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="roomName">
                  <Form.Label>Tên phòng</Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={roomInfo.name}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="roomArea">
                  <Form.Label>Diện tích</Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={`${roomInfo.area}m²`}
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
                    data-value={roomInfo.price}
                    defaultValue={formatVnd(roomInfo.price)}
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
                      roomInfo.status === "available" ? "Trống" : "Đã thuê"
                    }
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="roomPrice">
                  <Form.Label>Chủ trọ</Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={roomInfo.owners.name}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="roomStatus">
                  <Form.Label>Dịch vụ</Form.Label>
                  <Form.Control type="text" defaultValue={""} readOnly />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="electricityFee">
                  <Form.Label>Tiền điện</Form.Label>
                  <Form.Control type="text" value={roomInfo.electricityFee} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="waterFee">
                  <Form.Label>Tiền nước</Form.Label>
                  <Form.Control type="text" value={roomInfo.waterFee} />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="trashFee">
                  <Form.Label>Tiền rác</Form.Label>
                  <Form.Control type="text" defaultValue={roomInfo.trashFee} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="extraFee">
                  <Form.Label>Phụ thu</Form.Label>
                  <Form.Control type="text" defaultValue={roomInfo.extraFee} />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Đóng
        </Button>
        <Button variant="primary" onClick={handleClose}>
          Tạo hóa đơn
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
