import { EyeOutlined, FileAddOutlined, MoreOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Dropdown, Table, Tag } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import patientsService from "../../services/patients.service";
import AppointmentDetails from "../AppointmentDetails";
import MedicalRecordModal from "../MedicalRecordModal";

const PatientAppointments = ({ patientId }) => {
  const { t } = useTranslation();
  const [recordModalOpen, setRecordModalOpen] = useState(false);
  const [appoinmentModalOpen, setAppoinmentModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["patientAppointments", patientId],
    queryFn: () => patientsService.getPatientAppointments(patientId),
  });

  const openRecordModal = (appointment) => {
    setSelectedAppointment(appointment);
    setRecordModalOpen(true);
  };

  const columns = [
    {
      title: t("date"),
      dataIndex: "date",
      render: (value) => dayjs(value).format("YYYY-MM-DD"),
    },
    {
      title: t("time"),
      render: (_, record) =>
        `${dayjs(record.startTime).format("HH:mm")} - ${dayjs(
          record.endTime,
        ).format("HH:mm")}`,
    },
    {
      title: t("doctor"),
      dataIndex: ["doctor", "name"],
    },
    {
      title: t("branch"),
      dataIndex: ["branch", "name"],
    },
    // {
    //   title: t("package"),
    //   render: (_, record) => record.package?.package?.name || "-",
    // },
    // {
    //   title: t("diagnosis"),
    //   render: (_, record) => record.medicalRecord?.diagnosis || "-",
    // },
    // {
    //   title: t("notes"),
    //   dataIndex: "doctorNotes",
    //   render: (value) => value || "-",
    // },
    {
      title: t("status"),
      render: (_, record) => {
        const status = record.status;

        if (status === "BOOKED") return <Tag color="blue">{t("booked")}</Tag>;

        if (status === "COMPLETED")
          return <Tag color="green">{t("completed")}</Tag>;

        if (status === "CANCELLED")
          return <Tag color="red">{t("cancelled")}</Tag>;

        return status;
      },
    },

    {
      title: t("actions"),
      render: (_, record) => {
        const items = [
          {
            key: "view",
            icon: <EyeOutlined />,
            label: t("view_details"),
            onClick: () => {
              setSelectedAppointment(record);
              setAppoinmentModalOpen(true);
            },
          },
          {
            key: "medical_record",
            icon: <FileAddOutlined />,
            label: t("add_medical_record"),
            // disabled: record.status !== "COMPLETED",
            onClick: () => openRecordModal(record),
          },
        ];

        return (
          <Dropdown menu={{ items }} trigger={["click"]}>
            <Button icon={<MoreOutlined />} />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data?.data || data || []}
        loading={isLoading}
        scroll={{ x: "max-content" }}
        pagination={false}
      />
      <MedicalRecordModal
        open={recordModalOpen}
        onClose={() => setRecordModalOpen(false)}
        appointment={selectedAppointment}
        patientId={patientId}
      />
      <AppointmentDetails
        open={appoinmentModalOpen}
        appointmentId={selectedAppointment?.id}
        onClose={() => setAppoinmentModalOpen(false)}
      />
      ;
    </>
  );
};

export default PatientAppointments;
