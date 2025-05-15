import React, { useState } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import { FaDollarSign, FaPrint } from "react-icons/fa";
import { Navigate, useLoaderData } from "react-router-dom";
import { formatVnd } from "../../utils/formatVnd";
import CreatePaymentModal from "../../components/Admin/CreatePaymentModal";

export default function BillDetail() {
  const bill = useLoaderData();
  const [isShowModal, setIsShowModal] = useState(false);

  if (!bill) {
    return <Navigate to="/admin/list-bill" />;
  }

  return (
    <Container className="my-5">
      <CreatePaymentModal
        show={isShowModal}
        handleClose={() => setIsShowModal(false)}
        bill={bill}
      />
      <h4 className="mb-4">
        Hóa đơn: Phòng {bill.contracts.rooms.room_number}
      </h4>
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

      <Row className="mb-4">
        <Col md={6}>
          <h4 className="text-danger">
            Tổng tiền: {formatVnd(bill.total_amount)}
          </h4>
        </Col>
        <Col md={6} className="d-flex justify-content-end d-print-none">
          <Button
            variant="warning"
            className="me-2"
            onClick={() => window.print()}
          >
            <FaPrint /> In hóa đơn
          </Button>
          {bill.status !== "paid" && (
            <Button variant="success" onClick={() => setIsShowModal(true)}>
              <FaDollarSign /> Thanh toán
            </Button>
          )}
        </Col>
      </Row>
    </Container>
  );
}
