import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton, IonBackButton, IonButtons } from '@ionic/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const CreateHostAccount: React.FC = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [hostName, setHostName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const auth = getAuth();
        const db = getFirestore();

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await setDoc(doc(db, 'users', user.uid), {
                firstName,
                lastName,
                hostName,
                email,
                role: 'host'
            });

            navigate('/CreateAccountOptions');
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/CreateAccountOptions" />
                    </IonButtons>
                    <IonTitle>Create Host Account</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <form onSubmit={handleSubmit}>
                    <IonItem>
                        <IonLabel position="floating">First Name</IonLabel>
                        <IonInput type="text" value={firstName} onIonChange={e => setFirstName(e.detail.value!)} required />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Last Name</IonLabel>
                        <IonInput type="text" value={lastName} onIonChange={e => setLastName(e.detail.value!)} required />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Host Name</IonLabel>
                        <IonInput type="text" value={hostName} onIonChange={e => setHostName(e.detail.value!)} required />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Email</IonLabel>
                        <IonInput type="email" value={email} onIonChange={e => setEmail(e.detail.value!)} required />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Password</IonLabel>
                        <IonInput type="password" value={password} onIonChange={e => setPassword(e.detail.value!)} required />
                    </IonItem>
                    <IonButton expand="full" type="submit">Create Account</IonButton>
                </form>
            </IonContent>
        </IonPage>
    );
};

export default CreateHostAccount;