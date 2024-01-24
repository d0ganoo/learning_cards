import React from "react";

import styles from "./MainNavigation.module.css";
import { useWindowSize } from '../../../hooks/useWindowSize';

type MainNavigationProps = {
  handleDrawer: () => void;
  customerType: string;
};

const MainNavigation: React.FC<MainNavigationProps> = ({
  handleDrawer,
}) => {
  const windowSize = useWindowSize();

  const toggleCollapsed = () => {
    windowSize.width && windowSize.width < 1281 && handleDrawer();
  };


  return (
    <nav role="navigation" className={styles.root}>
    </nav>
  );
};

export default MainNavigation;