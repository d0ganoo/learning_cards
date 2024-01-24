import React from "react";
import { useClient } from "../../contexts/Client/Client";
import { FullPageSpinner } from "../../ui/FullPageSpinner/FullPageSpinner";
import AppAuthenticated from "./App-authenticated";
import AppUnauthenticated from "./App-unauthenticated";
import styles from "./App.module.css";

const App = () => {
  const { status } = useClient();

  console.log("App status", status);

  return (
    <div className={styles.root}>
      <React.Suspense fallback={<FullPageSpinner />}>
        {status === "authenticated" ? (
          <AppAuthenticated />
        ) : (
          <AppUnauthenticated />
        )}
      </React.Suspense>
    </div>
  );
};

export default App;
