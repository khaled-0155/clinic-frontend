import patientsService from "@/services/patients.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Drawer, Form, Input, message } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function PatientForm({ open, onClose, patient }) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const isEdit = !!patient;

  useEffect(() => {
    if (patient) {
      form.setFieldsValue({
        name: patient.name,
        phone: patient.phone,
      });
    } else {
      form.resetFields();
    }
  }, [patient]);

  const mutation = useMutation({
    mutationFn: (values) =>
      isEdit
        ? patientsService.updatePatient(patient.id, values)
        : patientsService.createPatient(values),

    onSuccess: () => {
      message.success(isEdit ? t("patient_updated") : t("patient_created"));

      queryClient.invalidateQueries({ queryKey: ["patients"] });

      form.resetFields();
      onClose();
    },

    onError: (error) => {
      message.error(error?.response?.data?.message || "Error");
    },
  });

  return (
    <Drawer
      title={isEdit ? t("edit_patient") : t("add_patient")}
      open={open}
      onClose={onClose}
      width={420}
      destroyOnClose
    >
      <Form layout="vertical" form={form} onFinish={mutation.mutate}>
        <Form.Item name="name" label={t("name")} rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="phone" label={t("phone")} rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        {/* notes only in create */}
        {!isEdit && (
          <Form.Item name="notes" label={t("notes")}>
            <Input.TextArea rows={3} />
          </Form.Item>
        )}

        <Button
          type="primary"
          htmlType="submit"
          loading={mutation.isPending}
          block
        >
          {isEdit ? t("update") : t("submit")}
        </Button>
      </Form>
    </Drawer>
  );
}
