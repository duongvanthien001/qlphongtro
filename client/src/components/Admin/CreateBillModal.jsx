import React, { useEffect, useState } from "react";
import { createBill } from "../../services/billService";
import toast from "react-hot-toast";
import { Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import { formatAxiosError } from "../../utils/formatAxiosError";
import { getServices } from "../../services/serviceService";
import { formatVnd } from "../../utils/formatVnd";

const date = new Date();
date.setDate(date.getDate() + 3);

const INITIAL_VALUES = {
  electricity_index: 0,
  water_index: 0,
  due_date: date.toISOString().split("T")[0],
  service_ids: [],
};

export default function CreateBillModal({
  show,
  handleClose,
  handleCloseRoomDetailModal,
  contract_id,
}) {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [services, setServices] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = async (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const type = e.target.type;

    if (type === "checkbox") {
      const serviceId = parseInt(name.split("_")[1]);
      const isChecked = e.target.checked;

      setValues((prev) => {
        if (isChecked) {
          return { ...prev, service_ids: [...prev.service_ids, serviceId] };
        }
        return {
          ...prev,
          service_ids: prev.service_ids.filter((id) => id !== serviceId),
        };
      });

      return;
    }

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      toast.error(formatAxiosError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (show) {
      getServices({
        type: "other",
        order: "id:asc",
      }).then((data) => {
        setServices(data);
      });
    }
  }, [show]);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Tạo hóa đơn</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Row>
            <Col xs={12} className="mb-3">
              <Form.Group>
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
            <Col xs={12} className="mb-3">
              <Form.Group>
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

            <Col xs={12} className="mb-3">
              <Form.Group>
                <Form.Label>Hạn thanh toán</Form.Label>
                <Form.Control
                  type="date"
                  value={values.due_date}
                  name="due_date"
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            {services.map((service) => (
              <Col xs={12} key={service.id} className="mb-1">
                <Form.Check
                  type="checkbox"
                  label={`Tiền ${service.name} - ${formatVnd(
                    service.unit_price
                  )}/${service.unit}`}
                  id={`service_${service.id}`}
                  name={`service_${service.id}`}
                  checked={values.service_ids.includes(service.id)}
                  onChange={handleChange}
                />
              </Col>
            ))}
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
