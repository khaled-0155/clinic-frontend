import { LockOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Typography, message } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../../actions/auth.actions";
import authBg from "../../assets/images/auth-bg.jpg";
import logo from "../../assets/images/logo-v.png";

const { Title, Text } = Typography;

export default function ResetPassword() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const { token } = useParams();
  const onFinish = async (values) => {
    try {
      setLoading(true);

      await resetPassword({
        token,
        password: values.password,
      });

      message.success(t("password_reset_success"));

      navigate("/login");
    } catch (error) {
      message.error(error?.response?.data?.message || t("error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page" style={{ backgroundImage: `url(${authBg})` }}>
      <div className="overlay" />

      <Card className="login-card">
        <div className="logo-wrapper">
          <img src={logo} alt="Clinic Logo" className="logo" />
        </div>

        <Title level={3} style={{ textAlign: "center", marginBottom: 0 }}>
          {t("reset_password")}
        </Title>

        <Text
          type="secondary"
          style={{ display: "block", textAlign: "center", marginBottom: 24 }}
        >
          {t("enter_new_password")}
        </Text>

        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label={t("new_password")}
            name="password"
            rules={[
              { required: true, message: t("password_required") },
              { min: 6, message: t("password_min") },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} size="large" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={loading}
          >
            {t("reset_password")}
          </Button>

          <div style={{ textAlign: "center", marginTop: 16 }}>
            <Link to="/login">{t("back_to_login")}</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
}
