import React from "react";
import { useClient } from "../../contexts/Client/Client";
import AppAuthenticated from "./App-authenticated";
import AppUnauthenticated from "./App-unauthenticated";
import styles from "./App.module.css";
import { useUser } from "../../contexts/User/User";

const App = () => {
  const { status } = useClient();
  const { user } = useUser();

  return (
    <div className={styles.root}>
      <React.Suspense fallback={<></>}>
        {status === "authenticated" && user ? (
          <AppAuthenticated />
        ) : (
          <AppUnauthenticated />
        )}
      </React.Suspense>
    </div>
  );
};

export default App;