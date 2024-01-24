import React from "react";
import { Link, useLocation } from "react-router-dom";

import { Typography, Space } from "antd";

import styles from "./Login.module.css";

import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { LoginForm } from "./Form/FormView";

const { Title } = Typography;

export const Login = () => {
  const location = useLocation();
  useDocumentTitle("Your prod  - Connexion");

  const tokenQueryParam = location?.search.match(/token=([a-zA-Z0-9]*)/);

  tokenQueryParam &&
    localStorage.setItem("invitationToken", tokenQueryParam[1]);

  return (
    <div className={styles.root}>
      <section className={styles.form}>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <Title type="secondary" level={2}>
                Connectez-vous
              </Title>
              <LoginForm />
            </Space>
          </div>
          <div className={styles.footer}>
            <Link id="forgetmdp" to="/reinitialiser-mot-de-passe">
              Mot de passe oublié ?
            </Link>
          </div>
        </Space>
      </section>
    </div>
  );
};
