import { useCallback, useEffect, useState } from "react";
import {
  Card,
  Button,
  Row,
  Col,
  Container,
  Spinner,
  Form,
} from "react-bootstrap";
import { FaEdit, FaUserAlt, FaPlus, FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { deleteRoom, getRooms } from "../../services/roomService";
import { formatVnd } from "../../utils/formatVnd";
import RoomDetailModal from "../../components/Admin/RoomDetailModal";
import Pagination from "react-bootstrap/Pagination";
import { paginationItems } from "../../utils/paginationItems";
import { toast } from "react-hot-toast";
import { formatAxiosError } from "../../utils/formatAxiosError";

const limit = 8;

export default function ListRoom() {
  const [total, setTotal] = useState(0);
  const [rooms, setRooms] = useState([]);
  const [page, setPage] = useState(1);
  const [room, setRoom] = useState(null);
  const [isShowRoomDetailModal, setIsShowRoomDetailModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCloseRoomDetailModal = () => {
    setIsShowRoomDetailModal(false);
  };

  const handleShowRoomDetailModal = (e, room) => {
    setIsShowRoomDetailModal(true);
    setRoom(room);
  };

  const handleDeleteRoom = async (e, id) => {
    e.preventDefault();
    try {
      const { message } = await deleteRoom(id);

      setRooms((prevRooms) => prevRooms.filter((room) => room.id !== id));

      toast.success(message);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRooms = useCallback(async ({ search, page, order }) => {
    try {
      setIsLoading(true);
      const data = await getRooms({ page, limit, search, order });
      setRooms(data.rooms);
      setTotal(data.total);
    } catch (error) {
      console.log(formatAxiosError(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSort = async (e) => {
    const value = e.target.value;
    if (!value) {
      await fetchRooms({ page });
      return;
    }
    const [field, direction] = value.split("-");
    await fetchRooms({ page, order: { [field]: direction } });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const search = e.target.search.value;
    await fetchRooms({ search });
  };

  useEffect(() => {
    fetchRooms({ page });
  }, [fetchRooms, page]);

  return (
    <Container>
      <RoomDetailModal
        roomInfo={room}
        handleClose={handleCloseRoomDetailModal}
        show={isShowRoomDetailModal}
      />
      <h2 className="my-4">Tất cả phòng</h2>

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
          <Form.Select>
            <option value="">Tất cả</option>
            <option value="available">Trống</option>
            <option value="occupied">Đã thuê</option>
          </Form.Select>
        </Col>
        <Col xs={2}>
          <Form.Select onChange={handleSort}>
            <option value="">Sắp xếp</option>
            <option value="name-asc">Tên: A-Z</option>
            <option value="name-desc">Tên: Z-A</option>
            <option value="price-asc">Giá: Tăng dần</option>
            <option value="price-desc">Giá: Giảm dần</option>
            <option value="area-asc">Diện tích: Tăng dần</option>
            <option value="area-desc">Diện tích: Giảm dần</option>
          </Form.Select>
        </Col>
        <Col xs={3} className="ms-auto d-flex justify-content-end">
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
                  <Card.Title className="mb-3">{room.name}</Card.Title>

                  <div className="d-flex flex-wrap justify-content-center gap-2 mb-3">
                    <Button
                      variant="outline-primary"
                      onClick={(e) => handleShowRoomDetailModal(e, room)}
                    >
                      <FaUserAlt /> Thông tin
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
                    {room.status === "available" ? "Trống" : "Đã thuê"}
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
          setPage,
        })}
      </Pagination>
    </Container>
  );
}
