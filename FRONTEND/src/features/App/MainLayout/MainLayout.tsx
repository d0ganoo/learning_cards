import React, { ReactNode, useState } from "react";
import { Button, Layout, Menu, MenuProps, Row, Space, Tooltip, Typography } from "antd";

import { DesktopOutlined, FileOutlined, PieChartOutlined, PoweroffOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";

import styles from "./MainLayout.module.css";
import { useClient } from "../../../contexts/Client/Client";
import { Footer } from "antd/es/layout/layout";
import { useUser } from "../../../contexts/User/User";

const { Content, Header, Sider } = Layout;
const { Text } = Typography;

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
    getItem('Option 1', '1', <PieChartOutlined />),
    getItem('Option 2', '2', <DesktopOutlined />),
    getItem('User', 'sub1', <UserOutlined />, [
        getItem('Tom', '3'),
        getItem('Bill', '4'),
        getItem('Alex', '5'),
    ]),
    getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
    getItem('Files', '9', <FileOutlined />),
];

export const MainLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { setStatus, refreshTokenStore } = useClient();
    const { user } = useUser();

    const [collapsed, setCollapsed] = useState(false);

    const logout = () => {
        setStatus("anonymous");
        refreshTokenStore.clear();
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div className="demo-logo-vertical" />
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
            </Sider>
            <Layout>
                <Header className={styles.header}>
                    <Row style={{ width: '100%' }} justify="end">
                        <Space className={styles.leftBloc}>
                            <Text style={{ color: '#fff' }}>Bonjour {user?.name}</Text>
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
                <Content style={{ margin: '0 16px' }}>
                    <div className={styles.wrapper}>{children}</div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    Learning cards ©{new Date().getFullYear()} Créé par FF
                </Footer>
            </Layout>
        </Layout>
    )
};