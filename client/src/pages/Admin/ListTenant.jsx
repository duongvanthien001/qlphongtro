import React from "react";
import { Table, Button, Container } from "react-bootstrap";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const ListTenant = () => {
  const people = [
    { id: 1, name: "Nguyễn Văn A", phone: "0987654321", age: 25 },
    { id: 2, name: "Trần Thị B", phone: "0123456789", age: 30 },
    { id: 3, name: "Lê Minh C", phone: "0234567890", age: 22 },
  ];

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
            <th>Tuổi</th> {/* Thay "Trạng thái" bằng "Tuổi" */}
            <th>Hành động</th> {/* Cột hành động với nút Sửa và Xóa */}
          </tr>
        </thead>
        <tbody>
          {people.map((person) => (
            <tr key={person.id}>
              <td>{person.name}</td>
              <td>{person.phone}</td>
              <td></td>
              <td>{person.age}</td>
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
