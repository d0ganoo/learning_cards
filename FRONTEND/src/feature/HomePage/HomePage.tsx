import React, { useEffect } from "react";

import { Typography } from "antd";

import styles from "./HomePage.module.css";

import { useDocumentTitle } from "../../hooks/useDocumentTitle";

const { Title } = Typography;

export const HomePage = () => {
  useDocumentTitle("Your prod  - HomePage");

  useEffect(() => {

  });

  return (
    <div className={styles.root}>
        <Title type="secondary" level={1}>
        Bienvenue sur Learning cards !
        </Title>
        <p>Créer votre premier learning deck</p>
    </div>
  );
};
