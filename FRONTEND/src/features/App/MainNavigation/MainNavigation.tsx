import React, { useState } from "react";

import styles from "./MainNavigation.module.css";
import { BlockOutlined, FundViewOutlined, ShopOutlined, SolutionOutlined } from "@ant-design/icons";
import { Layout, Menu, MenuProps } from "antd";
import { Link } from "react-router-dom";
const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem;
}

const items: MenuItem[] = [
    getItem(<Link to="/carte-management">Carte management</Link>, '1', <BlockOutlined />),
    getItem(<Link to="/bibliotheque">Bibliotèque</Link>, '2', <ShopOutlined />),
    getItem(<Link to="/entrainement">Entrainement</Link>, '3', <FundViewOutlined />),
    getItem(<Link to="/examens">Examens</Link>, '4', <SolutionOutlined />),
];

const MainNavigation: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  
  return (
    <Sider className={styles.nav} collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
      <div className="demo-logo-vertical" />
      <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
    </Sider>
  );
};

export default MainNavigation;