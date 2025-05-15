import { Container, Row, Col, Card, Button, Table } from "react-bootstrap";
import { FaDoorOpen, FaHouseUser, FaUserAlt } from "react-icons/fa";
import { Link, useLoaderData } from "react-router-dom";
import CountUp from "react-countup";

export default function Dashboard() {
  const { analyst, roomData } = useLoaderData();

  const rooms = roomData.rooms;

  return (
    <Container>
      {/* Phần Header */}
      <Row className="my-4 g-4">
        <Col md={4} className="text-center">
          <Card>
            <Card.Body>
              <Card.Title>Tổng Số Phòng</Card.Title>
              <Card.Text className="fs-5">
                <CountUp end={analyst.room} />
              </Card.Text>
              <FaHouseUser size={20} />
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="text-center">
          <Card>
            <Card.Body>
              <Card.Title>Số Phòng Trống</Card.Title>
              <Card.Text className="fs-5">
                <CountUp end={analyst.emptyRoom} />
              </Card.Text>
              <FaDoorOpen size={20} />
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="text-center">
          <Card>
            <Card.Body>
              <Card.Title>Số Người Ở</Card.Title>
              <Card.Text className="fs-5">
                <CountUp end={analyst.people} />
              </Card.Text>
              <FaUserAlt size={20} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Phần Danh sách phòng */}
      <div className="d-flex align-items-center justify-content-between my-4">
        <h3 className="mb-0">Danh sách phòng</h3>
        <Link to="/admin/list-room" className="btn btn-link">
          Xem tất cả
        </Link>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Phòng</th>
            <th>Số người ở</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.id}>
              <td>{room.room_number}</td>
              <td>{room.contracts?.length || 0}</td>
              <td>
                <Button variant="light" className="btn-sm">
                  {room.status === "available" && "Trống"}
                  {room.status === "occupied" && "Đã thuê"}
                  {room.status === "maintenance" && "Bảo trì"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
