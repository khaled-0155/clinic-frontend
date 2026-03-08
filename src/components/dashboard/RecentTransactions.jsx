import { useQuery } from "@tanstack/react-query";
import { Button, Card, Empty } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import dashboardService from "../../services/dashboard.service";

export default function RecentTransactions() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const isRTL = i18n.dir() === "rtl";

  const { data, isLoading } = useQuery({
    queryKey: ["recentTransactions"],
    queryFn: dashboardService.getRecentTransactions,
  });

  return (
    <Card
      loading={isLoading}
      className="recent-transactions-widget"
      title={t("Recent Transactions")}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="transactions-list">
        {!isLoading && (!data || data.length === 0) && (
          <Empty description={t("No transactions")} />
        )}

        {data?.map((tItem) => (
          <div key={tItem.id} className="transaction-row">
            <div
              className="transaction-info"
              style={{
                flexDirection: isRTL ? "row-reverse" : "row",
              }}
            >
              <div
                className="transaction-logo"
                style={{
                  background: tItem.type === "income" ? "#ecfdf5" : "#fef2f2",
                }}
              >
                {tItem.type === "income" ? "💰" : "💸"}
              </div>

              <div className="transaction-text">
                <div className="transaction-title">{tItem.title}</div>

                <div className="transaction-invoice">
                  {t("Invoice")}: {tItem.invoice}
                </div>
              </div>
            </div>

            <div
              className={`transaction-amount ${
                tItem.type === "income" ? "income" : "expense"
              }`}
            >
              {tItem.type === "income" ? "+" : "-"}$
              {Number(tItem.amount).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      <Button
        block
        style={{ marginTop: 12 }}
        onClick={() => navigate("/transactions")}
      >
        {t("View All Transactions")}
      </Button>
    </Card>
  );
}
