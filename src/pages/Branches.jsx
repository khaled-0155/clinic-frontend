import BranchForm from "@/components/BranchForm";
import branchesService from "@/services/branches.service";
import { MoreOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, Dropdown, Table, message } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function Branches() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["branches"],
    queryFn: branchesService.getBranches,
  });

  const deleteMutation = useMutation({
    mutationFn: branchesService.deleteBranch,
    onSuccess: () => {
      message.success(t("branch_deleted"));
      queryClient.invalidateQueries({ queryKey: ["branches"] });
    },
    onError: (error) => {
      message.error(error?.response?.data?.message);
    },
  });

  const columns = [
    {
      title: t("name"),
      dataIndex: "name",
    },
    {
      title: t("address"),
      dataIndex: "address",
    },
    {
      title: t("staff_count"),
      render: (_, record) => record.staff?.length || 0,
    },
    {
      title: t("actions"),
      render: (_, record) => {
        const items = [
          {
            key: "edit",
            label: t("edit"),
            onClick: () => {
              setEditing(record);
              setOpen(true);
            },
          },

          {
            type: "divider",
          },
          {
            key: "delete",
            danger: true,
            label: t("delete"),
            onClick: () => {
              Modal.confirm({
                title: t("confirm_delete"),
                okText: t("delete"),
                cancelText: t("cancel"),
                okType: "danger",
                onOk: () => deleteMutation.mutate(record.id),
              });
            },
          },
        ];

        return (
          <Dropdown
            menu={{ items }} // ✅ THIS WAS MISSING
            trigger={["click"]}
            placement="bottomRight"
            overlayStyle={{ width: 140 }} // 👈 make it wider
          >
            <Button size="small" icon={<MoreOutlined />} />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <>
      <Card
        title={t("branches")}
        extra={
          <Button
            type="primary"
            onClick={() => {
              setEditing(null);
              setOpen(true);
            }}
          >
            {t("add_branch")}
          </Button>
        }
      >
        <Table
          rowKey="id"
          columns={columns}
          dataSource={data || []}
          loading={isLoading}
        />
      </Card>

      {/* Create / Edit Branch */}
      <BranchForm
        open={open}
        onClose={() => setOpen(false)}
        editing={editing}
      />

      {/* ✅ Global Assign Drawer */}
      {/* <AssignStaff
        open={assignOpen}
        onClose={() => setAssignOpen(false)}
        role="STAFF"
        title="assign_staff"
        successMessage="staff_assigned"
        initialSelectedIds={
          data
            ?.find((b) => b.id === selectedBranchId)
            ?.staff?.map((s) => s.id) || []
        }
        mutationFn={(userIds) =>
          branchesService.assignStaff(selectedBranchId, userIds)
        }
        invalidateKeys={[["branches"], ["users"]]}
      /> */}
    </>
  );
}
