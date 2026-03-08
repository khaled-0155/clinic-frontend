import { Drawer, Form, Input, Button, message } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import branchesService from "@/services/branches.service";
import { useTranslation } from "react-i18next";

export default function BranchForm({ open, onClose, editing }) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values) =>
      editing
        ? branchesService.updateBranch(editing.id, values)
        : branchesService.createBranch(values),

    onSuccess: () => {
      message.success(t("branch_saved"));
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      onClose();
    },
  });

  return (
    <Drawer
      title={editing ? t("edit_branch") : t("add_branch")}
      open={open}
      onClose={onClose}
      width={400}
    >
      <Form
        layout="vertical"
        form={form}
        initialValues={editing}
        onFinish={mutation.mutate}
      >
        <Form.Item name="name" label={t("name")} rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="address" label={t("address")}>
          <Input />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          loading={mutation.isPending}
          block
        >
          {t("submit")}
        </Button>
      </Form>
    </Drawer>
  );
}
