import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  PlusOutlined,
  ScheduleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  Card,
  Col,
  Empty,
  Row,
  Spin,
  Statistic,
  Table,
  Tag,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import AppointmentForm from "../components/AppointmentForm.jsx";
import DoctorSchedule from "../components/DoctorSchedule.jsx";
import DoctorScheduleForm from "../components/DoctorScheduleForm.jsx";
import appointmentsService from "../services/appointments.service.js";
import usersService from "../services/users.service";

const { Title, Text } = Typography;

export default function DoctorDetails() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const timeFormat = isRTL ? "HH:mm" : "hh:mm A";

  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [appointmentOpen, setAppointmentOpen] = useState(false);

  const {
    data: doctor,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["doctor-details", id],
    queryFn: () => usersService.getUserById(id),
  });

  const { data: appointmentsResp, isLoading: apptsLoading } = useQuery({
    queryKey: ["doctor-appointments", id],
    queryFn: () =>
      appointmentsService.getAppointments({
        doctorId: id,
        limit: 15,
        page: 1,
        sortBy: "startTime",
        order: "desc",
      }),
    enabled: !!id,
  });

  if (isLoading) return <Spin />;

  const stats = doctor?.stats || {
    totalAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
    upcomingAppointments: 0,
    uniquePatients: 0,
    totalSessions: 0,
  };

  const columns = [
    {
      title: t("appointments_date"),
      dataIndex: "startTime",
      key: "date",
      render: (value) =>
        `${dayjs(value).format("YYYY-MM-DD")} ${dayjs(value).format(timeFormat)}`,
    },
    {
      title: t("appointments_patient"),
      dataIndex: ["patient", "name"],
      key: "patient",
    },
    {
      title: t("appointments_branch"),
      dataIndex: ["branch", "name"],
      key: "branch",
    },
    {
      title: t("appointments_status"),
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusMap = {
          BOOKED: {
            label: t("status_booked"),
            color: "blue",
          },
          COMPLETED: {
            label: t("status_completed"),
            color: "green",
          },
          CANCELLED: {
            label: t("status_cancelled"),
            color: "red",
          },
        };

        const s = statusMap[status] || {
          label: status,
          color: "default",
        };

        return <Tag color={s.color}>{s.label}</Tag>;
      },
    },
  ];

  return (
    <div className={`doctor-details-page ${isRTL ? "rtl" : ""}`}>
      {/* HEADER */}
      <Card className="doctor-header-card">
        <Row justify="space-between" align="middle">
          <Row gutter={16} align="middle">
            <Col>
              <Avatar size={80} icon={<UserOutlined />}>
                {doctor?.name?.charAt(0).toUpperCase()}
              </Avatar>
            </Col>
            <Col>
              <Title level={4}>{doctor?.name}</Title>
              <Tag
                icon={<CheckCircleOutlined />}
                color={doctor?.isActive ? "green" : "red"}
              >
                {doctor?.isActive
                  ? t("doctor_details_status_active")
                  : t("doctor_details_status_inactive")}
              </Tag>
              <div>
                <Text type="secondary">{doctor?.email}</Text>
              </div>
            </Col>
          </Row>

          <Button
            type="primary"
            icon={<CalendarOutlined />}
            onClick={() => setAppointmentOpen(true)}
          >
            {t("doctor_details_add_appointment")}
          </Button>
        </Row>
      </Card>

      {/* STATS */}
      <Row gutter={[20, 20]} style={{ marginTop: 20 }}>
        <Col xs={12} md={8}>
          <Card>
            <Statistic
              title={t("doctor_details_total_appointments")}
              value={stats.totalAppointments}
              valueStyle={{ fontSize: 26, fontWeight: 600 }}
              prefix={
                <CalendarOutlined
                  style={{ color: "#1677ff", fontSize: 28, marginRight: 8 }}
                />
              }
            />
          </Card>
        </Col>

        <Col xs={12} md={8}>
          <Card>
            <Statistic
              title={t("doctor_details_completed_appointments")}
              value={stats.completedAppointments}
              valueStyle={{ fontSize: 26, fontWeight: 600 }}
              prefix={
                <CheckCircleOutlined
                  style={{ color: "#52c41a", fontSize: 28, marginRight: 8 }}
                />
              }
            />
          </Card>
        </Col>

        <Col xs={12} md={8}>
          <Card>
            <Statistic
              title={t("doctor_details_upcoming_appointments")}
              value={stats.upcomingAppointments}
              valueStyle={{ fontSize: 26, fontWeight: 600 }}
              prefix={
                <ClockCircleOutlined
                  style={{ color: "#fa8c16", fontSize: 28, marginRight: 8 }}
                />
              }
            />
          </Card>
        </Col>

        <Col xs={12} md={8}>
          <Card>
            <Statistic
              title={t("doctor_details_unique_patients")}
              value={stats.uniquePatients}
              valueStyle={{ fontSize: 26, fontWeight: 600 }}
              prefix={
                <UserOutlined
                  style={{ color: "#722ed1", fontSize: 28, marginRight: 8 }}
                />
              }
            />
          </Card>
        </Col>

        <Col xs={12} md={8}>
          <Card>
            <Statistic
              title={t("doctor_details_total_sessions")}
              value={stats.totalSessions}
              valueStyle={{ fontSize: 26, fontWeight: 600 }}
              prefix={
                <ScheduleOutlined
                  style={{ color: "#13c2c2", fontSize: 28, marginRight: 8 }}
                />
              }
            />
          </Card>
        </Col>
      </Row>

      {/* SCHEDULE SECTION */}
      <Card
        style={{ marginTop: 20 }}
        title={
          <>
            <ScheduleOutlined /> {t("doctor_details_schedule")}
          </>
        }
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setScheduleOpen(true)}
          >
            {t("doctor_details_add_schedule")}
          </Button>
        }
      >
        <DoctorSchedule doctorId={doctor?.id} />
      </Card>

      {/* RECENT APPOINTMENTS */}
      <Card
        style={{ marginTop: 20 }}
        title={
          <>
            <CalendarOutlined /> {t("doctor_details_recent_appointments")}
          </>
        }
      >
        {apptsLoading ? (
          <Spin />
        ) : !appointmentsResp?.data?.length ? (
          <Empty description={t("doctor_details_no_appointments")} />
        ) : (
          <Table
            dataSource={appointmentsResp.data}
            columns={columns}
            rowKey="id"
            pagination={false}
            size="middle"
          />
        )}
      </Card>

      {/* Schedule Drawer */}
      <DoctorScheduleForm
        open={scheduleOpen}
        doctorId={doctor.id}
        onClose={() => setScheduleOpen(false)}
        onSuccess={refetch}
      />

      {/* Appointment Drawer */}
      <AppointmentForm
        open={appointmentOpen}
        onClose={() => setAppointmentOpen(false)}
        onSuccess={() => {
          setAppointmentOpen(false);
          refetch();
        }}
      />
    </div>
  );
}
