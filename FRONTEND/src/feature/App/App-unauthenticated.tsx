import React from "react";
import { useLocation, Route, Redirect, Switch } from "react-router-dom";
import { Login } from "../Sign/Login";

const AppUnauthenticated: React.FC = () => {
  const location = useLocation();

  const conversationQueryParam = location?.search.match(
    /conversation_id=([a-zA-Z0-9-]*)/
  );
  conversationQueryParam &&
    localStorage.setItem("conversationId", conversationQueryParam[1]);

  return (
    <Switch>
      <Route path="/connexion">
        <Login />
      </Route>
      {/* <Route path="/inscription" exact>
        <RegisterEntity />
      </Route>
      <Route path="/inscription/membre" exact>
        <RegisterMember />
      </Route>
      <Route path="/reinitialiser-mot-de-passe">
        <ForgottenPasswordPage />
      </Route>
      <Route
        path="/mot-de-passe/:token"
        render={({ match }) => <ResetPasswordPage token={match.params.token} />}
      /> */}
      <Redirect to="/connexion" />
    </Switch>
  );
};

export default AppUnauthenticated;
