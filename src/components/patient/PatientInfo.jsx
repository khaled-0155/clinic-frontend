import { Descriptions, Button } from "antd";
import { useTranslation } from "react-i18next";

const PatientInfo = ({ patient }) => {
  const { t } = useTranslation();

  return (
    <>
      <Descriptions bordered column={1}>
        <Descriptions.Item label={t("name")}>{patient.name}</Descriptions.Item>

        <Descriptions.Item label={t("phone")}>
          {patient.phone}
        </Descriptions.Item>

        <Descriptions.Item label={t("created_at")}>
          {new Date(patient.createdAt).toLocaleDateString()}
        </Descriptions.Item>
      </Descriptions>

      {/* <Button style={{ marginTop: 16 }}>{t("edit_patient")}</Button> */}
    </>
  );
};

export default PatientInfo;
