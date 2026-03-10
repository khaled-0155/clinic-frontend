import { CalendarOutlined, FileTextOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Collapse, Pagination, Skeleton, Space, Tag, Typography } from "antd";
import { useState } from "react";

import medicalRecordService from "../../services/medicalRecord.service";

const { Panel } = Collapse;
const { Text, Paragraph } = Typography;

const PatientMedicalRecords = ({ patientId }) => {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["patientMedicalRecords", patientId, page],
    queryFn: () =>
      medicalRecordService.getPatientMedicalRecords(patientId, page),
    keepPreviousData: true,
  });

  if (isLoading) return <Skeleton active />;

  const records = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="medical-records">
      <Collapse accordion>
        {records.map((record) => (
          <Panel
            key={record.id}
            header={
              <Space>
                <FileTextOutlined />

                <Text strong>{record.diagnosis || "Medical Record"}</Text>

                <Tag color="blue">
                  {new Date(record.createdAt).toLocaleDateString()}
                </Tag>

                <Text type="secondary">Dr. {record.doctor?.name}</Text>
              </Space>
            }
          >
            {/* Diagnosis */}
            {record.diagnosis && (
              <div className="record-section">
                <Text strong>Diagnosis</Text>
                <Paragraph>{record.diagnosis}</Paragraph>
              </div>
            )}

            {/* Treatment */}
            {record.treatment && (
              <div className="record-section">
                <Text strong>Treatment</Text>
                <Paragraph>{record.treatment}</Paragraph>
              </div>
            )}

            {/* Prescription */}
            {record.prescription && (
              <div className="record-section">
                <Text strong>Prescription</Text>
                <Paragraph>{record.prescription}</Paragraph>
              </div>
            )}

            {/* Notes */}
            {record.notes && (
              <div className="record-section">
                <Text strong>Notes</Text>
                <Paragraph>{record.notes}</Paragraph>
              </div>
            )}

            {/* Appointment */}
            {record.appointment && (
              <div className="record-section">
                <Space>
                  <CalendarOutlined />

                  <Text type="secondary">
                    {new Date(record.appointment.date).toLocaleDateString()}
                  </Text>

                  <Tag color="green">{record.appointment.status}</Tag>
                </Space>
              </div>
            )}
          </Panel>
        ))}
      </Collapse>

      {/* Pagination */}
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

export default PatientMedicalRecords;
