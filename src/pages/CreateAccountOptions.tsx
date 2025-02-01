import React from 'react';

import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';

const AccountCreation: React.FC = () => {
    const handleCreateParticipantAccount = () => {
        // Logic for creating participant account
        console.log('Create Participant Account');
    };

    const handleCreateHostAccount = () => {
        // Logic for creating host account
        console.log('Create Host Account');
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Account Creation</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonButton expand="block" onClick={() => window.location.href = '/CreateParticipantAccount'}>
                    Create Participant Account
                </IonButton>
                <IonButton expand="block" onClick={() => window.location.href = '/CreateHostAccount'}>
                    Create Host Account
                </IonButton>
            </IonContent>
        </IonPage>
    );
};

export default AccountCreation;