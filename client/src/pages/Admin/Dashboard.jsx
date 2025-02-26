import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Table } from "react-bootstrap";
import { FaHouseUser, FaUserAlt } from "react-icons/fa";
import { MdMeetingRoom } from "react-icons/md";
import { getRooms } from "../../services/roomService";
import { getAnalyst } from "../../services/analystService";
export default function Dashboard() {
  const [rooms, setRooms] = useState([]);
  const [analyst, setAnalyst] = useState({
    room: 0,
    emptyRoom: 0,
    people: 0,
  });

  useEffect(() => {
    Promise.all([getAnalyst(), getRooms()])
      .then(([analyst, roomData]) => {
        if (!analyst || !roomData) {
          return;
        }
        setAnalyst(analyst);
        setRooms(roomData.rooms);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <Container>
      {/* Phần Header */}
      <Row className="my-4">
        <Col md={4} className="text-center">
          <Card>
            <Card.Body>
              <Card.Title>Số Phòng</Card.Title>
              <Card.Text>{analyst.room}</Card.Text>
              <FaHouseUser />
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="text-center">
          <Card>
            <Card.Body>
              <Card.Title>Số Phòng Trống</Card.Title>
              <Card.Text>{analyst.emptyRoom}</Card.Text>

              <MdMeetingRoom />
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="text-center">
          <Card>
            <Card.Body>
              <Card.Title>Số Người Ở</Card.Title>
              <Card.Text>{analyst.people}</Card.Text>

              <FaUserAlt />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Phần Danh sách phòng */}
      <h3 className="my-4">Danh sách phòng</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Tên phòng</th>
            <th>Số người ở</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.id}>
              <td>{room.name}</td>
              <td>{room.number_people}</td>
              <td>
                <Button variant="light" className="btn-sm">
                  {room.status === "available" ? "Trống" : "Đã thuê"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
