import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Button,
  Col,
  Drawer,
  Empty,
  Form,
  List,
  message,
  Popconfirm,
  Row,
  Select,
  Spin,
  TimePicker,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { WEEK_DAYS } from "../constants/weekDays";
import branchesService from "../services/branches.service";
import schedulesService from "../services/schedules.service";
import usersService from "../services/users.service";
import { getWeekdayKey } from "../utils/getWeekdayKey";

const SLOT_OPTIONS = [5, 10, 15, 20, 30, 45, 60];

export default function DoctorScheduleForm({
  open,
  onClose,
  doctorId: defaultDoctorId = null,
  branchId: defaultBranchId = null,
  onSuccess = () => {},
}) {
  const [form] = Form.useForm();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const timeFormat = isRTL ? "HH:mm" : "hh:mm A";

  const [selectedDoctor, setSelectedDoctor] = useState(defaultDoctorId);
  const [selectedBranch, setSelectedBranch] = useState(defaultBranchId);

  // ---------------- Queries ----------------

  const { data: branches = [] } = useQuery({
    queryKey: ["branches"],
    queryFn: branchesService.getBranches,
  });

  const { data: doctorsResp = {} } = useQuery({
    queryKey: ["doctors"],
    queryFn: () =>
      usersService.getUsers({
        page: 1,
        limit: 200,
        role: "DOCTOR",
      }),
  });

  const doctors = useMemo(() => {
    if (!doctorsResp) return [];
    if (Array.isArray(doctorsResp.data)) return doctorsResp.data;
    if (Array.isArray(doctorsResp)) return doctorsResp;
    return [];
  }, [doctorsResp]);

  const {
    data: schedules = [],
    isLoading: loadingSchedules,
    refetch,
  } = useQuery({
    queryKey: ["schedules", selectedDoctor, selectedBranch],
    queryFn: () =>
      schedulesService.getSchedules(selectedDoctor, selectedBranch),
    enabled: !!selectedDoctor || !!selectedBranch,
  });

  // ---------------- Mutations ----------------

  const createMutation = useMutation({
    mutationFn: schedulesService.create,
    onSuccess: async () => {
      message.success(t("doctor_schedule_created"));
      form.resetFields();
      await refetch();
      onSuccess();
    },
    onError: (error) => {
      message.error(error?.response?.data?.message || "Error");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: schedulesService.remove,
    onSuccess: async () => {
      message.success(t("doctor_schedule_deleted"));
      await refetch();
      onSuccess();
    },
  });

  // ---------------- Effects ----------------

  useEffect(() => {
    if (open) {
      form.resetFields();

      if (defaultDoctorId) {
        form.setFieldsValue({ doctorId: defaultDoctorId });
        setSelectedDoctor(defaultDoctorId);
      }

      if (defaultBranchId) {
        form.setFieldsValue({ branchId: defaultBranchId });
        setSelectedBranch(defaultBranchId);
      }
    }
  }, [open, defaultDoctorId, defaultBranchId]);

  // ---------------- Submit ----------------

  const onFinish = (values) => {
    const payload = {
      doctorId: values.doctorId,
      branchId: values.branchId,
      weekDay: values.weekDay,
      startTime: values.startTime.format("HH:mm"),
      endTime: values.endTime.format("HH:mm"),
      slotMinutes: values.slotMinutes || 30,
      isActive: true,
    };

    createMutation.mutate(payload);
  };

  // ---------------- UI ----------------

  return (
    <Drawer
      title={t("doctor_schedule_manage_title")}
      open={open}
      onClose={onClose}
      width={600}
      destroyOnClose
      className={isRTL ? "rtl-drawer" : ""}
      placement={isRTL ? "left" : "right"}
    >
      <Spin spinning={loadingSchedules}>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Row gutter={[16, 16]}>
            {/* Doctor */}
            <Col xs={24} md={12}>
              <Form.Item
                name="doctorId"
                label={t("doctor_schedule_doctor")}
                rules={[{ required: true }]}
              >
                <Select
                  placeholder={t("doctor_schedule_select_doctor")}
                  onChange={setSelectedDoctor}
                >
                  {doctors.map((d) => (
                    <Select.Option key={d.id} value={d.id}>
                      {d.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            {/* Branch */}
            <Col xs={24} md={12}>
              <Form.Item
                name="branchId"
                label={t("doctor_schedule_branch")}
                rules={[{ required: true }]}
              >
                <Select
                  placeholder={t("doctor_schedule_select_branch")}
                  onChange={setSelectedBranch}
                >
                  {branches.map((b) => (
                    <Select.Option key={b.id} value={b.id}>
                      {b.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            {/* Weekday */}
            <Col xs={24} md={6}>
              <Form.Item
                name="weekDay"
                label={t("doctor_schedule_weekday")}
                rules={[{ required: true }]}
              >
                <Select placeholder={t("doctor_schedule_select_day")}>
                  {WEEK_DAYS.map((d) => (
                    <Select.Option key={d} value={d}>
                      {t(getWeekdayKey(d))}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            {/* Start */}
            <Col xs={12} md={6}>
              <Form.Item
                name="startTime"
                label={t("doctor_schedule_start")}
                rules={[{ required: true }]}
              >
                <TimePicker
                  format={timeFormat}
                  minuteStep={5}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>

            {/* End */}
            <Col xs={12} md={6}>
              <Form.Item
                name="endTime"
                label={t("doctor_schedule_end")}
                dependencies={["startTime"]}
                rules={[
                  { required: true },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const start = getFieldValue("startTime");
                      if (!start || !value) return Promise.resolve();

                      if (value.isAfter(start)) return Promise.resolve();

                      return Promise.reject(
                        new Error(t("doctor_schedule_end_after_start")),
                      );
                    },
                  }),
                ]}
              >
                <TimePicker
                  format={timeFormat}
                  minuteStep={5}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>

            {/* Slot Duration */}
            <Col xs={24} md={6}>
              <Form.Item
                name="slotMinutes"
                label={t("doctor_schedule_slot_duration")}
                initialValue={30}
                rules={[{ required: true }]}
              >
                <Select>
                  {SLOT_OPTIONS.map((m) => (
                    <Select.Option key={m} value={m}>
                      {m} {t("minutes")}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            {/* Add */}
            <Col xs={24}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                htmlType="submit"
                block
                loading={createMutation.isPending}
              >
                {t("doctor_schedule_add")}
              </Button>
            </Col>
          </Row>
        </Form>

        {/* Schedule List */}
        <div className="schedule-list">
          {!selectedDoctor && !selectedBranch ? (
            <Empty description={t("doctor_schedule_select_doctor_branch")} />
          ) : schedules.length === 0 ? (
            <Empty description={t("doctor_schedule_no_schedules")} />
          ) : (
            <List
              dataSource={schedules}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Popconfirm
                      title={t("doctor_schedule_delete_confirm")}
                      onConfirm={() => deleteMutation.mutate(item.id)}
                    >
                      <Button type="link" danger icon={<DeleteOutlined />} />
                    </Popconfirm>,
                  ]}
                >
                  <List.Item.Meta
                    title={`${t(getWeekdayKey(item.weekDay))} — 
                      ${dayjs(item.startTime).format(timeFormat)} - 
                      ${dayjs(item.endTime).format(timeFormat)}
                      (${item.slotMinutes || 30} ${t("minutes")})`}
                    description={
                      <>
                        👨‍⚕️ {item.doctor?.name}
                        <br />
                        🏥 {item.branch?.name}
                        <br />
                        {t("doctor_schedule_status")}:{" "}
                        {item.isActive
                          ? t("doctor_schedule_active")
                          : t("doctor_schedule_inactive")}
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </div>
      </Spin>
    </Drawer>
  );
}
