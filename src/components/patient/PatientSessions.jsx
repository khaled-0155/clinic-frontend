import { useQuery } from "@tanstack/react-query";
import { Progress, Table } from "antd";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

import patientsService from "../../services/patients.service";

const PatientSessions = ({ patientId }) => {
  const { t } = useTranslation();

  const { data, isLoading } = useQuery({
    queryKey: ["patientSessions", patientId],
    queryFn: () => patientsService.getPatientSessions(patientId),
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
      dataIndex: "packageName",
    },
    {
      title: t("progress"),
      render: (_, record) => (
        <Progress
          percent={(record.used / record.total) * 100}
          format={() => `${record.used}/${record.total}`}
        />
      ),
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={data || []}
      loading={isLoading}
      scroll={{ x: "max-content" }}
      pagination={false}
    />
  );
};

export default PatientSessions;
