import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, Input, message, Popconfirm, Table, Tag } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import RoleGuard from "../app/RoleGaurd";
import AssignPatientToPackageForm from "../components/AssignPatientToPackageForm";
import PackageForm from "../components/PackageForm";
import packagesService from "../services/packages.service";
import patientsService from "../services/patients.service";

const Packages = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["packages", filters],
    queryFn: () => packagesService.getPackages(filters),
  });

  const { data: patients } = useQuery({
    queryKey: ["patients"],
    queryFn: patientsService.getPatients,
    enabled: assignOpen,
  });

  const deleteMutation = useMutation({
    mutationFn: packagesService.deletePackage,
    onSuccess: () => {
      message.success(t("package_deleted"));
      queryClient.invalidateQueries(["packages"]);
    },
    onError: (err) => {
      message.error(err.response?.data?.message || t("error"));
    },
  });

  const assignMutation = useMutation({
    mutationFn: ({ packageId, patientId }) =>
      packagesService.assignPatientToPackage(packageId, { patientId }),
    onSuccess: () => {
      message.success(t("patient_assigned"));
      queryClient.invalidateQueries(["packagePatients"]);
      setAssignOpen(false);
      setSelectedPatient(null);
    },
    onError: (err) => {
      message.error(err.response?.data?.message || t("error"));
    },
  });

  const columns = [
    {
      title: t("name"),
      dataIndex: "name",
    },
    {
      title: t("sessions"),
      dataIndex: "totalSessions",
    },
    {
      title: t("price"),
      dataIndex: "price",
    },
    {
      title: t("patients"),
      dataIndex: "patientsCount",
    },
    {
      title: t("status"),
      render: (_, record) =>
        record.isActive ? (
          <Tag color="green">{t("active")}</Tag>
        ) : (
          <Tag color="red">{t("inactive")}</Tag>
        ),
    },
    {
      title: t("actions"),
      render: (_, record) => (
        <>
          <Button
            type="link"
            onClick={() => {
              setSelectedPackage(record);
              setAssignOpen(true);
            }}
          >
            {t("assign_patient")}
          </Button>
          <RoleGuard allow="ADMIN">
            <Popconfirm
              title={t("confirm_delete")}
              onConfirm={() => deleteMutation.mutate(record.id)}
            >
              <Button type="link" danger>
                {t("delete")}
              </Button>
            </Popconfirm>
          </RoleGuard>
        </>
      ),
    },
  ];

  const handleTableChange = (pagination) => {
    setFilters((prev) => ({
      ...prev,
      page: pagination.current,
      limit: pagination.pageSize,
    }));
  };

  return (
    <>
      <Card
        title={t("packages")}
        extra={
          <RoleGuard allow="ADMIN">
            {" "}
            <Button
              type="primary"
              onClick={() => {
                setSelectedPackage(null);
                setOpen(true);
              }}
            >
              {t("create_package")}
            </Button>
          </RoleGuard>
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
          expandable={{
            expandedRowRender: (record) => (
              <PackagePatients packageId={record.id} />
            ),
          }}
          pagination={{
            current: filters.page,
            pageSize: filters.limit,
            total: data?.meta?.total,
            showSizeChanger: true,
          }}
          onChange={handleTableChange}
        />
      </Card>

      <PackageForm
        open={open}
        initialValues={selectedPackage}
        onClose={() => {
          refetch();
          setOpen(false);
        }}
      />

      <AssignPatientToPackageForm
        open={assignOpen}
        onClose={() => setAssignOpen(false)}
        packageId={selectedPackage?.id}
        patientId={selectedPatient}
      />
    </>
  );
};

export default Packages;

/*
----------------------------------------
Expanded Row Component
----------------------------------------
*/

const PackagePatients = ({ packageId }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["packagePatients", packageId],
    queryFn: () => packagesService.getPackagePatients(packageId),
  });

  const removeMutation = useMutation({
    mutationFn: packagesService.removePatientFromPackage,
    onSuccess: () => {
      message.success(t("patient_removed"));
      queryClient.invalidateQueries(["packagePatients"]);
    },
    onError: (err) => {
      message.error(err.response?.data?.message || t("error"));
    },
  });

  const columns = [
    {
      title: t("patient"),
      dataIndex: "patientName",
    },
    {
      title: t("phone"),
      dataIndex: "phone",
    },
    {
      title: t("total"),
      dataIndex: "total",
    },
    {
      title: t("used"),
      dataIndex: "used",
    },
    {
      title: t("remaining"),
      dataIndex: "remaining",
    },
    {
      title: t("created_at"),
      dataIndex: "createdAt",
    },
    {
      title: t("actions"),
      render: (_, record) => (
        <RoleGuard allow="ADMIN">
          <Popconfirm
            title={t("confirm_remove")}
            onConfirm={() => removeMutation.mutate(record.id)}
          >
            <Button disabled={record.used > 0} type="link" danger>
              {t("remove")}
            </Button>
          </Popconfirm>
        </RoleGuard>
      ),
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={data?.data || []}
      loading={isLoading}
      pagination={false}
      size="small"
      scroll={{ x: "max-content" }}
    />
  );
};
