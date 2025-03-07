import { Container, Row } from "react-bootstrap";
import { Navigate, Outlet, useLoaderData } from "react-router-dom";
import SidebarProfile from "../components/Profile/SidebarProfile";

export default function ProfileLayout() {
  const user = useLoaderData();

  if (user.role !== "tenant") {
    return <Navigate to="/" />;
  }

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
