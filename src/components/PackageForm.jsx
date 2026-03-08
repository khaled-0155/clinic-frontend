import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Input, InputNumber, Modal, message } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import packagesService from "../services/packages.service";

const PackageForm = ({ open, onClose, initialValues }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const mutation = useMutation({
    mutationFn: (values) => {
      if (initialValues) {
        return packagesService.updatePackage(initialValues.id, values);
      }
      return packagesService.createPackage(values);
    },
    onSuccess: () => {
      message.success(
        initialValues ? t("package_updated") : t("package_created"),
      );

      queryClient.invalidateQueries(["packages"]);
      form.resetFields();
      onClose();
    },
    onError: () => {
      message.error(t("error"));
    },
  });

  const handleFinish = (values) => {
    mutation.mutate(values);
  };

  return (
    <Modal
      open={open}
      title={initialValues ? t("edit_package") : t("create_package")}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={mutation.isPending}
      destroyOnClose
      width={500}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          name="name"
          label={t("name")}
          rules={[{ required: true, message: t("required") }]}
        >
          <Input placeholder={t("package_name")} />
        </Form.Item>

        <Form.Item
          name="totalSessions"
          label={t("sessions")}
          rules={[{ required: true, message: t("required") }]}
        >
          <InputNumber
            min={1}
            style={{ width: "100%" }}
            placeholder={t("sessions")}
          />
        </Form.Item>

        <Form.Item
          name="price"
          label={t("price")}
          rules={[{ required: true, message: t("required") }]}
        >
          <InputNumber
            min={0}
            style={{ width: "100%" }}
            placeholder={t("price")}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PackageForm;
