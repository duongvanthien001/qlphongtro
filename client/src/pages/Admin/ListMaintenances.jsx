import React, { useCallback, useEffect, useState } from "react";
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
import { Link } from "react-router-dom";
import { FaEdit, FaPlus, FaTrashAlt } from "react-icons/fa";
import { paginationItems } from "../../utils/paginationItems";
import { formatAxiosError } from "../../utils/formatAxiosError";
import {
  deleteMaintenance,
  getMaintenances,
} from "../../services/maintenancesService";

const limit = 8;

export default function ListMaintenances() {
  const [maintenances, setMaintenances] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

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
      } catch (error) {
        console.log(formatAxiosError(error));
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const handleSearch = async (e) => {
    const search = e.target.search.value;
    if (!search) {
      await fetchMaintenances({ page });
      return;
    }
    await fetchMaintenances({ page, search });
  };

  const handleSort = async (e) => {
    const order = e.target.value;
    if (!order) {
      await fetchMaintenances({ page });
      return;
    }
    await fetchMaintenances({ page, order });
  };

  const handleSelectStatus = async (e) => {
    const status = e.target.value;
    if (!status) {
      await fetchMaintenances({ page });
      return;
    }
    await fetchMaintenances({ page, status });
  };

  const handleDelete = async (e, id) => {
    try {
      await deleteMaintenance(id);
      setMaintenances((prev) =>
        prev.filter((maintenance) => maintenance.id !== id)
      );
    } catch (error) {
      console.log(formatAxiosError(error));
    }
  };

  useEffect(() => {
    fetchMaintenances({ page });
  }, [page, fetchMaintenances]);

  return (
    <Container>
      <h2 className="my-4">Danh sách bảo trì</h2>

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
          <Form.Select onChange={handleSelectStatus}>
            <option value="">Tất cả</option>
            <option value="admin">Chủ trọ</option>
            <option value="staff">Nhân viên</option>
            <option value="tenant">Khách thuê</option>
          </Form.Select>
        </Col>
        <Col xs={2}>
          <Form.Select onChange={handleSort}>
            <option value="">Sắp xếp</option>
            <option value="id:asc">Id: Tăng dần</option>
            <option value="id:desc">Id: Giảm dần</option>
            <option value="full_name:asc">Tên: A-Z</option>
            <option value="full_name:desc">Tên: Z-A</option>
            <option value="created_at:asc">Ngày tạo: Tăng dần</option>
            <option value="created_at:desc">Ngày tạo: Giảm dần</option>
          </Form.Select>
        </Col>
        <Col xs={3} className="ms-auto d-flex justify-content-end">
          <Link to="/admin/add-user">
            <Button variant="primary">
              <FaPlus /> Thêm người dùng
            </Button>
          </Link>
        </Col>
      </Row>

      {!isLoading && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Id</th>
              <th>Phòng</th>
              <th>Người thuê</th>
              <th>Ngày yêu cầu</th>
              <th>Ngày giải quyết</th>
              <th>Mô tả</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {maintenances.map((maintenace) => (
              <tr key={maintenace.id}>
                <td>{maintenace.id}</td>
                <td>{maintenace.rooms.room_number}</td>
                <td>{maintenace.tenants.users.full_name}</td>
                <td>{maintenace.request_date}</td>
                <td>{maintenace.resolved_date}</td>
                <td>
                  {maintenace.status === "pending" && "Chờ xử lý"}
                  {maintenace.status === "in_progress" && "Đang xử lý"}
                  {maintenace.status === "completed" && "Đã xử lý"}
                </td>
                <td>
                  <div className="d-flex align-items-center">
                    <Link to="/admin/update-maintenance" className="me-2">
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
          setPage,
        })}
      </Pagination>
    </Container>
  );
}
