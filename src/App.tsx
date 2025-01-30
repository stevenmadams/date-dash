import React from "react";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route, Redirect } from "react-router-dom";

// Import pages
import { Login } from "./pages/Login";
import { ChooseRole } from "./pages/ChooseRole";
import { ParticipantDashboard } from "./pages/ParticipantDashboard";
import { HostDashboard } from "./pages/HostDashboard";
import { EventDetails } from "./pages/EventDetails";

setupIonicReact();

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          {/* ✅ Fix: Ensure Login Route Works */}
          <Route exact path="/login" component={Login} />

          {/* ✅ Fix: Correct Route Wrapping */}
          <Route exact path="/choose-role" component={ChooseRole} />
          <Route exact path="/participant" component={ParticipantDashboard} />
          <Route exact path="/host" component={HostDashboard} />
          <Route exact path="/event/:eventId" component={EventDetails} />

          {/* ✅ Fix: Single Redirect to Login */}
          <Redirect exact from="/" to="/login" />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
