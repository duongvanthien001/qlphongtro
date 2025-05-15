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
import { deletePayment, getPayments } from "../../services/paymentService";
import { paginationItems } from "../../utils/paginationItems";
import { formatVnd } from "../../utils/formatVnd";
import toast from "react-hot-toast";
import { formatAxiosError } from "../../utils/formatAxiosError";

const limit = 8;

export default function ListPayment() {
  const data = useLoaderData();
  const [payments, setPayments] = useState(data.payments);
  const [total, setTotal] = useState(data.total);
  const [page, setPage] = useState(data.page);
  const [order, setOrder] = useState("");
  const [payment_method, setPaymentMethod] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchPayments = useCallback(async ({ page, order, payment_method }) => {
    try {
      setIsLoading(true);
      const data = await getPayments({
        page,
        limit,
        order,
        payment_method,
      });
      setPayments(data.payments);
      setPage(data.page);
      setTotal(data.total);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSort = async (e) => {
    const order = e.target.value;
    setOrder(order);

    await fetchPayments({ page, order, payment_method });
  };

  const handleChangePaymentMethod = async (e) => {
    const payment_method = e.target.value;
    setPaymentMethod(payment_method);
    await fetchPayments({ page, payment_method, order });
  };

  const handleChangePage = async (page) => {
    await fetchPayments({ page, payment_method, order });
  };

  const handleDelete = async (e, id) => {
    try {
      await deletePayment(id);
      setPayments((prev) => prev.filter((payment) => payment.id !== id));
    } catch (error) {
      toast.error(formatAxiosError(error));
    }
  };

  return (
    <Container>
      <h2 className="my-4">Thanh toán</h2>
      <Row className="mb-4 d-flex">
        <Col xs={7} sm={5} md={3}>
          <Form.Select onChange={handleChangePaymentMethod}>
            <option value="">Phương thức thanh toán</option>
            <option value="cash">Tiền mặt</option>
            <option value="bank_transfer">Chuyển khoản</option>
          </Form.Select>
        </Col>
        <Col xs={5} sm={4} md={3} lg={2}>
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
      </Row>

      {!isLoading && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Id</th>
              <th>Hóa đơn Id</th>
              <th>Số tiền</th>
              <th>Phương thức thanh toán</th>
              <th>Ngày thanh toán</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.id}</td>
                <td>{payment.bill_id}</td>
                <td>{formatVnd(payment.amount)}</td>
                <td>
                  {payment.payment_method === "cash" && "Tiền mặt"}
                  {payment.payment_method === "bank_transfer" && "Chuyển khoản"}
                </td>
                <td>{new Date(payment.payment_date).toLocaleDateString()}</td>
                <td>
                  <Link to={`/admin/update-payment/${payment.id}`}>
                    <Button variant="warning">Sửa</Button>
                  </Link>
                  <Button
                    variant="danger"
                    className="ms-2"
                    onClick={(e) => handleDelete(e, payment.id)}
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
