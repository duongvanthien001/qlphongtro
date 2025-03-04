import { useCallback, useEffect, useState } from "react";
import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import { FaEdit, FaPlus, FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { deleteService, getServices } from "../../services/serviceService";
import { formatVnd } from "../../utils/formatVnd";

export default function ListService() {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchServices = useCallback(async ({ order, search }) => {
    try {
      setIsLoading(true);
      const services = await getServices({ order, search });
      setServices(services);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDelete = async (e, id) => {
    try {
      await deleteService(id);
      setServices((prevServices) =>
        prevServices.filter((service) => service.id !== id)
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const search = e.target.search.value;
    await fetchServices({ search });
  };

  const handleSort = async (e) => {
    const order = e.target.value;
    if (!order) {
      await fetchServices({});
      return;
    }
    await fetchServices({ order });
  };

  useEffect(() => {
    fetchServices({});
  }, [fetchServices]);

  return (
    <Container>
      <h2 className="my-4">Danh sách dịch vụ</h2>

      <Row className="mb-4 d-flex">
        <Col xs={3} className="position-relative">
          <Form onSubmit={handleSearch}>
            <Form.Control
              type="search"
              placeholder="Tìm kiếm..."
              name="search"
              id="search"
            />
          </Form>
        </Col>
        <Col xs={2}>
          <Form.Select onChange={handleSort}>
            <option value="">Sắp xếp</option>
            <option value="id:asc">Id: Tăng dần</option>
            <option value="id:desc">Id: Giảm dần</option>
            <option value="name:asc">Tên: A-Z</option>
            <option value="name:desc">Tên: Z-A</option>
            <option value="unit_price:asc">Giá: Tăng dần</option>
            <option value="unit_price:desc">Giá: Giảm dần</option>
          </Form.Select>
        </Col>

        <Col xs={3} className="ms-auto d-flex justify-content-end">
          <Link to="/admin/create-new-service">
            <Button variant="primary">
              <FaPlus /> Thêm dịch vụ
            </Button>
          </Link>
        </Col>
      </Row>

      {!isLoading && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Id</th>
              <th>Tên</th>
              <th>Giá theo đơn vị</th>
              <th>Đơn vị</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id}>
                <td>{service.id}</td>
                <td>{service.name}</td>
                <td>{formatVnd(service.unit_price)}</td>
                <td>{service.unit}</td>
                <td>
                  <div className="d-flex align-items-center">
                    <Link
                      to={`/admin/update-service/${service.id}`}
                      className="me-2"
                    >
                      <Button variant="warning">
                        <FaEdit /> Sửa
                      </Button>
                    </Link>
                    <Button
                      variant="danger"
                      onClick={(e) => handleDelete(e, service.id)}
                    >
                      <FaTrashAlt /> Xóa
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
