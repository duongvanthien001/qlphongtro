import { useCallback, useState } from "react";
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
import { deleteUser, getUsers } from "../../services/userService";
import { FaEdit, FaPlus, FaTrashAlt } from "react-icons/fa";
import { paginationItems } from "../../utils/paginationItems";
import { formatAxiosError } from "../../utils/formatAxiosError";
import { toast } from "react-hot-toast";

const limit = 8;

export default function ListUser() {
  const data = useLoaderData();
  const [users, setUsers] = useState(data.users);
  const [page, setPage] = useState(data.page);
  const [total, setTotal] = useState(data.total);
  const [role, setRole] = useState("");
  const [order, setOrder] = useState("");
  const [search, setSearch] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = useCallback(async ({ page, search, order, role }) => {
    try {
      setIsLoading(true);
      const response = await getUsers({ page, limit, search, order, role });
      setUsers(response.users);
      setTotal(response.total);
      setPage(page);
    } catch (error) {
      console.log(formatAxiosError(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    const search = e.target.search.value;
    setSearch(search);
    await fetchUsers({ page, search, role, order });
  };

  const handleSelectRole = async (e) => {
    const role = e.target.value;
    setRole(role);
    await fetchUsers({ page, search, role, order });
  };

  const handleSort = async (e) => {
    const order = e.target.value;
    setOrder(order);
    await fetchUsers({ page, search, role, order });
  };

  const handleDelete = async (e, id) => {
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (error) {
      toast.error(formatAxiosError(error));
    }
  };

  const handleChangePage = async (page) => {
    await fetchUsers({ page, search, role, order });
  };

  return (
    <Container>
      <h2 className="my-4">Danh sách người dùng </h2>

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
          <Form.Select value={role} onChange={handleSelectRole}>
            <option value="">Vai trò</option>
            <option value="admin">Chủ trọ</option>
            <option value="staff">Nhân viên</option>
            <option value="tenant">Khách thuê</option>
          </Form.Select>
        </Col>
        <Col xs={5} sm={4} md={3} lg={2}>
          <Form.Select value={order} onChange={handleSort}>
            <option value="">Sắp xếp</option>
            <option value="id:asc">Id: Tăng dần</option>
            <option value="id:desc">Id: Giảm dần</option>
            <option value="full_name:asc">Họ và tên: A-Z</option>
            <option value="full_name:desc">Họ và tên: Z-A</option>
            <option value="created_at:desc">Ngày tạo: Mới nhất</option>
            <option value="created_at:asc">Ngày tạo: Cũ nhất</option>
          </Form.Select>
        </Col>
        <Col lg={3} className="ms-auto d-flex justify-content-end">
          <Link to="/admin/create-new-user">
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
              <th>Username</th>
              <th>Họ và tên</th>
              <th>Số điện thoại</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th>Ngày tạo</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.full_name}</td>
                <td>{user.phone}</td>
                <td>{user.email}</td>
                <td>
                  {user.role === "admin" && "Chủ trọ"}
                  {user.role === "staff" && "Nhân viên"}
                  {user.role === "tenant" && "Người thuê"}
                </td>
                <td>{new Date(user.created_at).toLocaleString("vi")}</td>
                <td>
                  <div className="d-flex align-items-center">
                    <Link to={`/admin/update-user/${user.id}`} className="me-2">
                      <Button variant="warning">
                        <FaEdit /> Sửa
                      </Button>
                    </Link>
                    <Button
                      variant="danger"
                      onClick={(e) => handleDelete(e, user.id)}
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
