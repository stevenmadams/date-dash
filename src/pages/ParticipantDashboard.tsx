import React, { useState } from "react";
import { useParticipantEvents } from "../components/useParticipantEvents";
import { EventList } from "../components/eventList";
import { IonInput, IonButton } from "@ionic/react";
import { db } from "../utils/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export const ParticipantDashboard: React.FC = () => {
  const { user, joinedEvents, pastEvents } = useParticipantEvents();
  const [eventId, setEventId] = useState("");

  const joinEvent = async () => {
    if (!eventId) {
      alert("Please enter a valid event ID.");
      return;
    }

    try {
      const eventRef = doc(db, "events", eventId);
      const eventSnap = await getDoc(eventRef);

      if (!eventSnap.exists()) {
        alert("Event not found!");
        return;
      }

      const eventData = eventSnap.data();
      if (eventData.participants.includes(user.id)) {
        alert("You are already in this event.");
        return;
      }

      await updateDoc(eventRef, {
        participants: [...eventData.participants, user.id],
      });

      alert("You have successfully joined the event!");
      setEventId("");
    } catch (error) {
      console.error("Error joining event:", error);
    }
  };

  return (
    <div>
      <h1>Participant Dashboard</h1>
      {user && <p>Welcome, {user.email}!</p>}

      <h2>Join an Event</h2>
      <IonInput
        type="text"
        placeholder="Enter Event ID"
        value={eventId}
        onIonChange={(e) => setEventId(e.detail.value!)}
      />
      <IonButton onClick={joinEvent}>Join Event</IonButton>

      <EventList title="Upcoming Events" events={joinedEvents} />
      <EventList title="Past Events" events={pastEvents} />
    </div>
  );
};
