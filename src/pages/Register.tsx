import React from "react";
import { useHistory } from "react-router-dom";
import {
    IonPage,
    IonContent,
    IonInput,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonText,
} from "@ionic/react";
import { useForm, Controller } from "react-hook-form";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../utils/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

const Register: React.FC = () => {
    const history = useHistory();

    const {
        control,
        handleSubmit,
        formState: { errors },
        setError,
        watch,
        register,  // Register is needed for input tracking
    } = useForm();

    const password = watch("password", "");
    const confirmPassword = watch("confirmPassword", "");
    const email = watch("email", "");

    const onSubmit = async (data: any) => {
        console.log("~~~SUBMITTING!~~~");
        console.log("Data:", data);
        try {
            if (!email.includes("@") || email.length < 5) {
                setError("email", { type: "manual", message: "Invalid email address." });
                return;
            }

            if (password.length < 6) {
                setError("password", { type: "manual", message: "Password must be at least 6 characters." });
                return;
            }

            if (password !== confirmPassword) {
                setError("confirmPassword", { type: "manual", message: "Passwords must match." });
                return;
            }

            console.log("Creating user with email:", email);
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log("User created:", userCredential);

            const user = userCredential.user;
            await setDoc(doc(db, "users", user.uid), {
                email,
                createdAt: new Date(),
            });
            document.body.focus();

            setTimeout(() => {
                history.push("/CreateAccountOptions");
            }, 100); // 100ms delay
            
        } catch (error: any) {
            console.error("Firebase error:", error);
            if (error.code === "auth/email-already-in-use") {
                setError("email", { type: "manual", message: "Email is already in use." });
            } else if (error.code === "auth/invalid-email") {
                setError("email", { type: "manual", message: "Invalid email address." });
            } else if (error.code === "auth/weak-password") {
                setError("password", { type: "manual", message: "Password is too weak." });
            } else {
                setError("email", { type: "manual", message: "An unexpected error occurred." });
            }
        }
    };

    return (
        <IonPage style={{ backgroundColor: "#ffffff", height: "100vh" }}>
            <IonContent
                className="ion-padding"
                fullscreen
                style={{
                    "--background": "#ffffff",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                    <IonCard style={{ width: "90%", maxWidth: "400px", textAlign: "center" }}>
                        <IonCardHeader>
                            <IonCardTitle>Register</IonCardTitle>
                        </IonCardHeader>
                        <IonCardContent>
                            <form onSubmit={async (e) => {
                                e.preventDefault();
                                await handleSubmit(onSubmit)();
                            }}>
                                <IonInput {...register("email")} type="email" placeholder="Email" />
                                {errors.email && <IonText color="danger">{errors.email.message?.toString()}</IonText>}

                                <IonInput {...register("password")} type="password" placeholder="Password" />
                                {errors.password && <IonText color="danger">{errors.password.message?.toString()}</IonText>}

                                <IonInput {...register("confirmPassword")} type="password" placeholder="Confirm Password" />
                                {errors.confirmPassword && <IonText color="danger">{errors.confirmPassword.message?.toString()}</IonText>}

                                <IonButton expand="full" type="submit">
                                    Register
                                </IonButton>
                            </form>

                            <IonText>
                                <p style={{ marginTop: "10px" }}>
                                    By registering, you agree to our <span style={{ color: "blue", cursor: "pointer" }} onClick={() => history.push("/terms")}>Terms of Service</span>.
                                </p>
                                <p style={{ marginTop: "10px" }}>
                                    Already have an account? <span style={{ color: "blue", cursor: "pointer" }} onClick={() => history.push("/login")}>Login here.</span>
                                </p>
                            </IonText>
                        </IonCardContent>
                    </IonCard>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Register;