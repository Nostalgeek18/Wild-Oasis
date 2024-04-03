import Heading from "../ui/Heading";
import Row from "../ui/Row";
import DashboardLayout from "../features/dashboard/DashboardLayout";
import DashBoardFilter from "../features/dashboard/DashboardFilter";

function Dashboard() {
  return (
    <>
    <Row type="horizontal">
      <Heading as="h1">Dashboard</Heading>
      <DashBoardFilter />
    </Row>
    <DashboardLayout />
    </>
  );
}

export default Dashboard;
