import { MailOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Typography, message } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { requestPasswordReset } from "../../actions/auth.actions";
import authBg from "../../assets/images/auth-bg.jpg";
import logo from "../../assets/images/logo-v.png";

const { Title, Text } = Typography;

export default function ForgotPassword() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);

      await requestPasswordReset(values);

      message.success(t("reset_link_sent"));

      form.resetFields();
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
          {t("forgot_password")}
        </Title>

        <Text
          type="secondary"
          style={{ display: "block", textAlign: "center", marginBottom: 24 }}
        >
          {t("enter_email_reset")}
        </Text>

        <Form form={form} layout="vertical" onFinish={onFinish}>
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

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={loading}
          >
            {t("send_reset_link")}
          </Button>

          <div style={{ textAlign: "center", marginTop: 16 }}>
            <Link to="/login">{t("back_to_login")}</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
}
