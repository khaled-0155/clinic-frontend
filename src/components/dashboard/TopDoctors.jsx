import { useQuery } from "@tanstack/react-query";
import { Avatar, Button, Card, Empty } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import dashboardService from "../../services/dashboard.service";

export default function TopDoctors() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const { data = [], isLoading } = useQuery({
    queryKey: ["topDoctors"],
    queryFn: () => dashboardService.getTopDoctors(),
  });

  return (
    <Card
      loading={isLoading}
      className="top-doctors-widget"
      title={t("topDoctors")}
      extra={
        <Button type="link" onClick={() => navigate("/doctors")}>
          {t("viewAll")}
        </Button>
      }
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      {data.length === 0 ? (
        <Empty description={t("noDoctors")} />
      ) : (
        <div className="doctors-list">
          {data.map((doctor) => (
            <div
              key={doctor.id}
              className="doctor-row"
              onClick={() => navigate(`/doctors/${doctor.id}`)}
              style={{ cursor: "pointer" }}
            >
              <div className="doctor-info">
                <Avatar size={44}>
                  {doctor.name?.charAt(0)?.toUpperCase()}
                </Avatar>

                <div className="doctor-text">
                  <div className="doctor-name">{doctor.name}</div>

                  <div className="doctor-specialty">
                    {t("topPerformingDoctor")}
                  </div>
                </div>
              </div>

              <div className="patients-badge">
                {doctor.appointments} {t("appointments")}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
