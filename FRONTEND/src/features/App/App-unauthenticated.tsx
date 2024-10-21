import React from "react";
import { useLocation, Route, Routes } from "react-router-dom";
import { Login } from "../Sign/Login";
import { Alert, Layout } from "antd";

const AppUnauthenticated: React.FC = () => {
    const location = useLocation();

    const conversationQueryParam = location?.search.match(
        /conversation_id=([a-zA-Z0-9-]*)/
    );
    conversationQueryParam &&
        localStorage.setItem("conversationId", conversationQueryParam[1]);

    const cleanUrl = (url: string) => {
        console.log(url)
        window.location.href = url.replace(/\/[^\/]*$/, '/');
    }

    let currentUrl = window.location.href;

    const notAllowedContent = (
        <Layout className="ant-layout-content">
            <Alert
                message="Erreur"
                description="Vous essayez d'accéder à du contenu qui n'ex"
                type="error"
                showIcon
            />
        </Layout>
    );

    return (
        <Routes>
            <Route path="/connexion" element={<Login />} />
            <Route path="/" element={<Login />} />
            <Route path="/*" element={<Login />} handle={
                currentUrl.charAt(currentUrl.length - 1) != '/' && cleanUrl(window.location.href)
            } />
        </Routes>
    );
};

export default AppUnauthenticated;

