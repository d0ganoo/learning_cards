import { Alert, Layout } from "antd";
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import { Login } from "../Sign/Login";
import { MainLayout } from "./MainLayout/MainLayout";

import { ROUTES_PATH } from "../../pathRoutes";
import { HomePage } from "../HomePage/HomePage";

type RouteType = {
  path: string;
  component: React.ReactNode;
  when: boolean;
  exact: boolean;
  isAllowed: boolean;
};

type Routes = Array<RouteType>;

const AppAuthenticated: React.FC = () => {
  const routes = [
    {
      path: ROUTES_PATH.base,
      component: <HomePage />,
      when: true,
      exact: true,
      name: "homepage",
      isAllowed: true,
    },
    {
      path: ROUTES_PATH.login,
      component: <Login />,
      when: true,
      exact: true,
      name: "login",
      isAllowed: true,
    },
  ];

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

  const redirectToNextAllowedRoute = () => {
    return routes.find((route: RouteType) => route.isAllowed)?.component;
  };

  const renderRoutes = (routes: Routes) => {
    return routes.map((route: RouteType) => (
      <Route key={route.path} path={route.path} exact={route.exact}>
        {route.isAllowed
          ? route.component
          : route.path === "/"
          ? redirectToNextAllowedRoute()
          : notAllowedContent}
      </Route>
    ));
  };

  return (
    <MainLayout>
      <Switch>
        {renderRoutes(routes)}
        <Redirect to="/" />
      </Switch>
    </MainLayout>
  );
};
export default AppAuthenticated;
