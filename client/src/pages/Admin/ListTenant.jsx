import { useCallback, useState } from "react";
import {
  Table,
  Button,
  Container,
  Row,
  Col,
  Form,
  Spinner,
  Pagination,
} from "react-bootstrap";
import { FaEdit, FaPlus, FaTrashAlt } from "react-icons/fa";
import { Link, useLoaderData } from "react-router-dom";
import { deleteUser, getUsers } from "../../services/userService";
import { toast } from "react-hot-toast";
import { formatAxiosError } from "../../utils/formatAxiosError";
import { formatAge } from "../../utils/formatAge";
import { paginationItems } from "../../utils/paginationItems";

const limit = 8;

const ListTenant = () => {
  const data = useLoaderData();
  const [users, setUsers] = useState(data.users);
  const [page, setPage] = useState(data.page);
  const [total, setTotal] = useState(data.total);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchTenants = useCallback(async ({ page, order, search }) => {
    try {
      setIsLoading(true);
      const data = await getUsers({
        page,
        order,
        search,
        limit,
        role: "tenant",
      });
      setUsers(data.users);
      setPage(data.page);
      setTotal(data.total);
    } catch (error) {
      toast.error(formatAxiosError(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    const search = e.target.search.value;
    setSearch(search);
    await fetchTenants({ page, search, order });
  };

  const handleSort = async (e) => {
    const order = e.target.value;
    setOrder(order);
    await fetchTenants({ page, order, search });
  };

  const handleDeleteTenant = async (id) => {
    try {
      await deleteUser(id);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } catch (error) {
      toast.error(formatAxiosError(error));
    }
  };

  const handleChangePage = async (page) => {
    await fetchTenants({ page, search, order });
  };

  return (
    <Container>
      <h2 className="my-4">Danh sách khách thuê</h2>

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
            <option value="full_name:asc">Họ và tên: A-Z</option>
            <option value="full_name:desc">Họ và tên: Z-A</option>
            <option value="email:asc">Email: A-Z</option>
            <option value="email:desc">Email: Z-A</option>
            <option value="phone:asc">Số điện thoại: Tăng dần</option>
            <option value="phone:desc">Số điện thoại: Giảm dần</option>
          </Form.Select>
        </Col>
        <Col lg={3} className="ms-auto d-flex justify-content-end">
          <Link to="/admin/create-new-tenant">
            <Button variant="primary">
              <FaPlus /> Thêm khách thuê
            </Button>
          </Link>
        </Col>
      </Row>
      {/* Table danh sách khách thuê */}
      {!isLoading && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Id</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Phòng</th>
              <th>Tuổi</th>
              <th>CCCD</th>
              <th>Địa chỉ</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.full_name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>
                  {user.tenants.contracts.map((contract, i) => (
                    <span key={contract.id}>
                      {contract.rooms.room_number}
                      {i < user.tenants.contracts.length - 1 && ","}
                    </span>
                  ))}
                </td>
                <td>{formatAge(user.tenants.date_of_birth)}</td>
                <td>{user.tenants.id_card}</td>
                <td>{user.tenants.address}</td>
                <td>
                  <Link to={`/admin/update-tenant/${user.id}`} className="me-2">
                    <Button variant="warning">
                      <FaEdit /> Sửa
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteTenant(user.id)}
                  >
                    <FaTrashAlt /> Xóa
                  </Button>
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
};

export default ListTenant;
