import React, { useCallback, useEffect, useState } from "react";
import { Table, Button, Container } from "react-bootstrap";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getTenants } from "../../services/tenantService";
import { deleteUser } from "../../services/userService";
import { toast } from "react-hot-toast";
import { formatAxiosError } from "../../utils/formatAxiosError";
import { formatAge } from "../../utils/formatAge";

const limit = 8;

const ListTenant = () => {
  const [tenants, setTenants] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchTenants = useCallback(async ({ page, order, search }) => {
    try {
      const data = await getTenants({ page, order, search, limit });
      setTenants(data.tenants);
      setPage(data.page);
      setTotal(data.total);
    } catch (error) {
      toast.error(formatAxiosError(error));
    }
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    const search = e.target.search.value;
    await fetchTenants({ page, search });
  };

  const handleDeleteTenant = async (e, id) => {
    e.preventDefault();
    try {
      await deleteUser(id);
      setTenants((prevTenants) =>
        prevTenants.filter((tenant) => tenant.id !== id)
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTenants({ page });
  }, [page, fetchTenants]);

  return (
    <Container>
      <h2 className="my-4">Danh sách khách thuê</h2>

      <Link to="/admin/create-new-tenant">
        <Button variant="primary" className="mb-3">
          Thêm người thuê
        </Button>
      </Link>
      {/* Table danh sách khách thuê */}
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
          {tenants.map((tenant) => (
            <tr key={tenant.id}>
              <td>{tenant.id}</td>
              <td>{tenant.users.full_name}</td>
              <td>{tenant.users.email}</td>
              <td>{tenant.users.phone}</td>
              <td>
                {tenant.contracts.map((contract) => (
                  <span key={contract.id}>{contract.rooms.room_number}</span>
                ))}
              </td>
              <td>{formatAge(tenant.date_of_birth)}</td>
              <td>{tenant.id_card}</td>
              <td>{tenant.address}</td>
              <td>
                <Link to="/admin/update-tenant" className="me-2">
                  <Button variant="warning">
                    <FaEdit /> Sửa
                  </Button>
                </Link>
                <Button
                  variant="danger"
                  onClick={(e) => handleDeleteTenant(e, tenant.id)}
                >
                  <FaTrashAlt /> Xóa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ListTenant;
