import React, { useCallback, useState } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Form,
  Pagination,
  Spinner,
} from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { Link, useLoaderData } from "react-router-dom";
import { deleteBill, getBills } from "../../services/billService";
import { formatVnd } from "../../utils/formatVnd";
import { paginationItems } from "../../utils/paginationItems";

const limit = 8;

export default function ListBill() {
  const data = useLoaderData();
  const [bills, setBills] = useState(data.bills);
  const [total, setTotal] = useState(data.total);
  const [page, setPage] = useState(data.page);
  const [isLoading, setIsLoading] = useState(false);

  const fetchBills = useCallback(async ({ page, search, order, status }) => {
    try {
      setIsLoading(true);
      const data = await getBills({ page, limit, search, order, status });
      setBills(data.bills);
      setPage(data.page);
      setTotal(data.total);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    const search = e.target.search.value;
    if (!search) {
      await fetchBills({ page });
      return;
    }
    await fetchBills({ page, search });
  };

  const handleSort = async (e) => {
    const order = e.target.value;
    if (!order) {
      await fetchBills({ page });
      return;
    }

    await fetchBills({ page, order });
  };

  const handleChangeStatus = async (e) => {
    const status = e.target.value;
    if (!status) {
      await fetchBills({ page });
      return;
    }

    await fetchBills({ page, status });
  };

  const handleChangePage = async (page) => {
    await fetchBills({ page });
  };

  const handleDelete = async (e, id) => {
    try {
      await deleteBill(id);
      setBills((prev) => prev.filter((bill) => bill.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container>
      <h2 className="my-4">Hóa đơn</h2>
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
          <Form.Select onChange={handleChangeStatus}>
            <option value="">Trạng thái</option>
            <option value="pending">Chưa thanh toán</option>
            <option value="paid">Đã thanh toán</option>
            <option value="partially_paid">Đã thanh toán một phần</option>
            <option value="overdue">Quá hạn</option>
          </Form.Select>
        </Col>
        <Col xs={2}>
          <Form.Select onChange={handleSort}>
            <option value="">Sắp xếp</option>
            <option value="id:asc">Id: Tăng dần</option>
            <option value="id:desc">Id: Giảm dần</option>
            <option value="total_amount:asc">Tổng cộng: Tăng dần</option>
            <option value="total_amount:desc">Tổng cộng: Giảm dần</option>
            <option value="created_at:desc">Ngày tạo: Mới nhất</option>
            <option value="created_at:asc">Ngày tạo: Cũ nhất</option>
          </Form.Select>
        </Col>
        <Col xs={3} className="ms-auto d-flex justify-content-end">
          <Link to="/admin/create-new-bill">
            <Button variant="primary">
              <FaPlus /> Thêm hóa đơn
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
              <th>Tiền phòng</th>
              <th>Tiền dịch vụ</th>
              <th>Tổng cộng</th>
              <th>Trạng thái</th>
              <th>Hạn thanh toán</th>
              <th>Ngày tạo</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill) => (
              <tr key={bill.id}>
                <td>{bill.id}</td>
                <td>{bill.contracts.rooms.room_number}</td>
                <td>{bill.contracts.tenants.users.full_name}</td>
                <td>{formatVnd(bill.room_fee)}</td>
                <td>{formatVnd(bill.service_fee)}</td>
                <td>{formatVnd(bill.total_amount)}</td>
                <td>
                  {bill.status === "pending" && "Chưa thanh toán"}
                  {bill.status === "paid" && "Đã thanh toán"}
                  {bill.status === "partially_paid" && "Đã thanh toán một phần"}
                  {bill.status === "overdue" && "Quá hạn"}
                </td>
                <td>{new Date(bill.due_date).toLocaleDateString("vi")}</td>
                <td>{new Date(bill.created_at).toLocaleDateString("vi")}</td>
                <td>
                  <Link to={`/admin/bill/${bill.id}`}>
                    <Button variant="primary">Chi tiết</Button>
                  </Link>
                  <Link to={`/admin/update-bill/${bill.id}`}>
                    <Button variant="warning" className="ms-2">
                      Sửa
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    className="ms-2"
                    onClick={(e) => handleDelete(e, bill.id)}
                  >
                    Xóa
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
}
