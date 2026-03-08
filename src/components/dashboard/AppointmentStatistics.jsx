import { useQuery } from "@tanstack/react-query";
import { Card, Col, Row, Select } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import dashboardService from "../../services/dashboard.service";

export default function AppointmentStatistics() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";

  const [period, setPeriod] = useState("monthly");

  const { data, isLoading } = useQuery({
    queryKey: ["appointmentStatistics", period],
    queryFn: () => dashboardService.getAppointmentStatistics(period),
  });

  const chartData = data?.chart || [];

  const summary = data?.summary || {
    all: 0,
    cancelled: 0,
    completed: 0,
  };

  return (
    <Card
      className="appointment-statistics"
      title={t("Appointment Statistics")}
      loading={isLoading}
      dir={isRTL ? "rtl" : "ltr"}
      extra={
        <Select
          value={period}
          onChange={setPeriod}
          options={[
            { label: t("Daily"), value: "daily" },
            { label: t("Monthly"), value: "monthly" },
            { label: t("Yearly"), value: "yearly" },
          ]}
        />
      }
    >
      {/* Summary boxes */}
      <Row gutter={[16, 16]} className="appointment-summary">
        <Col xs={24} md={8}>
          <div className="summary-box">
            <span className="dot blue" />
            {t("All Appointments")}
            <h3>{summary.all}</h3>
          </div>
        </Col>

        <Col xs={24} md={8}>
          <div className="summary-box">
            <span className="dot red" />
            {t("Cancelled")}
            <h3>{summary.cancelled}</h3>
          </div>
        </Col>

        <Col xs={24} md={8}>
          <div className="summary-box">
            <span className="dot green" />
            {t("Completed")}
            <h3>{summary.completed}</h3>
          </div>
        </Col>
      </Row>

      {/* Chart */}
      <div className="appointment-chart">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData} barSize={22}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            <XAxis dataKey="label" />

            <YAxis />

            <Tooltip />

            <Legend
              formatter={(value) =>
                t(value.charAt(0).toUpperCase() + value.slice(1))
              }
            />

            <Bar
              name={t("Completed")}
              dataKey="completed"
              stackId="a"
              fill="#2dd4bf"
              radius={[6, 6, 0, 0]}
            />

            <Bar
              name={t("Booked")}
              dataKey="booked"
              stackId="a"
              fill="#60a5fa"
              radius={[6, 6, 0, 0]}
            />

            <Bar
              name={t("Cancelled")}
              dataKey="cancelled"
              stackId="a"
              fill="#6366f1"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
