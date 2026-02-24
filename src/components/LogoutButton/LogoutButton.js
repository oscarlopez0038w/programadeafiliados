"use client";

import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import styles from "./LogoutButton.module.css";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();

    router.push("/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className={styles.logoutButton}
    >
      Cerrar sesión
    </button>
  );
}
