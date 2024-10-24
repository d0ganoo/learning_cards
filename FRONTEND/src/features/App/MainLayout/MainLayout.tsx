import React, { ReactNode } from "react";
import { Button, Layout, Row, Space, Tooltip, Typography } from "antd";

import { PoweroffOutlined} from "@ant-design/icons";

import styles from "./MainLayout.module.css";
import { useClient } from "../../../contexts/Client/Client";
import { Footer } from "antd/es/layout/layout";
import { useUser } from "../../../contexts/User/User";
import MainNavigation from "../MainNavigation/MainNavigation";

const { Content, Header } = Layout;
const { Text } = Typography;



export const MainLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { setStatus, refreshTokenStore } = useClient();
    const { user } = useUser();

    const logout = () => {
        setStatus("anonymous");
        refreshTokenStore.clear();
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <MainNavigation/>
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