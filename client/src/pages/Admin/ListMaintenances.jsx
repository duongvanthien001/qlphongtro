import React, { useCallback, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Pagination,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import { Link, useLoaderData } from "react-router-dom";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { paginationItems } from "../../utils/paginationItems";
import { formatAxiosError } from "../../utils/formatAxiosError";
import {
  deleteMaintenance,
  getMaintenances,
} from "../../services/maintenancesService";
import toast from "react-hot-toast";

const limit = 8;

export default function ListMaintenances() {
  const data = useLoaderData();
  const [maintenances, setMaintenances] = useState(data.maintenances);
  const [page, setPage] = useState(data.page);
  const [total, setTotal] = useState(data.total);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("");
  const [status, setStatus] = useState("");

  const fetchMaintenances = useCallback(
    async ({ page, search, order, status }) => {
      try {
        setIsLoading(true);
        const data = await getMaintenances({
          page,
          limit,
          search,
          order,
          status,
        });
        setMaintenances(data.maintenances);
        setTotal(data.total);
        setPage(data.page);
      } catch (error) {
        console.log(formatAxiosError(error));
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const handleSearch = async (e) => {
    e.preventDefault();
    const search = e.target.search.value;
    setSearch(search);
    await fetchMaintenances({ page, status, search, order });
  };

  const handleSort = async (e) => {
    const order = e.target.value;
    setOrder(order);
    await fetchMaintenances({ page, status, search, order });
  };

  const handleSelectStatus = async (e) => {
    const status = e.target.value;
    setStatus(status);
    await fetchMaintenances({ page, status, search, order });
  };

  const handleDelete = async (e, id) => {
    try {
      await deleteMaintenance(id);
      setMaintenances((prev) =>
        prev.filter((maintenance) => maintenance.id !== id)
      );
    } catch (error) {
      toast.error(formatAxiosError(error));
    }
  };

  const handleChangePage = async (page) => {
    await fetchMaintenances({ page, search, order, status });
  };

  return (
    <Container>
      <h2 className="my-4">Danh sách bảo trì</h2>

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
          <Form.Select value={status} onChange={handleSelectStatus}>
            <option value="">Trạng thái</option>
            <option value="pending">Chờ xử lý</option>
            <option value="in_progress">Đang xử lý</option>
            <option value="completed">Đã xử lý</option>
          </Form.Select>
        </Col>
        <Col xs={5} sm={4} md={3} lg={2}>
          <Form.Select value={order} onChange={handleSort}>
            <option value="">Sắp xếp</option>
            <option value="id:asc">Id: Tăng dần</option>
            <option value="id:desc">Id: Giảm dần</option>
            <option value="request_date:desc">Ngày yêu cầu: Mới nhất</option>
            <option value="request_date:asc">Ngày yêu cầu: Cũ nhất</option>
            <option value="resolved_date:desc">
              Ngày giải quyết: Mới nhất
            </option>
            <option value="resolved_date:asc">Ngày giải quyết: Cũ nhất</option>
          </Form.Select>
        </Col>
      </Row>

      {!isLoading && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Id</th>
              <th>Phòng</th>
              <th>Người thuê</th>
              <th>Mô tả</th>
              <th>Trạng thái</th>
              <th>Ngày yêu cầu</th>
              <th>Ngày giải quyết</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {maintenances.map((maintenace) => (
              <tr key={maintenace.id}>
                <td>{maintenace.id}</td>
                <td>{maintenace.rooms.room_number}</td>
                <td>{maintenace.tenants.users.full_name}</td>
                <td>{maintenace.description}</td>
                <td>
                  {maintenace.status === "pending" && "Chờ xử lý"}
                  {maintenace.status === "in_progress" && "Đang xử lý"}
                  {maintenace.status === "completed" && "Đã xử lý"}
                </td>
                <td>
                  {new Date(maintenace.request_date).toLocaleDateString()}
                </td>
                <td>
                  {maintenace.resolved_date &&
                    new Date(maintenace.resolved_date).toLocaleDateString()}
                </td>
                <td>
                  <div className="d-flex align-items-center">
                    <Link
                      to={`/admin/update-maintenance/${maintenace.id}`}
                      className="me-2"
                    >
                      <Button variant="warning">
                        <FaEdit /> Sửa
                      </Button>
                    </Link>
                    <Button
                      variant="danger"
                      onClick={(e) => handleDelete(e, maintenace.id)}
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

      {isLoading && (
        <div className="d-flex justify-content-center my-4">
          <Spinner animation="border" />
        </div>
      )}
      <Pagination className="justify-content-center">
        {paginationItems({
          page,
          limit,
          total,
          handleChangePage,
        })}
      </Pagination>
    </Container>
  );
}
