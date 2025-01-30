import React from "react";
import { useHistory } from "react-router-dom";
import { db } from "../utils/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { magic } from "../utils/magic";

export const ChooseRole: React.FC = () => {
  const history = useHistory();

  const handleRoleSelection = async (role: "participant" | "host") => {
    try {
      const metadata = await magic.user.getMetadata();

      // Ensure we have a valid document ID
      let userId = metadata.publicAddress || metadata.email;
      if (!userId) throw new Error("User ID is invalid");

      // Replace problematic characters (Firestore doesn’t support '@' or '.')
      userId = userId.replace(/[@.]/g, "_");

      // Ensure userId is a non-empty string
      if (!userId.trim()) throw new Error("Generated user ID is empty");

      const userRef = doc(db, "users", userId);

      // Update user role in Firestore
      await updateDoc(userRef, { role });

      // Redirect to the correct dashboard
      history.push(role === "host" ? "/host" : "/participant");
    } catch (error) {
      console.error("Failed to update role", error);
    }
  };

  return (
    <div>
      <h1>Choose Your Role</h1>
      <p>Are you joining as a participant or hosting an event?</p>
      <button onClick={() => handleRoleSelection("participant")}>Join as Participant</button>
      <p>*Requires an event code*</p>
      <button onClick={() => handleRoleSelection("host")}>Host an Event</button>
    </div>
  );
};
