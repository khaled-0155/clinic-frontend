import {
  BankOutlined,
  CalendarOutlined,
  DashboardOutlined,
  DollarOutlined,
  GiftOutlined,
  SolutionOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Sidebar = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const isRTL = i18n.dir() === "rtl";

  const menuItems = [
    {
      key: "/",
      icon: <DashboardOutlined />,
      label: <Link to="/">{t("Dashboard")}</Link>,
      roles: ["ADMIN"],
    },

    {
      key: "/branches",
      icon: <BankOutlined />,
      label: <Link to="/branches">{t("Branches")}</Link>,
      roles: ["ADMIN"],
    },
    {
      key: `/doctors/${user?.id}`,
      icon: <UserOutlined />,
      label: <Link to={`/doctors/${user?.id}`}>{t("myProfile")}</Link>,
      roles: ["DOCTOR"],
    },
    {
      key: "/doctors",
      icon: <SolutionOutlined />,
      label: <Link to="/doctors">{t("Doctors")}</Link>,
      roles: ["ADMIN", "STAFF"],
    },
    {
      key: "/staff",
      icon: <TeamOutlined />,
      label: <Link to="/staff">{t("Staff")}</Link>,
      roles: ["ADMIN"],
    },
    {
      key: "/patients",
      icon: <UserOutlined />,
      label: <Link to="/patients">{t("Patients")}</Link>,
      roles: ["ADMIN", "STAFF"],
    },

    {
      key: "/appointments",
      icon: <CalendarOutlined />,
      label: <Link to="/appointments">{t("Appointments")}</Link>,
      roles: ["ADMIN", "DOCTOR", "STAFF"],
    },

    {
      key: "/packages",
      icon: <GiftOutlined />,
      label: <Link to="/packages">{t("Packages")}</Link>,
      roles: ["ADMIN", "STAFF"],
    },
    {
      key: "/transactions",
      icon: <DollarOutlined />,
      label: <Link to="/transactions">{t("Transactions")}</Link>,
      roles: ["ADMIN"],
    },
  ];

  const filteredItems = menuItems
    .filter((item) => item.roles.includes(user?.role))
    .map(({ roles, ...item }) => item);

  return (
    <Menu
      style={{ flex: 1 }}
      theme="light"
      mode="inline"
      selectedKeys={[location.pathname]}
      items={filteredItems}
      direction={isRTL ? "rtl" : "ltr"}
    />
  );
};

export default Sidebar;
