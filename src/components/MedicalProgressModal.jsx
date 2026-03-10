import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, InputNumber, message, Modal, Space } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import appointmentService from "../services/appointments.service";

const { TextArea } = Input;

const MedicalProgressModal = ({ open, appointment, onClose }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const progress = appointment?.progress;

  const createMutation = useMutation({
    mutationFn: (data) => appointmentService.addProgress(appointment.id, data),
    onSuccess: () => {
      message.success(t("progress_saved_success"));
      onClose();
    },
    onError: () => {
      message.error(t("progress_save_failed"));
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) =>
      appointmentService.updateProgress(appointment.id, data),
    onSuccess: () => {
      message.success(t("progress_updated_success"));
      onClose();
    },
    onError: () => {
      message.error(t("progress_update_failed"));
    },
  });

  useEffect(() => {
    if (progress) {
      form.setFieldsValue(progress);
    } else {
      form.resetFields();
    }
  }, [progress]);

  const handleSubmit = (values) => {
    if (progress) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
  };

  const loading = createMutation.isLoading || updateMutation.isLoading;

  return (
    <Modal
      open={open}
      title={t("progress")}
      footer={null}
      onCancel={onClose}
      destroyOnClose
    >
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Form.Item name="painLevel" label={t("pain_level")}>
          <InputNumber min={0} max={10} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="mobilityScore" label={t("mobility_score")}>
          <InputNumber min={0} max={10} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="progressNote" label={t("progress_notes")}>
          <TextArea rows={3} />
        </Form.Item>

        <Form.Item>
          <Space style={{ width: "100%", justifyContent: "flex-end" }}>
            <Button onClick={onClose}>{t("cancel")}</Button>

            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={loading}
            >
              {progress ? t("update") : t("save")}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MedicalProgressModal;
