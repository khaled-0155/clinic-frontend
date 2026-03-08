import { LogoutOutlined } from "@ant-design/icons";
import { Button, Layout } from "antd";
import { useContext, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { RiMenu2Line } from "react-icons/ri";
import { Outlet } from "react-router-dom";
import logoH from "../assets/images/logo-h.png";
import logoIcon from "../assets/images/logo-icon.png";
import LangSwitch from "../components/layout/LangSwitch";
import Sidebar from "../components/layout/Sidebar";
import { AuthContext } from "../context/AuthContext";

const { Content, Sider, Header } = Layout;

const MainLayout = () => {
  const { logout } = useContext(AuthContext);
  const { t } = useTranslation();

  const [locked, setLocked] = useState(false);
  const [hovered, setHovered] = useState(false);

  const hoverTimer = useRef(null);

  const collapsed = !locked && !hovered;

  const handleToggle = () => {
    setLocked((prev) => !prev);
  };

  const handleMouseEnter = () => {
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => {
      setHovered(true);
    }, 150);
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => {
      setHovered(false);
    }, 200);
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider
        className="sidebar"
        collapsible
        collapsed={collapsed}
        trigger={null}
        theme="light"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="sidebar-inner">
          <div>
            <div className="logo-container">
              {collapsed ? (
                <img src={logoIcon} alt="Logo" className="sidebar-logo" />
              ) : (
                <img src={logoH} alt="Logo" className="sidebar-logo" />
              )}

              {!collapsed && (
                <Button
                  type="text"
                  onClick={handleToggle}
                  className="btn-collapse"
                >
                  <RiMenu2Line size={24} />
                </Button>
              )}
            </div>

            <Sidebar />
          </div>

          {/* Logout Button */}
          <div className="logout-btn-container">
            <Button block danger icon={<LogoutOutlined />} onClick={logout}>
              {!collapsed && t("logout")}
            </Button>
          </div>
        </div>
      </Sider>

      <Layout>
        <Header className="navbar">
          <div className="navbar-btns">
            <LangSwitch />
          </div>
        </Header>

        <Content
          style={{ backgroundColor: "#f2f6f5" }}
          className="content-container"
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
