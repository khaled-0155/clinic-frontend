import { LockOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Typography, message } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

import { acceptInvite } from "../../actions/auth.actions";
import authBg from "../../assets/images/auth-bg.jpg";
import logo from "../../assets/images/logo-v.png";

const { Title, Text } = Typography;

export default function AcceptInvite() {
  const { t } = useTranslation();
  const { token } = useParams();
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);

      await acceptInvite({
        token,
        password: values.password,
      });

      message.success(t("account_activated"));

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
          {t("activate_account")}
        </Title>

        <Text
          type="secondary"
          style={{ display: "block", textAlign: "center", marginBottom: 24 }}
        >
          {t("set_password_activate")}
        </Text>

        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label={t("password")}
            name="password"
            rules={[
              { required: true, message: t("password_required") },
              { min: 6, message: t("password_min") },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} size="large" />
          </Form.Item>

          <Form.Item
            label={t("confirm_password")}
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: t("confirm_password_required") },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(t("passwords_not_match")));
                },
              }),
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
            {t("activate_account")}
          </Button>
        </Form>
      </Card>
    </div>
  );
}
