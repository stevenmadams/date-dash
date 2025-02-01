import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonButton, IonInput, IonItem, IonLabel, IonSelect, IonSelectOption, IonPage, IonContent, IonHeader, IonToolbar, IonTitle } from '@ionic/react';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const CreateParticipantAccount: React.FC = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [gender, setGender] = useState('');
    const [age, setAge] = useState('');
    const history = useHistory();

    const handleSubmit = async () => {
        if (firstName && lastName && gender && age) {
            try {
                const db = getFirestore();
                const userRef = doc(db, 'users', 'user-id'); // Adjust as needed
                await setDoc(userRef, {
                    firstName,
                    lastName,
                    gender,
                    age,
                    role: 'participant'
                });
                history.push('/CreateAccountOptions');
            } catch (error) {
                console.error('Error adding document: ', error);
            }
        } else {
            alert('Please fill in all fields');
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Create Participant Account</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonItem>
                    <IonLabel position="floating">First Name</IonLabel>
                    <IonInput value={firstName} onIonChange={e => setFirstName(e.detail.value!)} />
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Last Name</IonLabel>
                    <IonInput value={lastName} onIonChange={e => setLastName(e.detail.value!)} />
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Gender</IonLabel>
                    <IonSelect value={gender} onIonChange={e => setGender(e.detail.value!)}>
                        <IonSelectOption value="male">Male</IonSelectOption>
                        <IonSelectOption value="female">Female</IonSelectOption>
                    </IonSelect>
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Age</IonLabel>
                    <IonInput type="number" value={age} onIonChange={e => setAge(e.detail.value!)} />
                </IonItem>
                <IonButton expand="full" onClick={handleSubmit}>Submit</IonButton>
                <IonButton expand="full" color="light" onClick={() => history.push('/CreateAccountOptions')}>Back</IonButton>
            </IonContent>
        </IonPage>
    );
};

export default CreateParticipantAccount;