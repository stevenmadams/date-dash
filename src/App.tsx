import React, { useEffect, useState } from "react";
import { IonApp, setupIonicReact } from "@ionic/react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        {isAuthenticated ? (
          <>
            <Route path="/participant" element={<ParticipantDashboard />} />
            <Route path="/host" element={<HostDashboard />} />
            <Route path="/event/:eventId" element={<EventDetails />} />
            <Route path="/createaccountoptions" element={<CreateAccountOptions />} />
            <Route path="/createhostaccount" element={<CreateHostAccount />} />
            <Route path="/createparticipantaccount" element={<CreateParticipantAccount />} />

            {/* Default Authenticated Redirect */}
            <Route path="*" element={<Navigate to="/participant" />} />
          </>
        ) : (
          <>
            {/* Default Unauthenticated Redirect */}
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;
