import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { auth, db } from "../utils/firebaseConfig";
import { doc, onSnapshot, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { IonButton, IonInput, IonItem, IonLabel, IonList } from "@ionic/react";

export const EventDetails: React.FC = () => {
    const { eventId } = useParams<{ eventId: string }>();
    const [event, setEvent] = useState<any>(null);
    const [participants, setParticipants] = useState<any[]>([]);
    const [editing, setEditing] = useState(false);
    const [newEventName, setNewEventName] = useState("");
    const [newEventDate, setNewEventDate] = useState("");
    const [user, setUser] = useState<any>(null);
    const history = useHistory();

    useEffect(() => {
        const fetchUser = async () => {
            if (!auth.currentUser) {
                throw new Error("User is not authenticated");
            }
            const email = auth.currentUser.email;
            let userId = email ? email.replace(/[@.]/g, "_") : null;
            if (!userId) throw new Error("User ID is invalid");

            const userRef = doc(db, "users", userId);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                setUser({ id: userId, ...userSnap.data() });
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        const eventRef = doc(db, "events", eventId);

        const unsubscribe = onSnapshot(eventRef, (eventSnap) => {
            if (!eventSnap.exists()) {
                alert("Event not found!");
                history.push("/");
                return;
            }

            const eventData = eventSnap.data();
            setEvent(eventData);

            Promise.all(
                eventData.participants.map(async (userId: string) => {
                    const userRef = doc(db, "users", userId);
                    const userSnap = await getDoc(userRef);
                    return userSnap.exists() ? { id: userId, ...userSnap.data() } : null;
                })
            ).then(setParticipants);
        });

        return () => unsubscribe();
    }, [eventId, history]);

    const saveChanges = async () => {
        if (!event) return;

        try {
            const eventRef = doc(db, "events", eventId);
            await updateDoc(eventRef, {
                eventName: newEventName || event.eventName,
                eventDate: newEventDate || event.eventDate,
            });

            setEditing(false);
            alert("Event updated!");
        } catch (error) {
            console.error("Error updating event:", error);
        }
    };

    const removeParticipant = async (userId: string) => {
        if (!event) return;

        try {
            const eventRef = doc(db, "events", eventId);
            const updatedParticipants = event.participants.filter((id: string) => id !== userId);
            await updateDoc(eventRef, { participants: updatedParticipants });
            setParticipants(participants.filter((p) => p.id !== userId));
            alert("Participant removed!");
        } catch (error) {
            console.error("Error removing participant:", error);
        }
    };

    const cancelEvent = async () => {
        if (!event) return;

        const confirmDelete = window.confirm("Are you sure you want to cancel this event? This cannot be undone.");
        if (!confirmDelete) return;

        try {
            const eventRef = doc(db, "events", eventId);
            await deleteDoc(eventRef);
            alert("Event has been canceled!");
            history.push("/host");
        } catch (error) {
            console.error("Error canceling event:", error);
        }
    };

    return (
        <div>
            {event ? (
                <>
                    <h1>{event.eventName}</h1>
                    <p><strong>Date:</strong> {event.eventDate}</p>

                    {user?.id === event.hostId && (
                        <>
                            {editing ? (
                                <>
                                    <IonItem>
                                        <IonLabel position="floating">Event Name</IonLabel>
                                        <IonInput type="text" value={newEventName} onIonChange={(e) => setNewEventName(e.detail.value!)} />
                                    </IonItem>

                                    <IonItem>
                                        <IonLabel position="floating">Event Date</IonLabel>
                                        <IonInput type="date" value={newEventDate} onIonChange={(e) => setNewEventDate(e.detail.value!)} />
                                    </IonItem>

                                    <IonButton onClick={saveChanges} color="primary">Save</IonButton>
                                    <IonButton onClick={() => setEditing(false)} color="medium">Cancel</IonButton>
                                </>
                            ) : (
                                <IonButton onClick={() => setEditing(true)}>Edit Event</IonButton>
                            )}
                            <IonButton onClick={cancelEvent} color="danger">Cancel Event</IonButton>
                        </>
                    )}

                    <h2>Participants</h2>
                    <IonList>
                        {participants.map((p) => (
                            <IonItem key={p.id}>
                                <IonLabel>{p.email}</IonLabel>
                                {user?.id === event.hostId && (
                                    <IonButton onClick={() => removeParticipant(p.id)} color="danger">Remove</IonButton>
                                )}
                            </IonItem>
                        ))}
                    </IonList>
                </>
            ) : (
                <p>Loading event details...</p>
            )}
        </div>
    );
};
