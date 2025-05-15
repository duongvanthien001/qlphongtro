import { Container, Row } from "react-bootstrap";
import { Outlet, useLoaderData } from "react-router-dom";
import SidebarProfile from "../components/Profile/SidebarProfile";

export default function ProfileLayout() {
  const user = useLoaderData();

  return (
    <div style={{ paddingTop: 56 }}>
      <Container className="pt-5">
        <Row>
          <SidebarProfile role={user.role} />
          <Outlet />
        </Row>
      </Container>
    </div>
  );
}
