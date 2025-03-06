import React, { useState } from "react";
import { createBill } from "../../services/billService";
import toast from "react-hot-toast";
import { Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import { formatAxiosError } from "../../utils/formatAxiosError";

const date = new Date();
date.setDate(date.getDate() + 3);

const INITIAL_VALUES = {
  electricity_index: 0,
  water_index: 0,
  due_date: date.toISOString().split("T")[0],
  include_garbage_fee: false,
};

export default function CreateBillModal({
  show,
  handleClose,
  handleCloseRoomDetailModal,
  contract_id,
}) {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const data = await createBill({ ...values, contract_id });
      setValues(INITIAL_VALUES);
      toast.success(data.message);
      handleClose();
      handleCloseRoomDetailModal();
    } catch (error) {
      console.log(formatAxiosError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Tạo hóa đơn</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Row>
            <Col xs={12}>
              <Form.Group className="mb-4">
                <Form.Label>Chỉ số điện (kWh)</Form.Label>
                <Form.Control
                  type="number"
                  value={values.electricity_index}
                  name="electricity_index"
                  onChange={handleChange}
                  step={0.01}
                  min={1}
                  required
                />
              </Form.Group>
            </Col>
            <Col xs={12}>
              <Form.Group className="mb-4">
                <Form.Label>Chỉ số nước (m³)</Form.Label>
                <Form.Control
                  type="number"
                  value={values.water_index}
                  name="water_index"
                  onChange={handleChange}
                  step={0.01}
                  min={1}
                  required
                />
              </Form.Group>
            </Col>

            <Col xs={12}>
              <Form.Group className="mb-4">
                <Form.Label>Hạn thanh toán</Form.Label>
                <Form.Control
                  type="date"
                  value={values.due_date}
                  name="due_date"
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>

            <Col xs={12}>
              <Form.Check
                type="checkbox"
                label="Bao gồm tiền rác"
                id="include_garbage_fee"
                checked={values.include_garbage_fee}
                name="include_garbage_fee"
                onChange={handleChange}
              />
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
