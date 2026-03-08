import { MoreOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Dropdown,
  Input,
  Modal,
  Pagination,
  Row,
  Select,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useNavigate } from "react-router-dom";
import AppointmentForm from "../components/AppointmentForm";
import appointmentsService from "../services/appointments.service";

const { Title } = Typography;
const { RangePicker } = DatePicker;

const statusColors = {
  BOOKED: "blue",
  COMPLETED: "green",
  CANCELLED: "red",
};

export default function Appointments() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [statusModal, setStatusModal] = useState(false);
  const [statusType, setStatusType] = useState(null);
  const [note, setNote] = useState("");

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: undefined,
    from: undefined,
    to: undefined,
    search: "",
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["appointments", filters],
    queryFn: () => appointmentsService.getAppointments(filters),
    keepPreviousData: true,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, payload }) =>
      appointmentsService.updateStatus(id, payload),

    onSuccess: () => {
      message.success(t("StatusUpdated"));
      setStatusModal(false);
      setNote("");
      refetch();
    },

    onError: () => {
      message.error(t("error"));
    },
  });

  const openStatusModal = (record, type) => {
    setSelectedAppointment(record);
    setStatusType(type);
    setStatusModal(true);
  };

  const columns = [
    {
      title: t("Date"),
      dataIndex: "date",
      render: (value) => dayjs(value).format("YYYY-MM-DD"),
    },
    {
      title: t("Time"),
      render: (_, record) =>
        `${dayjs(record.startTime).format("HH:mm")} - ${dayjs(
          record.endTime,
        ).format("HH:mm")}`,
    },
    {
      title: t("Patient"),
      render: (_, record) => (
        <Button
          type="link"
          style={{ padding: 0 }}
          onClick={() => navigate(`/patients/${record.patient.id}`)}
        >
          {record.patient?.name}
        </Button>
      ),
    },
    {
      title: t("Doctor"),
      render: (_, record) => (
        <Button
          type="link"
          style={{ padding: 0 }}
          onClick={() => navigate(`/doctors/${record.doctor.id}`)}
        >
          {record.doctor?.name}
        </Button>
      ),
    },
    {
      title: t("Branch"),
      dataIndex: ["branch", "name"],
    },
    {
      title: t("Status"),
      dataIndex: "status",
      render: (status) => <Tag color={statusColors[status]}>{t(status)}</Tag>,
    },
    {
      title: t("created_at"),
      dataIndex: "createdAt",
      render: (value) => dayjs(value).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: t("Actions"),
      render: (_, record) => {
        const items = [
          {
            key: "edit",
            label: t("Edit"),
            onClick: () => {
              setSelectedAppointment(record);
              setDrawerOpen(true);
            },
          },
        ];

        if (record.status === "BOOKED") {
          items.push(
            {
              key: "complete",
              label: t("Complete"),
              onClick: () => openStatusModal(record, "COMPLETED"),
            },
            {
              key: "cancel",
              label: <span style={{ color: "red" }}>{t("Cancel")}</span>,
              onClick: () => openStatusModal(record, "CANCELLED"),
            },
          );
        }

        return (
          <Dropdown menu={{ items }} trigger={["click"]}>
            <Button icon={<MoreOutlined />} />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <div className="appointments-page">
      <Card>
        <Row justify="space-between" align="middle">
          <Title level={4}>{t("Appointments")}</Title>

          <Button
            type="primary"
            onClick={() => {
              setSelectedAppointment(null);
              setDrawerOpen(true);
            }}
          >
            {t("AddAppointment")}
          </Button>
        </Row>

        {/* Filters */}
        <Row gutter={16} style={{ marginBottom: 20 }}>
          <Col xs={24} md={6}>
            <Input
              placeholder={t("SearchPatient")}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  search: e.target.value,
                  page: 1,
                }))
              }
              allowClear
            />
          </Col>

          <Col xs={24} md={6}>
            <Select
              placeholder={t("Status")}
              allowClear
              style={{ width: "100%" }}
              onChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  status: value,
                  page: 1,
                }))
              }
            >
              <Select.Option value="BOOKED">{t("Booked")}</Select.Option>
              <Select.Option value="COMPLETED">{t("Completed")}</Select.Option>
              <Select.Option value="CANCELLED">{t("Cancelled")}</Select.Option>
            </Select>
          </Col>

          <Col xs={24} md={8}>
            <RangePicker
              style={{ width: "100%" }}
              onChange={(dates) => {
                if (!dates) return;
                setFilters((prev) => ({
                  ...prev,
                  from: dates[0].format("YYYY-MM-DD"),
                  to: dates[1].format("YYYY-MM-DD"),
                  page: 1,
                }));
              }}
            />
          </Col>
        </Row>

        <Table
          size="small"
          columns={columns}
          dataSource={data?.data || []}
          rowKey="id"
          loading={isLoading}
          pagination={false}
          scroll={{ x: "max-content" }}
        />

        <Pagination
          style={{ marginTop: 20, textAlign: "right" }}
          current={filters.page}
          pageSize={filters.limit}
          total={data?.meta?.total || 0}
          onChange={(page, pageSize) =>
            setFilters((prev) => ({
              ...prev,
              page,
              limit: pageSize,
            }))
          }
          showSizeChanger
        />
      </Card>

      {/* Appointment Form */}
      <AppointmentForm
        open={drawerOpen}
        initialValues={selectedAppointment}
        onClose={() => setDrawerOpen(false)}
        onSuccess={() => {
          setDrawerOpen(false);
          refetch();
        }}
      />

      {/* Status Modal */}
      <Modal
        open={statusModal}
        title={
          statusType === "COMPLETED"
            ? t("CompleteAppointment")
            : t("CancelAppointment")
        }
        onCancel={() => setStatusModal(false)}
        onOk={() => {
          if (statusType === "CANCELLED" && !note) {
            return message.error(t("CancelReasonRequired"));
          }

          statusMutation.mutate({
            id: selectedAppointment.id,
            payload: {
              status: statusType,
              doctorNotes: statusType === "COMPLETED" ? note : undefined,
              cancelReason: statusType === "CANCELLED" ? note : undefined,
            },
          });
        }}
      >
        <Input.TextArea
          rows={4}
          placeholder={
            statusType === "CANCELLED"
              ? t("CancelReason")
              : t("DoctorNotesOptional")
          }
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </Modal>
    </div>
  );
}
