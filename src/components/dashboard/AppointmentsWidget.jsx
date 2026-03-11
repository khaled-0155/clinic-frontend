import { ClockCircleOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Avatar, Button, Calendar, Card, Empty, Select, Tag } from "antd";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import dashboardService from "../../services/dashboard.service";

const statusStyles = {
  BOOKED: { color: "#3b82f6", bg: "#eff6ff" },
  COMPLETED: { color: "#22c55e", bg: "#ecfdf5" },
  CANCELLED: { color: "#ef4444", bg: "#fef2f2" },
};

export default function AppointmentsWidget() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const isRTL = i18n.dir() === "rtl";

  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [status, setStatus] = useState("BOOKED");

  const { data = {}, isLoading } = useQuery({
    queryKey: ["appointmentsWidget", selectedDate.month(), status],
    queryFn: () =>
      dashboardService.getAppointmentsWidget(
        selectedDate.format("YYYY-MM-DD"),
        status,
      ),
  });

  const handleSelect = (date) => setSelectedDate(date);

  const handleMonthChange = (month) => {
    const newDate = selectedDate.month(month);
    setSelectedDate(newDate);
  };

  const dayAppointments = useMemo(() => {
    const key = selectedDate.format("YYYY-MM-DD");
    return (data?.[key] || []).slice(0, 4);
  }, [data, selectedDate]);

  const dateCellRender = (value) => {
    const key = value.format("YYYY-MM-DD");
    const dayData = data?.[key];

    if (!dayData || dayData.length === 0) return null;

    return (
      <div style={{ display: "flex", gap: 4, marginTop: 2 }}>
        {dayData.slice(0, 3).map((a) => (
          <span
            key={a.id}
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: statusStyles[a.status]?.color,
            }}
          />
        ))}
      </div>
    );
  };

  const months = [
    t("Jan"),
    t("Feb"),
    t("Mar"),
    t("Apr"),
    t("May"),
    t("Jun"),
    t("Jul"),
    t("Aug"),
    t("Sep"),
    t("Oct"),
    t("Nov"),
    t("Dec"),
  ];

  console.log(dayAppointments);

  return (
    <Card
      loading={isLoading}
      className="appointments-widget"
      title={t("Appointments")}
      dir={isRTL ? "rtl" : "ltr"}
      extra={
        <Select
          style={{ width: 150 }}
          value={status}
          onChange={setStatus}
          options={[
            { label: t("Booked"), value: "BOOKED" },
            { label: t("Cancelled"), value: "CANCELLED" },
            { label: t("Completed"), value: "COMPLETED" },
          ]}
        />
      }
    >
      {/* Month Selector */}
      <div style={{ marginBottom: 12 }}>
        <Select
          value={selectedDate.month()}
          onChange={handleMonthChange}
          style={{ width: "100%" }}
          options={months.map((m, i) => ({
            label: m,
            value: i,
          }))}
        />
      </div>

      {/* Calendar */}
      <Calendar
        fullscreen={false}
        value={selectedDate}
        onSelect={handleSelect}
        headerRender={() => null}
        dateCellRender={dateCellRender}
      />

      {/* Appointment List */}
      <div style={{ marginTop: 16 }}>
        {dayAppointments.length === 0 && !isLoading && (
          <Empty description={t("No appointments")} />
        )}

        {dayAppointments.map((a) => {
          const style = statusStyles[a.status];

          return (
            <div
              key={a.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 12px",
                borderRadius: 10,
                background: style.bg,
                marginBottom: 8,
                transition: "0.2s",
                flexDirection: isRTL ? "row-reverse" : "row",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Avatar style={{ background: style.color }}>
                  {a.patient?.charAt(0)}
                </Avatar>

                <div>
                  <div style={{ fontWeight: 600 }}>{a.patient}</div>

                  <div
                    style={{
                      fontSize: 12,
                      color: "#6b7280",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <ClockCircleOutlined />
                    {a.startTime}
                    {a.endTime && ` - ${a.endTime}`} — {a.doctor}{" "}
                  </div>
                </div>
              </div>

              <Tag
                color={style.color}
                style={{
                  borderRadius: 20,
                  fontWeight: 500,
                }}
              >
                {t(a.status)}
              </Tag>
            </div>
          );
        })}
      </div>

      <Button
        onClick={() => navigate("/appointments")}
        block
        type="primary"
        style={{ marginTop: 10 }}
      >
        {t("View All Appointments")}
      </Button>
    </Card>
  );
}
