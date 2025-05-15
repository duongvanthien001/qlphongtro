import { Button, Col, Modal, Row, Table } from "react-bootstrap";
import { formatVnd } from "../../utils/formatVnd";

export default function BillDetailModal({ show, handleClose, bill }) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          Hóa đơn: Phòng {bill?.contracts.rooms.room_number}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {bill && (
          <>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Loại tiền</th>
                  <th>Chỉ số</th>
                  <th>Số tiền</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Tiền Phòng</td>
                  <td>1 tháng * {formatVnd(bill.room_fee)}</td>
                  <td>{formatVnd(bill.room_fee)}</td>
                </tr>
                {bill.service_usage.map((service_usage) => {
                  const usage_amount = service_usage.usage_amount;
                  const unit = service_usage.services.unit;
                  const unit_price = service_usage.services.unit_price;

                  const total = usage_amount * unit_price;

                  return (
                    <tr key={service_usage.id}>
                      <td>Tiền {service_usage.services.name} </td>
                      <td>
                        {usage_amount} {unit} * {formatVnd(unit_price)}
                      </td>
                      <td>{formatVnd(total)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            <Row>
              <Col md={6}>
                <h5 className="text-danger">
                  Tổng tiền: {formatVnd(bill.total_amount)}
                </h5>
              </Col>
            </Row>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
