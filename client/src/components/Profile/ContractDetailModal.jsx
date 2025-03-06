import { Col, Form, Modal, Row } from "react-bootstrap";
import { formatVnd } from "../../utils/formatVnd";

export default function ContractDetailModal({ show, handleClose, contract }) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Thông tin hợp đồng</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {contract && (
          <Form>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="startDate">
                  <Form.Label>Ngày bắt đầu</Form.Label>
                  <Form.Control
                    type="date"
                    defaultValue={
                      new Date(contract.start_date).toISOString().split("T")[0]
                    }
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="endDate">
                  <Form.Label>Ngày kết thúc</Form.Label>
                  <Form.Control
                    type="date"
                    defaultValue={
                      new Date(contract.end_date).toISOString().split("T")[0]
                    }
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="deposit">
                  <Form.Label>Tiền cọc</Form.Label>
                  <Form.Control
                    type="text"
                    defaultValue={formatVnd(contract.deposit)}
                    readOnly
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="contractStatus">
                  <Form.Label>Trạng thái</Form.Label>
                  <Form.Select value={contract.status} readOnly>
                    <option value="active">Hoạt động</option>
                    <option value="expired">Hết hạn</option>
                    <option value="terminated">Chấm dứt</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
}
