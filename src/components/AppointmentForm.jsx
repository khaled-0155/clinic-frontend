// src/components/AppointmentForm.jsx
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Drawer,
  Empty,
  Form,
  InputNumber,
  Row,
  Select,
  Space,
  Tag,
  Typography,
  message,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import appointmentsService from "../services/appointments.service";
import branchesService from "../services/branches.service";
import patientsService from "../services/patients.service";
import schedulesService from "../services/schedules.service";
import usersService from "../services/users.service";

const { Text } = Typography;

export default function AppointmentForm({
  open,
  onClose,
  onSuccess,
  patientId,
}) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const timeFormat = isRTL ? "HH:mm" : "hh:mm A";

  const [form] = Form.useForm();
  const [selectedSlot, setSelectedSlot] = useState(null);

  // dropdown data
  const { data: doctorsResp } = useQuery({
    queryKey: ["doctors"],
    queryFn: () => usersService.getUsers({ role: "DOCTOR", limit: 200 }),
  });
  const doctors = useMemo(
    () => doctorsResp?.data || doctorsResp || [],
    [doctorsResp],
  );

  const { data: branches } = useQuery({
    queryKey: ["branches"],
    queryFn: () => branchesService.getBranches(),
  });

  const { data: patients } = useQuery({
    queryKey: ["patients"],
    queryFn: () => patientsService.getPatients({ limit: 200 }),
  });

  // Read form values to build slot fetch params
  const doctorId = Form.useWatch("doctorId", form);
  const branchId = Form.useWatch("branchId", form);
  const date = Form.useWatch("date", form); // dayjs object

  const formattedDate = date ? date.format("YYYY-MM-DD") : null;

  const { data: doctorSchedules = [] } = useQuery({
    queryKey: ["doctor-schedules-for-calendar", doctorId, branchId],
    queryFn: () => {
      if (!doctorId) return [];
      return schedulesService.getSchedules(doctorId, branchId);
    },
    enabled: !!doctorId && !!branchId,
  });

  const scheduledWeekDays = useMemo(() => {
    return doctorSchedules.filter((s) => s.isActive).map((s) => s.weekDay); // ["MONDAY", "WEDNESDAY", ...]
  }, [doctorSchedules]);

  // Fetch slots when doctor+branch+date are selected
  const {
    data: slotsResp,
    refetch: refetchSlots,
    isFetching,
  } = useQuery({
    queryKey: ["slots", doctorId, branchId, formattedDate],
    queryFn: () => {
      if (!doctorId || !branchId || !formattedDate)
        return { availabilityBlocks: [], slots: [] };

      return appointmentsService.getSlots({
        doctorId,
        branchId,
        date: formattedDate,
        includePast: false,
      });
    },
    enabled: !!doctorId && !!branchId && !!formattedDate,
    keepPreviousData: true,
  });

  const selectedPatientId = Form.useWatch("patientId", form);

  const { data: patientPackages } = useQuery({
    queryKey: ["patientPackages", selectedPatientId],
    queryFn: () => patientsService.getPatientPackages(selectedPatientId),
    enabled: !!selectedPatientId,
  });

  // mutation
  const mutation = useMutation({
    mutationFn: appointmentsService.createAppointment,
    onSuccess: () => {
      message.success(t("AppointmentCreated") || "Appointment created");
      form.resetFields();
      setSelectedSlot(null);
      onSuccess && onSuccess();
      onClose();
    },
    onError: (err) => {
      message.error(err?.response?.data?.message || "Error");
    },
  });

  useEffect(() => {
    if (patientId) {
      form.setFieldValue("patientId", patientId);
    }
  }, [patientId, form]);

  useEffect(() => {
    setSelectedSlot(null);
    // refetch slots if date/doctor/branch changes
    if (doctorId && branchId && formattedDate) refetchSlots();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctorId, branchId, formattedDate]);

  const slots = slotsResp?.slots || [];

  const availableCount = slots.filter((s) => s.status === "AVAILABLE").length;

  const handleSubmit = () => {
    if (!selectedSlot) {
      message.warn(t("SelectSlot") || "Please select a slot");
      return;
    }

    mutation.mutate({
      doctorId: selectedSlot.doctorId,
      branchId: selectedSlot.branchId,
      patientId: form.getFieldValue("patientId"),
      date: selectedSlot.date,
      startTime: selectedSlot.startTime,
      packageId: form.getFieldValue("packageId"),
      price: form.getFieldValue("price"),
    });
  };

  return (
    <Drawer
      title={t("AddAppointment") || "Add Appointment"}
      width={640}
      onClose={() => {
        onClose();
        form.resetFields();
        setSelectedSlot(null);
      }}
      open={open}
      destroyOnClose
      placement={isRTL ? "left" : "right"}
      className={isRTL ? "rtl-drawer" : ""}
    >
      <Form layout="vertical" form={form}>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="branchId"
              label={t("Branch") || "Branch"}
              rules={[
                { required: true, message: `${t("Branch")} is required` },
              ]}
            >
              <Select
                options={branches?.map((b) => ({ label: b.name, value: b.id }))}
                placeholder={t("Branch")}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="doctorId"
              label={t("Doctor") || "Doctor"}
              rules={[
                { required: true, message: `${t("Doctor")} is required` },
              ]}
            >
              <Select
                options={doctors?.map((d) => ({ label: d.name, value: d.id }))}
                placeholder={t("Doctor")}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="patientId"
              label={t("Patient") || "Patient"}
              rules={[
                { required: true, message: `${t("Patient")} is required` },
              ]}
            >
              <Select
                disabled={!!patientId}
                options={patients?.data?.map((p) => ({
                  label: p.name,
                  value: p.id,
                }))}
                placeholder={t("Patient")}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item name="packageId" label={t("package") || "Package"}>
              <Select
                allowClear
                placeholder={t("selectPackage")}
                options={patientPackages?.map((p) => ({
                  value: p.id,
                  label: `${p.name} (${p.remaining} ${t("sessions_left")})`,
                }))}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="price"
              label={t("Price") || "Price"}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const packageId = getFieldValue("packageId");

                    if (!packageId && (value === undefined || value === null)) {
                      return Promise.reject(
                        new Error(t("PriceRequired") || "Price is required"),
                      );
                    }

                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                disabled={!!form.getFieldValue("packageId")}
                placeholder={t("Price") || "Price"}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="date"
              label={t("Date") || "Date"}
              rules={[{ required: true, message: `${t("Date")} is required` }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                cellRender={(current, info) => {
                  if (info.type !== "date") return info.originNode;

                  const weekdayNames = [
                    "SUNDAY",
                    "MONDAY",
                    "TUESDAY",
                    "WEDNESDAY",
                    "THURSDAY",
                    "FRIDAY",
                    "SATURDAY",
                  ];

                  const dayName = weekdayNames[current.day()];

                  const hasSchedule = scheduledWeekDays.includes(dayName);

                  return (
                    <div style={{ position: "relative", height: "100%" }}>
                      {info.originNode}

                      {hasSchedule && (
                        <div
                          style={{
                            position: "absolute",
                            bottom: 4,
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            backgroundColor: "#1677ff",
                          }}
                        />
                      )}
                    </div>
                  );
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Card
          size="small"
          title={
            <Space>
              <Text strong>{t("Slots") || "Slots"}</Text>
              <Text type="secondary">
                {availableCount} {t("Available") || "available"}
              </Text>
            </Space>
          }
          style={{ marginTop: 12 }}
        >
          {!doctorId || !branchId || !formattedDate ? (
            <Empty
              description={
                t("SelectDoctorBranchDate") || "Select doctor, branch and date"
              }
            />
          ) : isFetching ? (
            <div style={{ padding: 30, textAlign: "center" }}>
              Loading slots…
            </div>
          ) : slots.length === 0 ? (
            <Empty description={t("NoSlots") || "No slots"} />
          ) : (
            <Row gutter={[8, 8]}>
              {slots.map((s) => {
                const isAvailable = s.status === "AVAILABLE";
                const startsAt = dayjs(s.startTime).format(timeFormat);
                return (
                  <Col key={s.startTime} xs={12} sm={8} md={6}>
                    <Card
                      hoverable={isAvailable}
                      bordered={selectedSlot?.startTime === s.startTime}
                      onClick={() => {
                        if (!isAvailable) return;
                        setSelectedSlot(s);
                      }}
                      bodyStyle={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "12px",
                        cursor: isAvailable ? "pointer" : "default",
                      }}
                    >
                      <div>
                        <Text strong>{startsAt}</Text>
                        <div style={{ marginTop: 6 }}>
                          {isAvailable ? (
                            <Tag icon={<CheckCircleOutlined />} color="success">
                              {t("Available") || "Available"}
                            </Tag>
                          ) : (
                            <Tag icon={<CloseCircleOutlined />} color="error">
                              {t("Booked") || "Booked"}
                            </Tag>
                          )}
                        </div>
                      </div>

                      {!isAvailable && s.appointment ? (
                        <div style={{ textAlign: "right" }}>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {s.appointment.patientName || t("Booked")}
                          </Text>
                        </div>
                      ) : null}
                    </Card>
                  </Col>
                );
              })}
            </Row>
          )}
        </Card>

        <div
          style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}
        >
          <Button
            onClick={() => {
              onClose();
              form.resetFields();
              setSelectedSlot(null);
            }}
            style={{ marginRight: 8 }}
          >
            {t("Cancel") || "Cancel"}
          </Button>

          <Button
            type="primary"
            disabled={!selectedSlot}
            onClick={handleSubmit}
            loading={mutation.isLoading}
          >
            {t("Create") || "Create"}
          </Button>
        </div>
      </Form>
    </Drawer>
  );
}
