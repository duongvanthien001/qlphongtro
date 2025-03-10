import React, { useState } from "react";
import {
  Button,
  Card,
  Col,
  Pagination,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import { useLoaderData } from "react-router-dom";
import { getMaintenancesByCurrentUser } from "../../services/maintenancesService";
import { formatAxiosError } from "../../utils/formatAxiosError";
import { FaPlus } from "react-icons/fa";
import { paginationItems } from "../../utils/paginationItems";
import CreateMaintenanceModal from "../../components/Profile/CreateMaintenanceModal";

const limit = 8;

export default function Maintenances() {
  const data = useLoaderData();
  const [maintenances, setMaintenances] = useState(data.maintenances);
  const [page, setPage] = useState(data.page);
  const [total, setTotal] = useState(data.total);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);

  const fetchMaintenances = async ({ page }) => {
    try {
      setIsLoading(true);
      const data = await getMaintenancesByCurrentUser({
        page,
        limit,
      });
      setMaintenances(data.maintenances);
      setTotal(data.total);
      setPage(data.page);
    } catch (error) {
      console.log(formatAxiosError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePage = async (page) => {
    await fetchMaintenances({ page });
  };

  return (
    <>
      <CreateMaintenanceModal
        show={isShowModal}
        handleClose={() => setIsShowModal(false)}
        setMaintenances={setMaintenances}
      />
      <Col md={9}>
        <Card className="mb-4">
          <Card.Body>
            <h3 className="mb-4">Bảo trì</h3>

            <Row className="mb-4">
              <Col xs={3} className="ms-auto d-flex justify-content-end">
                <Button variant="primary" onClick={() => setIsShowModal(true)}>
                  <FaPlus /> Yêu cầu bảo trì
                </Button>
              </Col>
            </Row>

            {!isLoading && (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Phòng</th>
                    <th>Mô tả</th>
                    <th>Trạng thái</th>
                    <th>Ngày yêu cầu</th>
                    <th>Ngày giải quyết</th>
                  </tr>
                </thead>
                <tbody>
                  {maintenances.map((maintenance) => (
                    <tr key={maintenance.id}>
                      <td>{maintenance.rooms.room_number}</td>
                      <td>{maintenance.description}</td>
                      <td>
                        {maintenance.status === "pending" && "Chờ xử lý"}
                        {maintenance.status === "in_progress" && "Đang xử lý"}
                        {maintenance.status === "completed" && "Đã xử lý"}
                      </td>
                      <td>
                        {new Date(
                          maintenance.request_date
                        ).toLocaleDateString()}
                      </td>
                      <td>
                        {maintenance.resolved_date &&
                          new Date(
                            maintenance.resolved_date
                          ).toLocaleDateString()}
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
          </Card.Body>
        </Card>
      </Col>
    </>
  );
}
