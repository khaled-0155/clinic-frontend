import {
  CalendarOutlined,
  EditOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  Card,
  Col,
  Row,
  Skeleton,
  Space,
  Typography,
} from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import AppointmentForm from "../components/AppointmentForm";
import AssignPatientToPackageForm from "../components/AssignPatientToPackageForm";

import PatientAppointments from "../components/patient/PatientAppointments";
import PatientInfo from "../components/patient/PatientInfo";
import PatientNotes from "../components/patient/PatientNotes";
import PatientPackages from "../components/patient/PatientPackages";
import PatientSessions from "../components/patient/PatientSessions";

import PatientForm from "../components/PatientForm";
import patientsService from "../services/patients.service";

const { Title, Text } = Typography;

const PatientDetails = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [appointmentOpen, setAppointmentOpen] = useState(false);
  const [assignPackageOpen, setAssignPackageOpen] = useState(false);
  const [editPatientOpen, setEditPatientOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["patient", id],
    queryFn: () => patientsService.getPatient(id),
  });

  if (isLoading) {
    return <Skeleton active />;
  }

  const patient = data;

  return (
    <div className="patient-details">
      {/* Patient Header */}
      <Card className="patient-header">
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          {/* Left Section */}
          <Col>
            <Space size="large" align="center">
              <Avatar size={64} src={patient.avatar} icon={<UserOutlined />} />

              <div>
                <Title level={4} style={{ margin: 0 }}>
                  {patient.name}
                </Title>

                <Text type="secondary">{patient.phone}</Text>

                <br />

                <Text type="secondary">
                  {t("created_at")}:{" "}
                  {new Date(patient.createdAt).toLocaleDateString()}
                </Text>
              </div>
            </Space>
          </Col>

          {/* Right Section */}
          <Col>
            <Space>
              <Button
                type="primary"
                icon={<CalendarOutlined />}
                onClick={() => setAppointmentOpen(true)}
              >
                {t("book_appointment")}
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Patient Info */}
      <Card
        title={t("info")}
        extra={
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => setEditPatientOpen(true)}
          >
            {t("edit_patient")}
          </Button>
        }
        style={{ marginTop: 16 }}
      >
        <PatientInfo patient={patient} />
      </Card>

      {/* Packages + Sessions */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={10}>
          <Card
            title={t("packages")}
            extra={
              <Button type="primary" onClick={() => setAssignPackageOpen(true)}>
                {t("assign_package")}
              </Button>
            }
          >
            <PatientPackages patientId={id} />
          </Card>
        </Col>

        <Col xs={24} lg={14}>
          <Card title={t("sessions")}>
            <PatientSessions patientId={id} />
          </Card>
        </Col>
      </Row>

      {/* Appointments */}
      <Card
        title={t("appointments")}
        extra={
          <Button
            type="primary"
            icon={<CalendarOutlined />}
            onClick={() => setAppointmentOpen(true)}
          >
            {t("book_appointment")}
          </Button>
        }
        style={{ marginTop: 16 }}
      >
        <PatientAppointments patientId={id} />
      </Card>

      {/* Notes */}
      <Card title={t("notes")} style={{ marginTop: 16 }}>
        <PatientNotes patientId={id} />
      </Card>

      {/* Book Appointment Modal */}
      <AppointmentForm
        open={appointmentOpen}
        patientId={id}
        onClose={() => setAppointmentOpen(false)}
        onSuccess={() => {
          queryClient.invalidateQueries(["patientAppointments", id]);
        }}
      />

      {/* Assign Package Modal */}
      <AssignPatientToPackageForm
        open={assignPackageOpen}
        patientId={id}
        onClose={() => {
          setAssignPackageOpen(false);
          queryClient.invalidateQueries(["patientPackages", id]);
        }}
      />
      <PatientForm
        open={editPatientOpen}
        patient={patient}
        onClose={() => setEditPatientOpen(false)}
      />
    </div>
  );
};

export default PatientDetails;
