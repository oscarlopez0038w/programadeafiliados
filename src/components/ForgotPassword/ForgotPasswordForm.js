"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import styles from "./ForgotPasswordForm.module.css";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Revisa tu correo para cambiar tu contraseña.");
    }

    setLoading(false);
  };

  return (
   <form onSubmit={handleReset} className={styles.form}>
  <h1 className={styles.title}>Recuperar contraseña</h1>

  <p className={styles.subtitle}>
    Ingresa tu correo y te enviaremos un enlace para crear una nueva contraseña.
  </p>

  <input
    className={styles.input}
    type="email"
    placeholder="Correo electrónico"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
  />

  <button className={styles.button} disabled={loading}>
    {loading ? "Enviando..." : "Enviar enlace"}
  </button>

  {message && (
    <p className={styles.message}>
      {message}
    </p>
  )}
</form>

  );
}
