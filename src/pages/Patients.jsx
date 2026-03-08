import PatientForm from "@/components/PatientForm";
import patientsService from "@/services/patients.service";
import { DeleteOutlined, EditOutlined, UserOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  Card,
  Input,
  Popconfirm,
  Space,
  Table,
  message,
} from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import RoleGuard from "../app/RoleGaurd";

export default function Patients() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["patients", filters],
    queryFn: () => patientsService.getPatients(filters),
    keepPreviousData: true,
  });

  const handleTableChange = (pagination) => {
    setFilters((prev) => ({
      ...prev,
      page: pagination.current,
      limit: pagination.pageSize,
    }));
  };

  const deleteMutation = useMutation({
    mutationFn: (id) => patientsService.deletePatient(id),
    onSuccess: () => {
      message.success(t("patient_deleted"));
      queryClient.invalidateQueries({ queryKey: ["patients"] });
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
      render: (_, record) => (
        <Link to={`/patients/${record.id}`} style={{ fontWeight: 500 }}>
          {record.name}
        </Link>
      ),
    },
    {
      title: t("phone"),
      dataIndex: "phone",
    },
    {
      title: t("notes"),
      dataIndex: "notes",
      responsive: ["md"],
    },
    {
      title: t("created_at"),
      dataIndex: "createdAt",
      responsive: ["md"],
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: t("actions"),
      render: (_, record) => (
        <Space>
          <RoleGuard allow={["ADMIN", "STAFF"]}>
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedPatient(record);
                setOpen(true);
              }}
            >
              {t("edit")}
            </Button>
          </RoleGuard>

          <RoleGuard allow="ADMIN">
            <Popconfirm
              title={t("confirm_delete")}
              onConfirm={() => deleteMutation.mutate(record.id)}
            >
              <Button danger size="small" icon={<DeleteOutlined />}>
                {t("delete")}
              </Button>
            </Popconfirm>
          </RoleGuard>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card
        title={t("patients")}
        extra={
          <Button type="primary" onClick={() => setOpen(true)}>
            {t("add_patient")}
          </Button>
        }
      >
        <Input
          placeholder={t("search")}
          allowClear
          style={{ marginBottom: 16 }}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              search: e.target.value,
              page: 1,
            }))
          }
        />

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
      <PatientForm
        open={open}
        patient={selectedPatient}
        onClose={() => {
          setOpen(false);
          setSelectedPatient(null);
        }}
      />{" "}
    </>
  );
}
