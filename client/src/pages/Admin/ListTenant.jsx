import React, { useEffect, useState } from "react";
import { Table, Button, Container } from "react-bootstrap";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getTenants } from "../../services/tenantService";

const ListTenant = () => {
  const [tenants, setTenants] = useState([]);

  useEffect(() => {
    getTenants()
      .then((tenants) => setTenants(tenants))
      .catch((error) => console.log(error));
  }, []);

  return (
    <Container>
      <h2 className="my-4">Danh sách khách thuê </h2>

      <Link to="/admin/create-new-tenant">
        <Button variant="primary" className="mb-3">
          Thêm người
        </Button>
      </Link>
      {/* Table danh sách khách thuê */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Họ tên</th>
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
              <td>{tenant.name}</td>
              <td>{tenant.phone}</td>
              <td>{tenant.rooms.name}</td>
              <td>{tenant.age}</td>
              <td>{tenant.id_card}</td>
              <td>{tenant.address}</td>
              <td>
                <Link to="/admin/update-tenant">
                  <Button variant="warning" className="mr-2">
                    <FaEdit /> Sửa
                  </Button>
                </Link>
                <Button variant="danger">
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
