import React, { useState } from "react";
import { useHostEvents } from "../components/useHostEvents";
import { EventList } from "../components/eventList";
import { IonInput, IonButton } from "@ionic/react";
import { db } from "../utils/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

export const HostDashboard: React.FC = () => {
  const { user, hostedEvents, pastEvents } = useHostEvents();
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");

  const createEvent = async () => {
    if (!eventName || !eventDate) {
      alert("Please enter event name and date.");
      return;
    }

    try {
      const eventRef = await addDoc(collection(db, "events"), {
        eventName,
        eventDate,
        hostId: user.id,
        participants: [],
      });

      alert(`Event created! Event ID: ${eventRef.id}`);
      setEventName("");
      setEventDate("");
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  return (
    <div>
      <h1>Host Dashboard</h1>
      {user && <p>Welcome, {user.email}!</p>}

      <h2>Create an Event</h2>
      <IonInput
        type="text"
        placeholder="Event Name"
        value={eventName}
        onIonChange={(e) => setEventName(e.detail.value!)}
      />
      <IonInput
        type="date"
        value={eventDate}
        onIonChange={(e) => setEventDate(e.detail.value!)}
      />
      <IonButton onClick={createEvent}>Create Event</IonButton>

      <EventList title="Upcoming Hosted Events" events={hostedEvents} />
      <EventList title="Past Hosted Events" events={pastEvents} />
    </div>
  );
};
