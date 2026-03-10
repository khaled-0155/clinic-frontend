import {
  CalendarOutlined,
  LineChartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Collapse,
  Pagination,
  Skeleton,
  Space,
  Tag,
  Typography,
  Empty,
} from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

import patientsService from "../../services/patients.service";

const { Panel } = Collapse;
const { Text, Paragraph } = Typography;

const PatientProgress = ({ patientId }) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["patientProgress", patientId, page],
    queryFn: () => patientsService.getPatientProgress(patientId, page),
    keepPreviousData: true,
  });

  if (isLoading) return <Skeleton active />;

  const progress = data?.data || [];
  const pagination = data?.pagination;

  if (!progress.length) {
    return (
      <Empty description={t("no_progress")} style={{ padding: "20px 0" }} />
    );
  }

  return (
    <div className="patient-progress">
      <Collapse accordion>
        {progress.map((item) => (
          <Panel
            key={item.id}
            header={
              <Space wrap>
                <LineChartOutlined />

                <Tag color="red">
                  {t("pain_level")}: {item.painLevel ?? "-"}
                </Tag>

                <Tag color="green">
                  {t("mobility_score")}: {item.mobilityScore ?? "-"}
                </Tag>

                <Tag color="blue">
                  {dayjs(item.createdAt).format("YYYY-MM-DD")}
                </Tag>

                <Text type="secondary">
                  <UserOutlined style={{ marginRight: 4 }} />
                  {item.doctor?.name}
                </Text>
              </Space>
            }
          >
            {/* Progress Notes */}
            {item.progressNote && (
              <div className="record-section">
                <Text strong>{t("progress_notes")}</Text>
                <Paragraph>{item.progressNote}</Paragraph>
              </div>
            )}

            {/* Appointment */}
            {item.appointment && (
              <div className="record-section">
                <Space>
                  <CalendarOutlined />

                  <Text type="secondary">
                    {dayjs(item.appointment.date).format("YYYY-MM-DD")}
                  </Text>

                  <Tag color="green">{item.appointment.status}</Tag>
                </Space>
              </div>
            )}
          </Panel>
        ))}
      </Collapse>

      {pagination && (
        <div className="records-pagination">
          <Pagination
            current={pagination.page}
            total={pagination.total}
            pageSize={pagination.limit}
            onChange={(p) => setPage(p)}
            showSizeChanger={false}
          />
        </div>
      )}
    </div>
  );
};

export default PatientProgress;
