import {
  CalendarOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  EditOutlined,
  FileTextOutlined,
  HomeOutlined,
  MedicineBoxOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Drawer, Spin, Tag } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import MedicalRecordModal from "../components/MedicalRecordModal";
import appointmentService from "../services/appointments.service";
import MedicalProgressModal from "./MedicalProgressModal";

const AppointmentDetails = ({ open, appointmentId, onClose }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [recordModalOpen, setRecordModalOpen] = useState(false);
  const [progressModalOpen, setProgressModalOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["appointment", appointmentId],
    queryFn: () => appointmentService.getAppointmentById(appointmentId),
    enabled: !!appointmentId,
  });

  const appointment = data?.data || data;

  if (!appointmentId) return null;

  const renderStatus = (status) => {
    if (status === "BOOKED") return <Tag color="blue">{t("booked")}</Tag>;
    if (status === "COMPLETED")
      return <Tag color="green">{t("completed")}</Tag>;
    if (status === "CANCELLED") return <Tag color="red">{t("cancelled")}</Tag>;
    return status;
  };

  const Field = ({ label, value }) => (
    <div className="info-row">
      <span>{label}</span>
      <span>{value || "-"}</span>
    </div>
  );

  return (
    <>
      <Drawer
        open={open}
        width={520}
        onClose={onClose}
        title={t("appointment_details")}
        className="appointment-details-drawer"
      >
        {isLoading ? (
          <div className="drawer-loading">
            <Spin size="large" />
          </div>
        ) : (
          <>
            {/* Patient */}
            <div className="section">
              <div className="section-header">
                <span className="icon patient">
                  <UserOutlined />
                </span>
                <h3>{t("patient")}</h3>
              </div>

              <Field label={t("name")} value={appointment?.patient?.name} />
              <Field label={t("phone")} value={appointment?.patient?.phone} />
            </div>

            {/* Appointment */}
            <div className="section">
              <div className="section-header">
                <span className="icon appointment">
                  <CalendarOutlined />
                </span>
                <h3>{t("appointment")}</h3>
              </div>

              <Field
                label={t("date")}
                value={dayjs(appointment?.date).format("YYYY-MM-DD")}
              />

              <Field
                label={t("time")}
                value={
                  <>
                    <ClockCircleOutlined style={{ marginRight: 6 }} />
                    {dayjs(appointment?.startTime).format("HH:mm")} -{" "}
                    {dayjs(appointment?.endTime).format("HH:mm")}
                  </>
                }
              />

              <Field
                label={t("status")}
                value={renderStatus(appointment?.status)}
              />
            </div>

            {/* Doctor */}
            <div className="section">
              <div className="section-header">
                <span className="icon doctor">
                  <MedicineBoxOutlined />
                </span>
                <h3>{t("doctor")}</h3>
              </div>

              <Field label={t("doctor")} value={appointment?.doctor?.name} />

              <Field
                label={t("branch")}
                value={
                  <>
                    <HomeOutlined style={{ marginRight: 6 }} />
                    {appointment?.branch?.name}
                  </>
                }
              />
            </div>

            {/* Payment */}
            {appointment?.transaction && (
              <div className="section">
                <div className="section-header">
                  <span className="icon payment">
                    <DollarOutlined />
                  </span>
                  <h3>{t("payment")}</h3>
                </div>

                <Field
                  label={t("amount")}
                  value={appointment.transaction.amount}
                />
              </div>
            )}

            {/* Medical Record */}
            <div className="section medical">
              <div className="section-header">
                <span className="icon record">
                  <FileTextOutlined />
                </span>

                <h3>{t("medical_record")}</h3>

                <Button
                  size="small"
                  type="primary"
                  icon={
                    appointment?.medicalRecord ? (
                      <EditOutlined />
                    ) : (
                      <PlusOutlined />
                    )
                  }
                  onClick={() => setRecordModalOpen(true)}
                >
                  {appointment?.medicalRecord ? t("edit") : t("add")}
                </Button>
              </div>

              {appointment?.medicalRecord ? (
                <>
                  <div className="medical-block">
                    <label>{t("diagnosis")}</label>
                    <p>{appointment.medicalRecord.diagnosis || "-"}</p>
                  </div>

                  <div className="medical-block">
                    <label>{t("treatment")}</label>
                    <p>{appointment.medicalRecord.treatment || "-"}</p>
                  </div>

                  <div className="medical-block">
                    <label>{t("prescription")}</label>
                    <p>{appointment.medicalRecord.prescription || "-"}</p>
                  </div>

                  <div className="medical-block">
                    <label>{t("notes")}</label>
                    <p>{appointment.medicalRecord.notes || "-"}</p>
                  </div>
                </>
              ) : (
                <p className="no-record">{t("no_medical_record")}</p>
              )}
            </div>
            {/* Progress */}
            <div className="section progress">
              <div className="section-header">
                <span className="icon progress">
                  <FileTextOutlined />
                </span>

                <h3>{t("progress")}</h3>

                <Button
                  size="small"
                  type="primary"
                  icon={
                    appointment?.progress ? <EditOutlined /> : <PlusOutlined />
                  }
                  onClick={() => setProgressModalOpen(true)}
                >
                  {appointment?.progress ? t("edit") : t("add")}
                </Button>
              </div>

              {appointment?.progress ? (
                <>
                  <div className="medical-block">
                    <label>{t("pain_level")}</label>
                    <p>{appointment.progress.painLevel ?? "-"}</p>
                  </div>

                  <div className="medical-block">
                    <label>{t("mobility_score")}</label>
                    <p>{appointment.progress.mobilityScore ?? "-"}</p>
                  </div>

                  <div className="medical-block">
                    <label>{t("progress_notes")}</label>
                    <p>{appointment.progress.progressNote || "-"}</p>
                  </div>
                </>
              ) : (
                <p className="no-record">{t("no_progress_record")}</p>
              )}
            </div>
          </>
        )}
      </Drawer>

      {/* Medical Record Modal */}
      <MedicalRecordModal
        open={recordModalOpen}
        appointment={appointment}
        patientId={appointment?.patientId}
        onClose={() => {
          setRecordModalOpen(false);

          queryClient.invalidateQueries(["appointment", appointmentId]);
          queryClient.invalidateQueries([
            "patientMedicalRecords",
            appointment?.patientId,
          ]);
        }}
      />

      <MedicalProgressModal
        open={progressModalOpen}
        appointment={appointment}
        onClose={() => {
          setProgressModalOpen(false);

          queryClient.invalidateQueries(["appointment", appointmentId]);
          queryClient.invalidateQueries([
            "patientAppointments",
            appointment?.patientId,
          ]);
        }}
      />
    </>
  );
};

export default AppointmentDetails;
