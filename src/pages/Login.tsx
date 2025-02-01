import React from "react";
import { useNavigate } from "react-router-dom";
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
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utils/firebaseConfig";

const Login: React.FC = () => {
  const navigate = useNavigate();

  // Validation schema
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required("Invalid email.")
      .email("Invalid email."),
    password: Yup.string()
      .required("Invalid password."),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      const { email, password } = data;
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (error: any) {
      setError("email", { type: "manual", message: "Incorrect email or password." });
      setError("password", { type: "manual", message: "Incorrect email or password." });
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
              <IonCardTitle>Login</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <IonInput type="email" placeholder="Email" {...field} />
                )}
              />
              {errors.email && <IonText color="danger">{errors.email.message}</IonText>}

              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <IonInput type="password" placeholder="Password" {...field} />
                )}
              />
              {errors.password && <IonText color="danger">{errors.password.message}</IonText>}

              <IonButton expand="full" onClick={handleSubmit(onSubmit)}>
                Login
              </IonButton>
              <IonText>
                <p style={{ marginTop: "10px" }}>
                  Don't have an account? <span style={{ color: "blue", cursor: "pointer" }} onClick={() => navigate("/register")}>
                    Create an account.
                  </span>
                </p>
              </IonText>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
