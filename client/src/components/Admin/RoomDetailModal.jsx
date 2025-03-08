import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import { formatVnd } from "../../utils/formatVnd";
import CreateContractModal from "./CreateContractModal";
import { useState } from "react";
import CreateBillModal from "./CreateBillModal";
import toast from "react-hot-toast";

export default function RoomDetailModal({ show, handleClose, room, setRooms }) {
  const [isShowCreateContract, setIsShowCreateContract] = useState(false);
  const [isShowCreateBill, setIsShowCreateBill] = useState(false);

  const handleCloseCreateContract = () => {
    setIsShowCreateContract(false);
  };

  const handleCloseCreateBill = () => {
    setIsShowCreateBill(false);
  };

  const handleOpenCreateBill = () => {
    const isHasActiveContract = room?.contracts.some(
      (contract) => contract.status === "active"
    );
    if (!isHasActiveContract) {
      toast.error("Không có hợp đồng nào đang hoạt động");
      return;
    }
    setIsShowCreateBill(true);
  };

  const contract_id = room?.contracts.find(
    (contract) => contract.status === "active"
  )?.id;

  return (
    <>
      {room && (
        <>
          <CreateBillModal
            contract_id={contract_id}
            show={isShowCreateBill}
            handleClose={handleCloseCreateBill}
            handleCloseRoomDetailModal={handleClose}
          />
          <CreateContractModal
            show={isShowCreateContract}
            room_id={room.id}
            handleClose={handleCloseCreateContract}
            handleCloseRoomDetailModal={handleClose}
            setRooms={setRooms}
          />
        </>
      )}

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
                    <Form.Select defaultValue={room.status} readOnly>
                      <option value="available">Trống</option>
                      <option value="occupied">Đã thuê</option>
                      <option value="maintenance">Bảo trì</option>
                    </Form.Select>
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
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
          {room?.status === "available" && (
            <Button
              variant="success"
              onClick={() => setIsShowCreateContract(true)}
            >
              Tạo hợp đồng
            </Button>
          )}
          <Button variant="primary" onClick={handleOpenCreateBill}>
            Tạo hóa đơn
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
