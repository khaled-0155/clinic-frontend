import UserForm from "@/components/UserForm";
import usersService from "@/services/users.service";
import { UserOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  Card,
  Input,
  Popconfirm,
  Select,
  Space,
  Switch,
  Table,
  message,
} from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import RoleGuard from "../app/RoleGaurd";

const { Option } = Select;

export default function Users({ role }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
    isActive: undefined,
    branchId: undefined,
    role,
  });

  // Dynamic query key based on role
  const queryKey = ["users", role, filters];

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () => usersService.getUsers(filters),
    keepPreviousData: true,
  });

  const handleTableChange = (pagination) => {
    setFilters((prev) => ({
      ...prev,
      page: pagination.current,
      limit: pagination.pageSize,
    }));
  };

  // Toggle Status
  const toggleMutation = useMutation({
    mutationFn: (id) => usersService.toggleUserStatus(id),
    onSuccess: () => {
      message.success(t("status_updated"));
      queryClient.invalidateQueries({ queryKey: ["users", role] });
    },
  });

  // Delete User
  const deleteMutation = useMutation({
    mutationFn: (id) => usersService.deleteUser(id),
    onSuccess: () => {
      message.success(t("user_deleted"));
      queryClient.invalidateQueries({ queryKey: ["users", role] });
    },
    onError: (error) => {
      message.error(error?.response?.data?.message || "Error");
    },
  });

  const columns = [
    {
      title: "",
      width: 70,
      render: (_, record) => (
        <Avatar src={record.avatar} icon={<UserOutlined />} />
      ),
    },
    {
      title: t("name"),
      dataIndex: "name",
      render: (text, record) =>
        role === "DOCTOR" ? (
          <span
            style={{ color: "#1677ff", cursor: "pointer", fontWeight: 500 }}
            onClick={() => navigate(`/doctors/${record.id}`)}
          >
            {text}
          </span>
        ) : (
          text
        ),
    },
    {
      title: t("email"),
      dataIndex: "email",
      responsive: ["md"],
    },

    ...(role === "STAFF"
      ? [
          {
            title: t("branch"),
            dataIndex: ["branch", "name"],
            render: (_, record) =>
              record.branch?.name || (
                <span style={{ color: "#999" }}>{t("not_assigned")}</span>
              ),
          },
        ]
      : []),

    /* STATUS → ADMIN ONLY */
    {
      title: t("status"),
      dataIndex: "isActive",
      render: (value, record) => (
        <RoleGuard allow="ADMIN">
          <Switch
            checked={value}
            loading={toggleMutation.isPending}
            onChange={() => toggleMutation.mutate(record.id)}
          />
        </RoleGuard>
      ),
    },

    {
      title: t("created_at"),
      dataIndex: "createdAt",
      responsive: ["md"],
      render: (date) => new Date(date).toLocaleDateString(),
    },

    /* ACTIONS → ADMIN ONLY */
    {
      title: t("actions"),
      render: (_, record) => (
        <RoleGuard allow="ADMIN">
          <Space>
            <Button
              size="small"
              onClick={() => {
                setEditingUser(record);
                setOpen(true);
              }}
            >
              {t("edit")}
            </Button>

            <Popconfirm
              title={t("confirm_delete")}
              onConfirm={() => deleteMutation.mutate(record.id)}
              okText={t("yes")}
              cancelText={t("no")}
            >
              <Button danger size="small">
                {t("delete")}
              </Button>
            </Popconfirm>
          </Space>
        </RoleGuard>
      ),
    },
  ];

  return (
    <>
      <Card
        title={t(role.toLowerCase())}
        extra={
          <RoleGuard allow="ADMIN">
            <Button
              type="primary"
              onClick={() => {
                setEditingUser(null);
                setOpen(true);
              }}
            >
              {t("add")} {t(role.toLowerCase())}
            </Button>
          </RoleGuard>
        }
      >
        {/* Filters */}
        <div className="filters">
          <Input
            placeholder={t("search")}
            allowClear
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                search: e.target.value,
                page: 1,
              }))
            }
          />

          <Select
            placeholder={t("status")}
            allowClear
            onChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                isActive: value,
                page: 1,
              }))
            }
          >
            <Option value={true}>{t("active")}</Option>
            <Option value={false}>{t("inactive")}</Option>
          </Select>
        </div>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={data?.data || []}
          loading={isLoading}
          scroll={{ x: "max-content" }}
          pagination={{
            current: filters.page,
            pageSize: filters.limit,
            total: data?.meta?.total,
            showSizeChanger: true,
          }}
          onChange={handleTableChange}
        />
      </Card>

      <UserForm
        open={open}
        onClose={() => setOpen(false)}
        role={role}
        queryKey={["users", role]}
        editingUser={editingUser}
      />
    </>
  );
}
