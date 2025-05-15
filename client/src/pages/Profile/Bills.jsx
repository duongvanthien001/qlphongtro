import { useCallback, useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Pagination,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import { useLoaderData } from "react-router-dom";
import { formatVnd } from "../../utils/formatVnd";
import { FaFileInvoice } from "react-icons/fa";
import { getBillsCurrentUser } from "../../services/billService";
import { paginationItems } from "../../utils/paginationItems";
import BillDetailModal from "../../components/Profile/BillDetailModal";

const limit = 8;

export default function Bills() {
  const data = useLoaderData();
  const [bills, setBills] = useState(data.bills);
  const [total, setTotal] = useState(data.total);
  const [page, setPage] = useState(data.page);
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [isShowModal, setIsShowModal] = useState(false);
  const [bill, setBill] = useState(null);

  const fetchBills = useCallback(async ({ page, search, order, status }) => {
    try {
      setIsLoading(true);
      const data = await getBillsCurrentUser({
        page,
        limit,
        search,
        order,
        status,
      });
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
    setSearch(search);
    await fetchBills({ page, search, order, status });
  };

  const handleSort = async (e) => {
    const order = e.target.value;
    setOrder(order);
    await fetchBills({ page, order });
  };

  const handleChangeStatus = async (e) => {
    const status = e.target.value;
    setStatus(status);
    await fetchBills({ page, search, order, status });
  };

  const handleChangePage = async (page) => {
    await fetchBills({ page, search, order, status });
  };

  const handleShowModal = (bill) => {
    console.log(bill);
    setBill(bill);
    setIsShowModal(true);
  };

  return (
    <Col md={9}>
      <BillDetailModal
        show={isShowModal}
        handleClose={() => setIsShowModal(false)}
        bill={bill}
      />
      <Card>
        <Card.Body>
          <h3 className="mb-4">Hóa đơn</h3>
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
                <option value="total_amount:asc">Tổng cộng: Tăng dần</option>
                <option value="total_amount:desc">Tổng cộng: Giảm dần</option>
                <option value="created_at:desc">Ngày tạo: Mới nhất</option>
                <option value="created_at:asc">Ngày tạo: Cũ nhất</option>
              </Form.Select>
            </Col>
          </Row>

          {!isLoading && (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Phòng</th>
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
                    <td>{bill.contracts.rooms.room_number}</td>
                    <td>{formatVnd(bill.room_fee)}</td>
                    <td>{formatVnd(bill.service_fee)}</td>
                    <td>{formatVnd(bill.total_amount)}</td>
                    <td>
                      {bill.status === "pending" && "Chưa thanh toán"}
                      {bill.status === "paid" && "Đã thanh toán"}
                      {bill.status === "partially_paid" &&
                        "Đã thanh toán một phần"}
                      {bill.status === "overdue" && "Quá hạn"}
                    </td>
                    <td>{new Date(bill.due_date).toLocaleDateString("vi")}</td>
                    <td>
                      {new Date(bill.created_at).toLocaleDateString("vi")}
                    </td>
                    <td>
                      <Button
                        variant="primary"
                        onClick={() => handleShowModal(bill)}
                      >
                        <FaFileInvoice />
                        Chi tiết
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
        </Card.Body>
      </Card>
    </Col>
  );
}
