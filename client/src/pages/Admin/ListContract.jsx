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
import { FaEdit, FaPlus, FaTrashAlt } from "react-icons/fa";
import { Link, useLoaderData } from "react-router-dom";
import { deleteContract, getContracts } from "../../services/contractService";
import { paginationItems } from "../../utils/paginationItems";
import { formatAxiosError } from "../../utils/formatAxiosError";
import { formatVnd } from "../../utils/formatVnd";
import toast from "react-hot-toast";

const limit = 8;

export default function ListContract() {
  const data = useLoaderData();
  const [isLoading, setIsLoading] = useState(false);
  const [contracts, setContacts] = useState(data.contracts);
  const [page, setPage] = useState(data.page);
  const [total, setTotal] = useState(data.total);

  const fetchContracts = useCallback(
    async ({ page, order, search, status }) => {
      try {
        setIsLoading(true);
        const data = await getContracts({
          page,
          limit,
          order,
          search,
          status,
        });
        setContacts(data.contracts);
        setPage(data.page);
        setTotal(data.total);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const handleSearch = async (e) => {
    e.preventDefault();
    const search = e.target.search.value;
    await fetchContracts({ page, search });
  };

  const handleSelectStatus = async (e) => {
    const status = e.target.value;
    if (status === "") {
      await fetchContracts({ page });
      return;
    }
    await fetchContracts({ page, status });
  };

  const handleSort = async (e) => {
    const order = e.target.value;
    if (order === "") {
      await fetchContracts({ page });
      return;
    }
    await fetchContracts({ page, order });
  };

  const handleDelete = async (e, id) => {
    try {
      await deleteContract(id);
      setContacts((prev) => prev.filter((contract) => contract.id !== id));
    } catch (error) {
      toast.error(formatAxiosError(error));
    }
  };

  const handleChangePage = async (page) => {
    await fetchContracts({ page });
  };

  return (
    <Container>
      <h2 className="my-4">Hợp đồng</h2>

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
          <Form.Select onChange={handleSelectStatus}>
            <option value="">Trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="expired">Hết hạn</option>
            <option value="terminated">Chấm dứt</option>
          </Form.Select>
        </Col>
        <Col xs={5} sm={4} md={3} lg={2}>
          <Form.Select onChange={handleSort}>
            <option value="">Sắp xếp</option>
            <option value="id:asc">Id: Tăng dần</option>
            <option value="id:desc">Id: Giảm dần</option>
            <option value="deposit:asc">Tiền cọc: Tăng dần</option>
            <option value="deposit:desc">Tiền cọc: Giảm dần</option>
            <option value="start_date:desc">Ngày bắt đầu: Mới nhất</option>
            <option value="start_date:asc">Ngày bắt đầu: Cũ nhất</option>
          </Form.Select>
        </Col>
        <Col lg={3} className="ms-auto d-flex justify-content-end">
          <Link to="/admin/create-new-contract">
            <Button variant="primary">
              <FaPlus /> Thêm hợp đồng
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
              <th>Ngày bắt đầu</th>
              <th>Ngày kết thúc</th>
              <th>Tiền cọc</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {contracts.map((contract) => (
              <tr key={contract.id}>
                <td>{contract.id}</td>
                <td>{contract.rooms.room_number}</td>
                <td>{contract.tenants.users.full_name}</td>
                <td>
                  {new Date(contract.start_date).toLocaleDateString("vi-VN")}
                </td>
                <td>
                  {new Date(contract.end_date).toLocaleDateString("vi-VN")}
                </td>
                <td>{formatVnd(contract.deposit)}</td>
                <td>
                  {contract.status === "active" && "Hoạt động"}
                  {contract.status === "expired" && "Hết hạn"}
                  {contract.status === "terminated" && "Chấm dứt"}
                </td>
                <td>
                  <div className="d-flex align-items-center">
                    <Link
                      to={`/admin/update-contract/${contract.id}`}
                      className="me-2"
                    >
                      <Button variant="warning">
                        <FaEdit /> Sửa
                      </Button>
                    </Link>
                    <Button
                      variant="danger"
                      onClick={(e) => handleDelete(e, contract.id)}
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
