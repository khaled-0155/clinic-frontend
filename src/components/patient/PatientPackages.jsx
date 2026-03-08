import { useQuery } from "@tanstack/react-query";
import { Table } from "antd";
import { useTranslation } from "react-i18next";
import patientsService from "../../services/patients.service";

const PatientPackages = ({ patientId }) => {
  const { t } = useTranslation();

  const { data, isLoading } = useQuery({
    queryKey: ["patientPackages", patientId],
    queryFn: () => patientsService.getPatientPackages(patientId),
  });

  const columns = [
    {
      title: t("package"),
      dataIndex: "packageName",
    },
    {
      title: t("total"),
      dataIndex: "total",
    },
    {
      title: t("used"),
      dataIndex: "used",
    },
    {
      title: t("remaining"),
      dataIndex: "remaining",
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={data || []}
      loading={isLoading}
      pagination={false}
    />
  );
};

export default PatientPackages;
