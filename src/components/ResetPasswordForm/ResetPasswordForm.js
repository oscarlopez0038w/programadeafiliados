"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import styles from "./ResetPasswordForm.module.css";
export default function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Contraseña actualizada correctamente");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    }

    setLoading(false);
  };

  return (
   <form onSubmit={handleUpdate} className={styles.form}>
  <h1 className={styles.title}>Nueva contraseña</h1>

  <p className={styles.subtitle}>
    Ingresa una nueva contraseña para continuar.
  </p>

  <input
    className={styles.input}
    type="password"
    placeholder="Nueva contraseña"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
  />

  <button className={styles.button} disabled={loading}>
    {loading ? "Actualizando..." : "Actualizar contraseña"}
  </button>

  {message && (
    <p className={styles.message}>
      {message}
    </p>
  )}
</form>

  );
}
