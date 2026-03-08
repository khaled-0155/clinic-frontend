import { useQuery } from "@tanstack/react-query";
import { Avatar, Button, Card, Empty, Skeleton } from "antd";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import dashboardService from "../../services/dashboard.service";

export default function TopPatients() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const { data = [], isLoading } = useQuery({
    queryKey: ["topPatients"],
    queryFn: () => dashboardService.getTopPatients(),
  });

  const handleNavigate = (id) => {
    if (!isLoading) {
      navigate(`/patients/${id}`);
    }
  };

  return (
    <Card
      className="top-patients-widget"
      title={t("topPatients")}
      extra={
        <Button type="link" onClick={() => navigate("/patients")}>
          {t("viewAll")}
        </Button>
      }
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      {isLoading ? (
        <Skeleton active avatar paragraph={{ rows: 3 }} />
      ) : data.length === 0 ? (
        <Empty description={t("noPatients")} />
      ) : (
        <div className="patients-list">
          {data.map((p) => (
            <div
              key={p.id}
              className="patient-row"
              onClick={() => handleNavigate(p.id)}
              style={{ cursor: "pointer" }}
            >
              <div className="patient-info">
                <Avatar size={44}>{p.name?.charAt(0)?.toUpperCase()}</Avatar>

                <div className="patient-text">
                  <div className="patient-name">{p.name}</div>

                  <div className="patient-paid">
                    {t("totalPaid")} : ${p.paid}
                  </div>
                </div>
              </div>

              <div className="appointments-badge">
                {p.appointments} {t("appointments")}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
