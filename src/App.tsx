// App.tsx
import React, { useEffect, useState } from "react";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route, Redirect } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./utils/firebaseConfig";

// Import pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import { ParticipantDashboard } from "./pages/ParticipantDashboard";
import { HostDashboard } from "./pages/HostDashboard";
import { EventDetails } from "./pages/EventDetails";
import CreateAccountOptions from "./pages/CreateAccountOptions";
import CreateHostAccount from "./pages/CreateHostAccount";
import CreateParticipantAccount from "./pages/CreateParticipantAccount";

setupIonicReact();

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    // Optionally, render a loading indicator
    return <div>Loading...</div>;
  }

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          {isAuthenticated ? (
            <>
              <Route exact path="/participant" component={ParticipantDashboard} />
              <Route exact path="/host" component={HostDashboard} />
              <Route exact path="/event/:eventId" component={EventDetails} />
              <Route exact path="/createaccountoptions" component={CreateAccountOptions} />
              <Route exact path="/createhostaccount" component={CreateHostAccount} />
              <Route exact path="/createparticipantaccount" component={CreateParticipantAccount} />
              <Redirect exact from="/" to="/login" />
            </>
          ) : (
            <Redirect to="/login" />
          )}
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
