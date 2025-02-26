import React, { useEffect, useState } from "react";
import { Button, Container, Pagination, Spinner, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getUsers } from "../../services/userService";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { paginationItems } from "../../utils/paginationItems";
import { formatAxiosError } from "../../utils/formatAxiosError";

const limit = 8;

export default function ListUser() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await getUsers();
        setUsers(response.users);
        setPage(response.page);
        setTotal(response.total);
      } catch (error) {
        console.log(formatAxiosError(error));
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center my-4">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <Container>
      <h2 className="my-4">Danh sách người dùng </h2>

      <Link to="/admin/add-user">
        <Button variant="primary" className="mb-3">
          Thêm người dùng
        </Button>
      </Link>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Id</th>
            <th>Username</th>
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
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{new Date(user.created_at).toLocaleString("vi")}</td>
              <td>
                <div className="d-flex align-items-center">
                  <Link to="/admin/update-user" className="me-2">
                    <Button variant="warning">
                      <FaEdit /> Sửa
                    </Button>
                  </Link>
                  <Button variant="danger">
                    <FaTrashAlt /> Xóa
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
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
