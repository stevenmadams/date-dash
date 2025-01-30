import React from "react";
import { IonList, IonItem, IonLabel } from "@ionic/react";
import { Link } from "react-router-dom";

interface EventListProps {
  title: string;
  events: any[];
}

export const EventList: React.FC<EventListProps> = ({ title, events }) => {
  return (
    <>
      <h2>{title}</h2>
      <IonList>
        {events.length > 0 ? (
          events.map(event => (
            <IonItem key={event.id} button routerLink={`/event/${event.id}`}>
              <IonLabel>{event.eventName} - {event.eventDate}</IonLabel>
            </IonItem>
          ))
        ) : (
          <IonItem><IonLabel>No events found.</IonLabel></IonItem>
        )}
      </IonList>
    </>
  );
};