import { useState, useEffect } from "react";
import { auth, db } from "../utils/firebaseConfig";
import { doc, getDoc, collection, query, where, getDocs, orderBy } from "firebase/firestore";

export const useHostEvents = () => {
  const [user, setUser] = useState<any>(null);
  const [hostedEvents, setHostedEvents] = useState<any[]>([]);
  const [pastEvents, setPastEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const metadata = await user.user.getMetadata();
        let userId = metadata.publicAddress || (metadata.email ? metadata.email.replace(/[@.]/g, "_") : null);
        if (!userId) throw new Error("User ID is invalid");

        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUser({ id: userId, ...userSnap.data() });

          const today = new Date().toISOString().split("T")[0];

          // Fetch upcoming hosted events
          const upcomingQuery = query(
            collection(db, "events"),
            where("hostId", "==", userId),
            where("eventDate", ">=", today),
            orderBy("eventDate", "asc")
          );
          const upcomingSnapshots = await getDocs(upcomingQuery);
          setHostedEvents(upcomingSnapshots.docs.map(doc => ({ id: doc.id, ...doc.data() })));

          // Fetch past hosted events
          const pastQuery = query(
            collection(db, "events"),
            where("hostId", "==", userId),
            where("eventDate", "<", today),
            orderBy("eventDate", "desc")
          );
          const pastSnapshots = await getDocs(pastQuery);
          setPastEvents(pastSnapshots.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return { user, hostedEvents, pastEvents };
};
