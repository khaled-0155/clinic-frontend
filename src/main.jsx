import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider } from "antd";
import arEG from "antd/locale/ar_EG";
import enUS from "antd/locale/en_US";
import { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { useTranslation } from "react-i18next";
import { BrowserRouter } from "react-router-dom";

import AppRoutes from "./app/routes";
import { AuthProvider } from "./context/AuthContext";

import "./assets/styles/main.scss";
import "./i18n";

const queryClient = new QueryClient();

const AppWrapper = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language.startsWith("ar") ? "ar" : "en";

  useEffect(() => {
    document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  return (
    <ConfigProvider
      direction={currentLang === "ar" ? "rtl" : "ltr"}
      locale={currentLang === "ar" ? arEG : enUS}
    >
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ConfigProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<AppWrapper />);
