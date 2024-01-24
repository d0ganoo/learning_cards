import React from "react";

import styles from "./ShadowWrapper.module.css";

type ShadowWrapperTypes = {
  className?: string;
};

export const ShadowWrapper: React.FC<ShadowWrapperTypes> = ({
  className,
  children,
}) => <div className={`${styles.root} ${className}`}>{children}</div>;
