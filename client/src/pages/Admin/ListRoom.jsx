import { useCallback, useState } from "react";
import {
  Card,
  Button,
  Row,
  Col,
  Container,
  Spinner,
  Form,
} from "react-bootstrap";
import { FaEdit, FaPlus, FaTrashAlt, FaInfoCircle } from "react-icons/fa";
import { Link, useLoaderData } from "react-router-dom";
import { deleteRoom, getRooms } from "../../services/roomService";
import { formatVnd } from "../../utils/formatVnd";
import RoomDetailModal from "../../components/Admin/RoomDetailModal";
import Pagination from "react-bootstrap/Pagination";
import { paginationItems } from "../../utils/paginationItems";
import { formatAxiosError } from "../../utils/formatAxiosError";
import { toast } from "react-hot-toast";

const limit = 8;

export default function ListRoom() {
  const data = useLoaderData();
  const [total, setTotal] = useState(data.total);
  const [rooms, setRooms] = useState(data.rooms);
  const [page, setPage] = useState(data.page);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("");
  const [status, setStatus] = useState("");
  const [room, setRoom] = useState(null);
  const [isShowRoomDetailModal, setIsShowRoomDetailModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCloseRoomDetailModal = () => {
    setIsShowRoomDetailModal(false);
  };

  const handleShowModal = (room) => {
    setRoom(room);
    setIsShowRoomDetailModal(true);
  };

  const handleDeleteRoom = async (e, id) => {
    e.preventDefault();
    try {
      await deleteRoom(id);

      setRooms((prevRooms) => prevRooms.filter((room) => room.id !== id));
    } catch (error) {
      toast.error(formatAxiosError(error));
    }
  };

  const fetchRooms = useCallback(async ({ search, page, order, status }) => {
    try {
      setIsLoading(true);
      const data = await getRooms({ page, limit, search, order, status });
      setRooms(data.rooms);
      setTotal(data.total);
      setPage(data.page);
    } catch (error) {
      console.log(formatAxiosError(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSort = async (e) => {
    const order = e.target.value;
    setOrder(order);
    await fetchRooms({ page, status, order, search });
  };

  const handleSelectStatus = async (e) => {
    const status = e.target.value;
    setStatus(status);
    await fetchRooms({ page, status, order, search });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const search = e.target.search.value;
    setSearch(search);
    await fetchRooms({ page, search, order, status });
  };

  const handleChangePage = async (page) => {
    await fetchRooms({ page, search, order, status });
  };

  return (
    <Container>
      <RoomDetailModal
        room={room}
        handleClose={handleCloseRoomDetailModal}
        show={isShowRoomDetailModal}
        setRooms={setRooms}
      />
      <h2 className="my-4">Tất cả phòng</h2>

      <Row className="mb-4 d-flex flex-wrap gap-2">
        <Col xs={5} sm={4} md={3}>
          <Form onSubmit={handleSearch} className="position-relative">
            <Form.Control
              type="search"
              placeholder="Tìm kiếm..."
              name="search"
              id="search"
            />
          </Form>
        </Col>
        <Col xs={5} sm={4} md={3} lg={2}>
          <Form.Select value={status} onChange={handleSelectStatus}>
            <option value="">Trạng thái</option>
            <option value="available">Trống</option>
            <option value="occupied">Đã thuê</option>
            <option value="maintenance">Bảo trì</option>
          </Form.Select>
        </Col>
        <Col xs={5} sm={4} md={3} lg={2}>
          <Form.Select value={order} onChange={handleSort}>
            <option value="">Sắp xếp</option>
            <option value="room_number:asc">Số phòng: A-Z</option>
            <option value="room_number:desc">Số phòng: Z-A</option>
            <option value="price:asc">Giá: Tăng dần</option>
            <option value="price:desc">Giá: Giảm dần</option>
            <option value="area:asc">Diện tích: Tăng dần</option>
            <option value="area:desc">Diện tích: Giảm dần</option>
          </Form.Select>
        </Col>
        <Col lg={3} className="ms-auto d-flex justify-content-end">
          <Link to="/admin/create-new-room">
            <Button variant="primary">
              <FaPlus /> Thêm phòng
            </Button>
          </Link>
        </Col>
      </Row>

      {!isLoading && (
        <Row>
          {rooms.map((room) => (
            <Col key={room.id} md={3} className="mb-4">
              <Card>
                <Card.Body className="text-center">
                  <Card.Title className="mb-3">
                    Phòng {room.room_number}
                  </Card.Title>

                  <div className="d-flex flex-wrap justify-content-center gap-2 mb-3">
                    <Button
                      variant="outline-primary"
                      onClick={(e) => handleShowModal(room)}
                    >
                      <FaInfoCircle /> Thông tin
                    </Button>
                    <Link to={`/admin/update-room/${room.id}`}>
                      <Button variant="outline-warning">
                        <FaEdit /> Sửa phòng
                      </Button>
                    </Link>
                    <Button
                      variant="outline-danger"
                      onClick={(e) => handleDeleteRoom(e, room.id)}
                    >
                      <FaTrashAlt /> Xóa phòng
                    </Button>
                  </div>
                  <Card.Text className="mb-2">
                    <strong>Tiền phòng:</strong> {formatVnd(room.price)}
                  </Card.Text>
                  <Card.Text className="mb-2">
                    <strong>Diện tích:</strong> {room.area}m<sup>2</sup>
                  </Card.Text>
                  <Card.Text>
                    <strong>Trạng thái:</strong>{" "}
                    {room.status === "available" && "Trống"}
                    {room.status === "occupied" && "Đã thuê"}
                    {room.status === "maintenance" && "Bảo trì"}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
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
