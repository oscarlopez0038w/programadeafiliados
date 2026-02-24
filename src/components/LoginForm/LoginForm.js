"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./LoginForm.module.css";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // 🔐 1️⃣ login en Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert(error.message);
        return;
      }

      const user = data?.user;

      if (!user) {
        alert("No se pudo obtener el usuario");
        return;
      }

      // 🧠 2️⃣ consultar perfil interno
      const { data: profile, error: profileError } = await supabase
        .from("app_users")
        .select("role_id, activo")
        .eq("user_id", user.id)
        .maybeSingle(); // 👈 más seguro que single()

      if (profileError || !profile) {
        await supabase.auth.signOut();
        alert("Perfil no encontrado.");
        return;
      }

      // 🚫 3️⃣ validar usuario activo
      if (profile.activo !== true) {
        await supabase.auth.signOut();

        alert("Tu cuenta está desactivada. Contacta al administrador.");
        return;
      }

      // ✅ 4️⃣ navegación SOLO si pasa validación
      if (profile.role_id === 1) {
        router.replace("/admin");
      } else {
        router.replace("/");
      }
    } catch (err) {
      console.error(err);
      alert("Error inesperado");
    }
  };

  return (
    <form onSubmit={handleLogin} className={styles.form}>
      <h1 className={styles.title}>Programa de Afiliados</h1>

      <input
        className={styles.input}
        type="email"
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        className={styles.input}
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button className={styles.button} type="submit">
        Entrar
      </button>

      <p className={styles.linkText}>
        ¿No tienes cuenta?
        <Link href="/registro" className={styles.link}>
          Regístrate aquí
        </Link>
      </p>

      <p>
        <Link href="/forgot-password" className={styles.linkSecondary}>
          ¿Olvidaste tu contraseña?
        </Link>
      </p>
    </form>
  );
}
