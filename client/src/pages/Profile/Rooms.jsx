import { useCallback, useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Pagination,
  Row,
  Spinner,
} from "react-bootstrap";
import { getRoomsCurrentUser } from "../../services/roomService";
import { FaFileContract, FaHouseUser } from "react-icons/fa";
import { formatVnd } from "../../utils/formatVnd";
import { paginationItems } from "../../utils/paginationItems";
import { useLoaderData } from "react-router-dom";
import RoomDetailModal from "../../components/Profile/RoomDetailModal";
import ContractDetailModal from "../../components/Profile/ContractDetailModal";

const limit = 8;

export default function Rooms() {
  const data = useLoaderData();
  const [rooms, setRooms] = useState(data.rooms);
  const [page, setPage] = useState(data.page);
  const [total, setTotal] = useState(data.total);
  const [isLoading, setIsLoading] = useState(false);
  const [room, setRoom] = useState(null);
  const [isShowRoom, setIsShowRoom] = useState(false);
  const [isShowContract, setIsShowContract] = useState(false);

  const fetchRooms = useCallback(async ({ page, search, order, status }) => {
    setIsLoading(true);
    try {
      const data = await getRoomsCurrentUser({
        page,
        limit,
        search,
        order,
        status,
      });
      setRooms(data.rooms);
      setTotal(data.total);
    } catch (error) {
      console.error(error);
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
    await fetchRooms({ page, order: value });
  };

  const handleSelectStatus = async (e) => {
    const value = e.target.value;
    if (!value) {
      await fetchRooms({ page });
      return;
    }
    await fetchRooms({ page, status: value });
  };

  const handleShowDetailModal = (room, type) => {
    setRoom(room);
    if (type === "contract") {
      setIsShowContract(true);
    } else {
      setIsShowRoom(true);
    }
  };

  const handleCloseDetailModal = () => {
    setIsShowRoom(false);
  };

  const handleCloseContractModal = () => {
    setIsShowContract(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const search = e.target.search.value;
    await fetchRooms({ page, search });
  };

  const contract = room?.contracts.find(
    (contract) => contract.status === "active"
  );

  return (
    <Col md={9}>
      <RoomDetailModal
        show={isShowRoom}
        handleClose={handleCloseDetailModal}
        room={room}
      />
      <ContractDetailModal
        show={isShowContract}
        handleClose={handleCloseContractModal}
        contract={contract}
      />
      <Card>
        <Card.Body>
          <h3 className="mb-4">Danh sách phòng</h3>
          <Row className="mb-4">
            <Col xs={3}>
              <Form onSubmit={handleSearch} className="position-relative">
                <Form.Control
                  type="search"
                  placeholder="Tìm kiếm..."
                  name="search"
                  id="search"
                />
              </Form>
            </Col>
            <Col xs={3}>
              <Form.Select onChange={handleSelectStatus}>
                <option value="">Trạng thái</option>
                <option value="available">Trống</option>
                <option value="occupied">Đã thuê</option>
                <option value="maintenance">Bảo trì</option>
              </Form.Select>
            </Col>
            <Col xs={3}>
              <Form.Select onChange={handleSort}>
                <option value="">Sắp xếp</option>
                <option value="room_number:asc">Số phòng: A-Z</option>
                <option value="room_number:desc">Số phòng: Z-A</option>
                <option value="price:asc">Giá: Tăng dần</option>
                <option value="price:desc">Giá: Giảm dần</option>
                <option value="area:asc">Diện tích: Tăng dần</option>
                <option value="area:desc">Diện tích: Giảm dần</option>
              </Form.Select>
            </Col>
          </Row>

          {!isLoading && (
            <Row>
              {rooms.map((room) => (
                <Col key={room.id} md={4} className="mb-4">
                  <Card>
                    <Card.Body className="text-center">
                      <Card.Title className="mb-3">
                        Phòng {room.room_number}
                      </Card.Title>

                      <div className="d-flex flex-wrap justify-content-center gap-2 mb-3">
                        <Button
                          variant="outline-primary"
                          onClick={() => handleShowDetailModal(room, "room")}
                        >
                          <FaHouseUser /> Chi tiết phòng
                        </Button>
                        <Button
                          variant="outline-success"
                          onClick={() =>
                            handleShowDetailModal(room, "contract")
                          }
                        >
                          <FaFileContract /> Chi tiết hợp đồng
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
                        {room.status === "maintenance" && "Đang sửa"}
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
        </Card.Body>
      </Card>
    </Col>
  );
}
