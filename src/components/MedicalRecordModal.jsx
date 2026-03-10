import { FileTextOutlined, SaveOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, message, Modal, Space } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import medicalRecordService from "../services/medicalRecord.service";

const { TextArea } = Input;

const MedicalRecordModal = ({ open, onClose, appointment, patientId }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const record = appointment?.medicalRecord;

  const createMutation = useMutation({
    mutationFn: medicalRecordService.createMedicalRecord,
    onSuccess: () => {
      message.success(t("record_created_success"));
      queryClient.invalidateQueries(["patientAppointments", patientId]);
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) =>
      medicalRecordService.updateMedicalRecord(id, data),
    onSuccess: () => {
      message.success(t("record_updated_success"));
      queryClient.invalidateQueries(["patientAppointments", patientId]);
      onClose();
    },
  });

  useEffect(() => {
    if (record) {
      form.setFieldsValue(record);
    } else {
      form.resetFields();
    }
  }, [record]);

  const handleSubmit = (values) => {
    if (record) {
      updateMutation.mutate({
        id: record.id,
        data: values,
      });
    } else {
      createMutation.mutate({
        patientId,
        appointmentId: appointment.id,
        ...values,
      });
    }
  };

  const loading = createMutation.isLoading || updateMutation.isLoading;

  return (
    <Modal
      open={open}
      width={650}
      title={
        <Space>
          <FileTextOutlined />
          {record ? t("edit_medical_record") : t("add_medical_record")}
        </Space>
      }
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ marginTop: 10 }}
      >
        <Form.Item name="diagnosis" label={t("diagnosis")}>
          <TextArea rows={3} placeholder={t("enter_diagnosis")} />
        </Form.Item>

        <Form.Item name="treatment" label={t("treatment_plan")}>
          <TextArea rows={3} placeholder={t("enter_treatment")} />
        </Form.Item>

        <Form.Item name="prescription" label={t("prescription")}>
          <TextArea rows={3} placeholder={t("enter_prescription")} />
        </Form.Item>

        <Form.Item name="notes" label={t("clinical_notes")}>
          <TextArea rows={3} placeholder={t("additional_notes")} />
        </Form.Item>

        <Form.Item style={{ marginTop: 24 }}>
          <Space style={{ width: "100%", justifyContent: "flex-end" }}>
            <Button onClick={onClose}>{t("cancel")}</Button>

            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={loading}
            >
              {record ? t("update_record") : t("save_record")}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MedicalRecordModal;
