import {
  CalendarOutlined,
  DollarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Card, Col, Radio, Row } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, Line, LineChart, ResponsiveContainer } from "recharts";
import dashboardService from "../../services/dashboard.service";

export default function StatCards() {
  const { t, i18n } = useTranslation();

  const [period, setPeriod] = useState("week");

  const { data, isLoading } = useQuery({
    queryKey: ["dashboardStats", period],
    queryFn: () => dashboardService.getDashboardStats(period),
  });

  const miniChart = [
    { value: 5 },
    { value: 7 },
    { value: 6 },
    { value: 9 },
    { value: 12 },
    { value: 8 },
  ];

  if (!data) return null;

  const stats = [
    {
      title: t("patients"),
      value: data.patients?.value,
      change: data.patients?.change,
      icon: <UserOutlined />,
      color: "#EF4444",
      chart: "line",
    },
    {
      title: t("appointments"),
      value: data.appointments?.value,
      change: data.appointments?.change,
      icon: <CalendarOutlined />,
      color: "#3B82F6",
      chart: "bar",
    },
    {
      title: t("revenue"),
      value: `${data.revenue?.value}`,
      change: data.revenue?.change,
      icon: <DollarOutlined />,
      color: "#10B981",
      chart: "line",
    },
  ];

  return (
    <div
      className="stat-cards-container"
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      <div className="stat-header">
        <Radio.Group
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          optionType="button"
          buttonStyle="solid"
        >
          <Radio.Button value="day">{t("day")}</Radio.Button>
          <Radio.Button value="week">{t("week")}</Radio.Button>
          <Radio.Button value="month">{t("month")}</Radio.Button>
          <Radio.Button value="year">{t("year")}</Radio.Button>
        </Radio.Group>
      </div>

      <Row gutter={[20, 20]}>
        {stats.map((stat, index) => (
          <Col xs={24} md={12} lg={8} key={index}>
            <Card className="stat-card" bordered={false} loading={isLoading}>
              <div className="stat-card-inner">
                <div className="stat-left">
                  <div
                    className="stat-icon"
                    style={{ backgroundColor: stat.color }}
                  >
                    {stat.icon}
                  </div>

                  <div className="stat-text">
                    <span className="stat-title">{stat.title}</span>
                    <h2>{stat.value}</h2>
                  </div>
                </div>

                <div className="stat-right">
                  <div
                    className={`stat-badge ${
                      stat.change?.includes("-") ? "down" : "up"
                    }`}
                  >
                    {stat.change}
                  </div>

                  <span className="stat-sub">{t("vsLastPeriod")}</span>

                  <div className="stat-chart">
                    <ResponsiveContainer width="100%" height={50}>
                      {stat.chart === "line" ? (
                        <LineChart data={miniChart}>
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke={stat.color}
                            strokeWidth={3}
                            dot={false}
                          />
                        </LineChart>
                      ) : (
                        <BarChart data={miniChart}>
                          <Bar
                            dataKey="value"
                            fill={stat.color}
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
