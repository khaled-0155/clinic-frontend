import { Col, Row } from "antd";

import AppointmentStatistics from "../components/dashboard/AppointmentStatistics";
import AppointmentsWidget from "../components/dashboard/AppointmentsWidget";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import StatCards from "../components/dashboard/StatCards";
import TopDoctors from "../components/dashboard/TopDoctors";
import TopPatients from "../components/dashboard/TopPatients";

export default function Dashboard() {
  return (
    <div className="dashboard-page">
      {/* Stats */}
      <StatCards />

      <Row gutter={[20, 20]} style={{ marginTop: 20 }}>
        <Col span={24}>
          <AppointmentStatistics />
        </Col>
      </Row>
      {/* Chart + Calendar */}
      <Row gutter={[20, 20]} style={{ marginTop: 20 }} align="stretch">
        <Col xs={24} lg={12}>
          <RecentTransactions />
        </Col>

        <Col xs={24} lg={12}>
          <AppointmentsWidget />
        </Col>
      </Row>

      {/* Patients + Doctors */}
      <Row gutter={[20, 20]} style={{ marginTop: 20 }}>
        <Col xs={24} lg={12}>
          <TopPatients />
        </Col>

        <Col xs={24} lg={12}>
          <TopDoctors />
        </Col>
      </Row>
    </div>
  );
}
