import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Typography, message } from "antd";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import authBg from "../../assets/images/auth-bg.jpg";
import logo from "../../assets/images/logo-v.png";
import { AuthContext } from "../../context/AuthContext";

const { Title, Text } = Typography;

const Login = () => {
  const { t } = useTranslation();
  const { login } = useContext(AuthContext);

  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const onFinish = async (values) => {
    try {
      setSubmitting(true);

      await login(values);

      message.success(t("login_success"));
      // navigate("/"); // redirect to dashboard
    } catch (error) {
      message.error(error?.response?.data?.message || t("login_failed"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page" style={{ backgroundImage: `url(${authBg})` }}>
      <div className="overlay" />

      <Card className="login-card">
        {/* Logo */}
        <div className="logo-wrapper">
          <img src={logo} alt="Clinic Logo" className="logo" />
        </div>

        <Title level={3} style={{ textAlign: "center", marginBottom: 0 }}>
          {t("login")}
        </Title>

        <Text
          type="secondary"
          style={{ display: "block", textAlign: "center", marginBottom: 24 }}
        >
          Clinic Management System
        </Text>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label={t("email")}
            name="email"
            rules={[
              { required: true, message: t("email_required") },
              { type: "email", message: t("invalid_email") },
            ]}
          >
            <Input prefix={<MailOutlined />} size="large" />
          </Form.Item>

          <Form.Item
            label={t("password")}
            name="password"
            rules={[{ required: true, message: t("password_required") }]}
          >
            <Input.Password prefix={<LockOutlined />} size="large" />
          </Form.Item>

          <div style={{ textAlign: "right", marginBottom: 16 }}>
            <Button type="link" onClick={() => navigate("/forgot-password")}>
              {t("forgot_password")}
            </Button>
          </div>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={submitting}
          >
            {t("login")}
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
