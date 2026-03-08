import { useQuery } from "@tanstack/react-query";
import { Table, Tag } from "antd";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import patientsService from "../../services/patients.service";

const PatientAppointments = ({ patientId }) => {
  const { t } = useTranslation();

  const { data, isLoading } = useQuery({
    queryKey: ["patientAppointments", patientId],
    queryFn: () => patientsService.getPatientAppointments(patientId),
  });

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
    {
      title: t("package"),
      render: (_, record) => record.package?.package?.name || "-",
    },
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
      title: t("notes"),
      dataIndex: "doctorNotes",
      render: (value) => value || "-",
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={data?.data || data || []}
      loading={isLoading}
      scroll={{ x: "max-content" }}
      pagination={false}
    />
  );
};

export default PatientAppointments;
