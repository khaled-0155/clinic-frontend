import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Form, Modal, Select, message } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import packagesService from "../services/packages.service";
import patientsService from "../services/patients.service";

const AssignPatientToPackageForm = ({
  open,
  onClose,
  packageId,
  patientId,
}) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const { data: patients } = useQuery({
    queryKey: ["patients"],
    queryFn: patientsService.getPatients,
    enabled: open,
  });

  const { data: packages } = useQuery({
    queryKey: ["packages"],
    queryFn: () => packagesService.getPackages({ page: 1, limit: 100 }),
    enabled: open,
  });

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        patientId: patientId || undefined,
        packageId: packageId || undefined,
      });
    }
  }, [open, patientId, packageId, form]);

  const assignMutation = useMutation({
    mutationFn: ({ packageId, patientId }) =>
      packagesService.assignPatientToPackage(packageId, { patientId }),

    onSuccess: () => {
      message.success(t("patient_assigned"));
      queryClient.invalidateQueries(["packagePatients"]);
      queryClient.invalidateQueries(["packages"]);
      form.resetFields();
      onClose();
    },

    onError: (err) => {
      message.error(err.response?.data?.message || t("error"));
    },
  });

  const handleSubmit = async () => {
    const values = await form.validateFields();

    assignMutation.mutate({
      packageId: values.packageId,
      patientId: values.patientId,
    });
  };

  return (
    <Modal
      open={open}
      title={t("assign_patient_to_package")}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={assignMutation.isPending}
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label={t("patient")}
          name="patientId"
          rules={[{ required: true, message: t("select_patient") }]}
        >
          <Select
            placeholder={t("select_patient")}
            options={
              patients?.data?.map((p) => ({
                label: p.name,
                value: p.id,
              })) || []
            }
            showSearch
            optionFilterProp="label"
          />
        </Form.Item>

        <Form.Item
          label={t("package")}
          name="packageId"
          rules={[{ required: true, message: t("select_package") }]}
        >
          <Select
            placeholder={t("select_package")}
            options={
              packages?.data?.map((pkg) => ({
                label: `${pkg.name} (${pkg.totalSessions})`,
                value: pkg.id,
              })) || []
            }
            showSearch
            optionFilterProp="label"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AssignPatientToPackageForm;
