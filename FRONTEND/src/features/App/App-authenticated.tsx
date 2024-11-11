import { Alert, Layout } from "antd";
import React from "react";
import { Login } from "../Sign/Login";
import { Route, Routes } from "react-router-dom";
import { HomePage } from "../HomePage/HomePage";
import { MainLayout } from "./MainLayout/MainLayout";
import { CardManager } from "../CardManager/CardManager";
import { Quizz } from "../Quizz/Quizz";
import { Explorer } from "../Explorer/Explorer";

type RouteType = {
  path: string;
  component: React.ReactNode;
  when: boolean;
  exact: boolean;
  isAllowed: boolean;
};

type Routes = Array<RouteType>;

const AppAuthenticated: React.FC = () => {

  const notAllowedContent = (
    <Layout className="ant-layout-content">
      <Alert
        message="Erreur"
        description="Vous ne disposez pas des droits nécessaires pour afficher ce contenu"
        type="error"
        showIcon
      />
    </Layout>
  );

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/carte-management" element={<CardManager />} />
        <Route path="/bibliotheque" element={<Explorer />} />
        <Route path="/entrainement" element={<Quizz />} />
        <Route path="/examens" element={<></>} />
        <Route path="/connexion" element={<Login />} />
      </Routes>
    </MainLayout>
  );
};
export default AppAuthenticated;