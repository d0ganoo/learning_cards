import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { ConfigProvider } from "antd";
import frFR from "antd/es/locale/fr_FR";
import App from "./feature/App/App";
import { ClientProvider } from "./contexts/Client/Client";
import { UserProvider } from "./contexts/User/User";
import 'antd/dist/antd.css';

ReactDOM.render(
  <ConfigProvider locale={frFR}>
    <ClientProvider>
      {/* <UserProvider> */}
        <Router>
          <App />
        </Router>
      {/* </UserProvider> */}
    </ClientProvider>
  </ConfigProvider>,
  document.querySelector("#root")
);
