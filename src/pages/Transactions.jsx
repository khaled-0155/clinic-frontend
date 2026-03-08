import {
  CalendarOutlined,
  DollarOutlined,
  EyeOutlined,
  FileTextOutlined,
  MedicineBoxOutlined,
  PlusOutlined,
  ShopOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Descriptions,
  Divider,
  Drawer,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Table,
  Tag,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import transactionService from "../services/transactions.service";

const { RangePicker } = DatePicker;
const { Title } = Typography;

export default function Transactions() {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    type: undefined,
    startDate: undefined,
    endDate: undefined,
  });

  const [expenseModal, setExpenseModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  /*
  =====================
  GET TRANSACTIONS
  =====================
  */

  const { data, isLoading } = useQuery({
    queryKey: ["transactions", filters],
    queryFn: () => transactionService.getTransactions(filters),
    keepPreviousData: true,
  });

  /*
  =====================
  GET TRANSACTION DETAILS
  =====================
  */

  const { data: transactionDetails } = useQuery({
    queryKey: ["transaction", selectedTransaction],
    queryFn: () => transactionService.getTransactionById(selectedTransaction),
    enabled: !!selectedTransaction,
  });

  /*
  =====================
  ADD EXPENSE
  =====================
  */

  const addExpenseMutation = useMutation({
    mutationFn: transactionService.createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries(["transactions"]);
      setExpenseModal(false);
      form.resetFields();
    },
  });

  /*
  =====================
  TABLE COLUMNS
  =====================
  */

  const columns = [
    {
      title: t("type"),
      dataIndex: "type",
      render: (value) => {
        const map = {
          PACKAGE: { color: "blue", label: t("package") },
          APPOINTMENT: { color: "green", label: t("appointment") },
          EXPENSE: { color: "red", label: t("expense") },
        };

        const item = map[value];

        return <Tag color={item?.color}>{item?.label}</Tag>;
      },
    },
    {
      title: t("amount"),
      dataIndex: "amount",
      render: (value) => `${value}`,
    },
    {
      title: t("patient"),
      render: (_, record) => record.patient?.name || "-",
    },
    {
      title: t("branch"),
      render: (_, record) => record.branch?.name || "-",
    },
    {
      title: t("doctor"),
      render: (_, record) => record.appointment?.doctor?.name || "-",
    },
    {
      title: t("date"),
      dataIndex: "createdAt",
      render: (value) => dayjs(value).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: t("notes"),
      dataIndex: "notes",
    },
    {
      title: t("actions"),
      render: (_, record) => (
        <Button
          icon={<EyeOutlined />}
          type="link"
          onClick={() => setSelectedTransaction(record.id)}
        >
          {t("view")}
        </Button>
      ),
    },
  ];

  return (
    <div
      className="transactions-page"
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      <Card
        title={t("transactions")}
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setExpenseModal(true)}
          >
            {t("addExpense")}
          </Button>
        }
      >
        {/* FILTERS */}

        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col xs={24} md={6}>
            <Select
              allowClear
              placeholder={t("type")}
              style={{ width: "100%" }}
              onChange={(value) =>
                setFilters({ ...filters, type: value, page: 1 })
              }
              options={[
                { label: t("package"), value: "PACKAGE" },
                { label: t("appointment"), value: "APPOINTMENT" },
                { label: t("expense"), value: "EXPENSE" },
              ]}
            />
          </Col>

          <Col xs={24} md={8}>
            <RangePicker
              style={{ width: "100%" }}
              onChange={(dates) => {
                setFilters({
                  ...filters,
                  startDate: dates?.[0]?.toISOString(),
                  endDate: dates?.[1]?.toISOString(),
                  page: 1,
                });
              }}
            />
          </Col>

          <Col xs={24} md={4}>
            <Button
              block
              onClick={() =>
                setFilters({
                  page: 1,
                  limit: 10,
                })
              }
            >
              {t("reset")}
            </Button>
          </Col>
        </Row>

        {/* TABLE */}

        <Table
          rowKey="id"
          loading={isLoading}
          columns={columns}
          dataSource={data?.data || []}
          pagination={{
            current: filters.page,
            pageSize: filters.limit,
            total: data?.pagination?.total,
            onChange: (page) => setFilters({ ...filters, page }),
          }}
        />
      </Card>

      {/* ADD EXPENSE MODAL */}

      <Modal
        title={t("addExpense")}
        open={expenseModal}
        onCancel={() => setExpenseModal(false)}
        footer={null}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={(values) => addExpenseMutation.mutate(values)}
        >
          <Form.Item
            label={t("amount")}
            name="amount"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label={t("notes")} name="notes">
            <Input.TextArea />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            loading={addExpenseMutation.isPending}
          >
            {t("save")}
          </Button>
        </Form>
      </Modal>

      {/* TRANSACTION DETAILS */}

      <Drawer
        title={t("transactionDetails")}
        open={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        width={420}
      >
        {transactionDetails && (
          <>
            {/* TYPE + AMOUNT */}
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <Title level={4}>
                <DollarOutlined style={{ marginRight: 8 }} />
                {transactionDetails.amount}
              </Title>

              <Tag
                color={
                  transactionDetails.type === "EXPENSE"
                    ? "red"
                    : transactionDetails.type === "PACKAGE"
                      ? "blue"
                      : "green"
                }
              >
                {t(transactionDetails.type.toLowerCase())}
              </Tag>
            </div>

            <Divider />

            <Descriptions column={1} size="middle" bordered>
              <Descriptions.Item
                label={
                  <>
                    <UserOutlined /> {t("patient")}
                  </>
                }
              >
                {transactionDetails.patient?.name || "-"}
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <>
                    <MedicineBoxOutlined /> {t("doctor")}
                  </>
                }
              >
                {transactionDetails.appointment?.doctor?.name || "-"}
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <>
                    <ShopOutlined /> {t("branch")}
                  </>
                }
              >
                {transactionDetails.branch?.name || "-"}
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <>
                    <CalendarOutlined /> {t("date")}
                  </>
                }
              >
                {dayjs(transactionDetails.createdAt).format("YYYY-MM-DD HH:mm")}
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <>
                    <FileTextOutlined /> {t("notes")}
                  </>
                }
              >
                {transactionDetails.notes || "-"}
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Drawer>
    </div>
  );
}
