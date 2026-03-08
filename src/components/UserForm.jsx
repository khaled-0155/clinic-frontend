import usersService from "@/services/users.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Drawer, Form, Input, message, Radio, Select } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import branchesService from "../services/branches.service";

export default function UserForm({
  open,
  onClose,
  role = "DOCTOR",
  queryKey = "doctors",
  editingUser = null,
}) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [creationType, setCreationType] = useState("local");
  const isEdit = !!editingUser;

  const { data: branches } = useQuery({
    queryKey: ["branches"],
    queryFn: branchesService.getBranches,
    enabled: role === "STAFF" && open,
  });

  useEffect(() => {
    if (open) {
      if (editingUser) {
        form.setFieldsValue({
          ...editingUser,
          branchId: editingUser.branchId || undefined,
        });
      }
    } else {
      form.resetFields();
      setCreationType("local");
    }
  }, [open, editingUser]);

  const mutation = useMutation({
    mutationFn: async (values) => {
      const payload = {
        ...values,
        role,
      };

      if (isEdit) {
        return usersService.updateUser(editingUser.id, payload);
      }

      if (creationType === "local") {
        return usersService.createUserLocal(payload);
      } else {
        delete payload.password;
        return usersService.createUserInvite(payload);
      }
    },
    onSuccess: () => {
      message.success(
        isEdit
          ? t("user_updated")
          : creationType === "local"
            ? t("user_created")
            : t("user_invited"),
      );

      queryClient.invalidateQueries({
        queryKey,
      });

      onClose();
    },
  });

  const handleSubmit = (values) => {
    mutation.mutate(values);
  };

  return (
    <Drawer
      title={
        isEdit
          ? `${t("edit")} ${t(role.toLowerCase())}`
          : `${t("add")} ${t(role.toLowerCase())}`
      }
      open={open}
      onClose={onClose}
      width={420}
      destroyOnClose
    >
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        {!isEdit && (
          <Form.Item
            name="creationType"
            label={t("create_type")}
            initialValue="local"
          >
            <Radio.Group onChange={(e) => setCreationType(e.target.value)}>
              <Radio value="local">{t("local")}</Radio>
              <Radio value="invite">{t("invite")}</Radio>
            </Radio.Group>
          </Form.Item>
        )}

        <Form.Item name="name" label={t("name")} rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label={t("email")}
          rules={creationType === "invite" ? [{ required: true }] : []}
        >
          <Input />
        </Form.Item>

        {creationType === "local" && !isEdit && (
          <Form.Item
            name="password"
            label={t("password")}
            rules={[{ required: true }]}
          >
            <Input.Password />
          </Form.Item>
        )}

        {role === "STAFF" && (
          <Form.Item
            name="branchId"
            label={t("branch")}
            rules={[
              {
                required: true,
                message: t("branch_required"),
              },
            ]}
          >
            <Select
              placeholder={t("select_branch")}
              showSearch
              optionFilterProp="children"
            >
              {branches?.map((branch) => (
                <Select.Option key={branch.id} value={branch.id}>
                  {branch.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        <Button
          type="primary"
          htmlType="submit"
          loading={mutation.isLoading}
          block
        >
          {t("submit")}
        </Button>
      </Form>
    </Drawer>
  );
}
