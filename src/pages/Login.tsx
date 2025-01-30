import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { magic } from "../utils/magic";
import { db } from "../utils/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const history = useHistory();

  const handleLogin = async () => {
    try {
      const didToken = await magic.auth.loginWithMagicLink({ email });

      if (didToken) {
        const metadata = await magic.user.getMetadata();

        // Ensure userId is always a valid string
        let userId = metadata.publicAddress || metadata.email;
        if (!userId) throw new Error("No valid user ID found"); // Prevent null values

        // Replace problematic characters if using email
        userId = userId.replace(/[@.]/g, "_");

        // Create Firestore reference
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
      
        if (!userSnap.exists()) {
          await setDoc(userRef, {
            email: metadata.email,
            role: null, // User selects role later
            createdAt: new Date(),
          });

          history.push("/choose-role");
        } else {
          const userRole = userSnap.data()?.role;
          history.push(userRole === "host" ? "/host" : "/participant");
        }
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };
  
  return (
    <div>
      <h1>Login</h1>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};
