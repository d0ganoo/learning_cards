import React from "react";
import { Spin } from "antd";
import styles from "./FullPageSpinner.module.css";

export const FullPageSpinner: React.FC = () => {
  return (
    <div className={styles.root}>
      <Spin size="large" /> Chargement...
    </div>
  );
};
