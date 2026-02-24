import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import NavBar from "../../components/NavBar/NavBar";
import LogoutButton from "../../components/LogoutButton/LogoutButton";
import UserProviderClient from "../../components/UserProviderClient/UserProviderClient";
import styles from "./DashboardLayout.module.css";

export default async function DashboardLayout({ children }) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        },
      },
    },
  );

  // 🔐 validar sesión
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // 🔎 perfil
  const { data: profile, error } = await supabase
    .from("app_users")
    .select(
      `
      nombres,
      apellidos,
      employee_code,
      store_id,
      activo,
      roles:role_id(name)
    `,
    )
    .eq("user_id", user.id)
    .single();

  if (error || !profile || !profile.activo) redirect("/login");

  const roleName = profile.roles?.name;

  return (
    <div className={styles.wrapper}>
      {roleName === "admin" && <NavBar isAdmin={true} />}

      <header className={styles.topbar}>
        <div className={styles.userInfo}>
          <span className={styles.welcome}>Bienvenido</span>
          <span className={styles.userName}>
            {profile.nombres} {profile.apellidos}
          </span>
          <span className={styles.role}>{roleName}</span>
        </div>
        <LogoutButton />
      </header>

      <UserProviderClient
        value={{
          roleName,
          storeId: profile.store_id,
          employeeCode: profile.employee_code,
        }}
      >
        <main className={styles.content}>{children}</main>
      </UserProviderClient>
    </div>
  );
}
