import { Container, Row } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import SidebarProfile from "../components/Profile/SidebarProfile";

export default function ProfileLayout() {
  return (
    <div style={{ paddingTop: 56 }}>
      <Container className="pt-5">
        <Row>
          <SidebarProfile />
          <Outlet />
        </Row>
      </Container>
    </div>
  );
}
