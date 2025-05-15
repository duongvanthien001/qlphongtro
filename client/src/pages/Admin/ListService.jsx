import { useCallback, useState } from "react";
import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import { FaEdit, FaPlus, FaTrashAlt } from "react-icons/fa";
import { Link, useLoaderData } from "react-router-dom";
import { deleteService, getServices } from "../../services/serviceService";
import { formatVnd } from "../../utils/formatVnd";
import toast from "react-hot-toast";
import { formatAxiosError } from "../../utils/formatAxiosError";

export default function ListService() {
  const initialServices = useLoaderData();
  const [services, setServices] = useState(initialServices);
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState("");
  const [search, setSearch] = useState("");

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
      toast.error(formatAxiosError(error));
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const search = e.target.search.value;
    setSearch(search);
    await fetchServices({ order, search });
  };

  const handleSort = async (e) => {
    const order = e.target.value;
    setOrder(order);
    await fetchServices({ order, search });
  };

  return (
    <Container>
      <h2 className="my-4">Dịch vụ</h2>

      <Row className="mb-4 d-flex gap-2">
        <Col xs={5} sm={4} md={3} className="position-relative">
          <Form onSubmit={handleSearch}>
            <Form.Control
              type="search"
              placeholder="Tìm kiếm..."
              name="search"
              id="search"
            />
          </Form>
        </Col>
        <Col xs={5} sm={4} md={3} lg={2}>
          <Form.Select value={order} onChange={handleSort}>
            <option value="">Sắp xếp</option>
            <option value="id:asc">Id: Tăng dần</option>
            <option value="id:desc">Id: Giảm dần</option>
            <option value="name:asc">Tên: A-Z</option>
            <option value="name:desc">Tên: Z-A</option>
            <option value="unit_price:asc">Giá: Tăng dần</option>
            <option value="unit_price:desc">Giá: Giảm dần</option>
          </Form.Select>
        </Col>

        <Col lg={3} className="ms-auto d-flex justify-content-end">
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
