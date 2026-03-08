import { useQuery } from "@tanstack/react-query";
import { Col, Empty, Row, Tag, Typography } from "antd";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { WEEK_DAYS } from "../constants/weekDays";
import scheduleService from "../services/schedules.service";
import { getWeekdayKey } from "../utils/getWeekdayKey";

const { Title, Text } = Typography;

export default function DoctorSchedule({ doctorId }) {
  const { t, i18n } = useTranslation();

  const isRTL = i18n.language === "ar";

  const { data = [] } = useQuery({
    queryKey: ["doctor-schedules", doctorId],
    queryFn: () => scheduleService.getSchedules(doctorId),
    enabled: !!doctorId,
  });

  const grouped = WEEK_DAYS.reduce((acc, day) => {
    acc[day] = data?.filter((s) => s.weekDay === day) || [];
    return acc;
  }, {});

  if (!data?.length) {
    return <Empty description={t("doctor_schedule_no_availability")} />;
  }

  return (
    <div
      className={`doctor-schedule ${isRTL ? "rtl" : ""}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Row gutter={[16, 16]} className="schedule-grid">
        {WEEK_DAYS.map((day) => (
          <Col xs={24} md={8} lg={6} key={day}>
            <div className="day-column">
              <Title level={5}>{t(getWeekdayKey(day))}</Title>

              {grouped[day].length === 0 ? (
                <Text type="secondary">{t("doctor_schedule_no_slots")}</Text>
              ) : (
                grouped[day].map((slot) => (
                  <div key={slot.id} className="slot-card">
                    <div className="slot-time">
                      {dayjs(slot.startTime).format("HH:mm")} -{" "}
                      {dayjs(slot.endTime).format("HH:mm")}
                    </div>

                    <div className="slot-branch">
                      <Text strong>{slot.branch?.name}</Text>
                      <br />
                      <Text type="secondary" className="branch-address">
                        {slot.branch?.address}
                      </Text>
                    </div>

                    <Tag color={slot.isActive ? "blue" : "default"}>
                      {slot.isActive
                        ? t("doctor_schedule_active")
                        : t("doctor_schedule_inactive")}
                    </Tag>
                  </div>
                ))
              )}
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
}
