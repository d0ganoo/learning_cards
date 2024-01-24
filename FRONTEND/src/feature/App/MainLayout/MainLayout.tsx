import React, { useState } from "react";

import { Avatar, Button, Col, Layout, Row, Space, Tooltip, Typography } from "antd";

import { MenuOutlined, PoweroffOutlined } from "@ant-design/icons";

import MainNavigation from "../MainNavigation/MainNavigation";

import { COLLAPSED_NAV_WIDTH, EXPANDED_NAV_WIDTH } from "../constant";
import styles from "./MainLayout.module.css";
import { useClient } from "../../../contexts/Client/Client";
import { Link } from "react-router-dom";
import { ROUTES_PATH } from "../../../pathRoutes";

const { Content, Header, Sider } = Layout;
const { Text } = Typography;

export const MainLayout: React.FC = ({ children }) => {
  const { setStatus, refreshTokenStore } = useClient();

  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpened, setDrawerOpened] = useState(false);
  const handleCollapse = () => setCollapsed(!collapsed);
  const handleDrawer = () => {
    setDrawerOpened(!drawerOpened);
    setCollapsed(true);
  };

  const logout = () => {
    setStatus("anonymous");
    refreshTokenStore.clear();
  };

  return (
    <Layout className={styles.root}>
      <Sider
        className={styles.sider}
        collapsible
        collapsed={collapsed}
        onCollapse={handleCollapse}
        collapsedWidth={COLLAPSED_NAV_WIDTH}
        width={EXPANDED_NAV_WIDTH}
      >
        <MainNavigation
          handleDrawer={handleDrawer}
          customerType={"fromager"}
        />
      </Sider>
      <Header className={styles.header}>
          <Row style={{ width: '100%'}} justify="end">
            <Space>
              <Tooltip placement="bottom" title="Se déconnecter">
                <Button
                  shape="circle"
                  icon={<PoweroffOutlined />}
                  onClick={logout}
                />
              </Tooltip>
            </Space>
          </Row> 
      </Header>
      <Content className={!collapsed ? styles.content : styles.contentMobile}>
        <div className={styles.wrapper}>{children}</div>
      </Content>
    </Layout>
  );
};
