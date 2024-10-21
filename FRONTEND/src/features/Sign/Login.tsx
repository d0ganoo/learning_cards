import React from "react";
import { Link, useLocation } from "react-router-dom";

import { Typography, Space, FormProps, Form, Input, Checkbox, Button } from "antd";

import styles from "./Login.module.css";

import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { FieldType } from "./types";
import { useClient } from "../../contexts/Client/Client";

const { Title } = Typography;



export const Login = () => {
  const { login } = useClient();
  const location = useLocation();
  useDocumentTitle("Your prod  - Connexion");

  const tokenQueryParam = location?.search.match(/token=([a-zA-Z0-9]*)/);

  tokenQueryParam &&
    localStorage.setItem("invitationToken", tokenQueryParam[1]);

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    values.email && values.password &&
      login(
        `login`,
        {
          username: values.email,
          password: values.password
        },
        (res) => { console.log(res) },
        () => console.log("error")
      );
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className={styles.root}>
      <section className={styles.form}>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <Title
                type="secondary"
                level={2}
                style={{ textAlign: "center" }} >
                Connectez-vous
              </Title>
            </Space>
          </div>
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 440 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item<FieldType>
              label="Identifiant"
              name="email"
              rules={[{ required: true, message: 'Veuillez taper un indentifiant' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
              label="Mot de passe"
              name="password"
              rules={[{ required: true, message: 'Veuillez taper votre mot de passe' }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Enregistrer
              </Button>
            </Form.Item>
          </Form>
        </Space>
      </section>
    </div>
  );
};
