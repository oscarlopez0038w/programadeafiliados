import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import NavBar from "../../components/NavBar/NavBar";
import LogoutButton from "../../components/LogoutButton/LogoutButton";
import styles from "../(dashboard)/DashboardLayout.module.css";
export default async function AdminLayout({ children }) {
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

  // 🔐 Validar sesión
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 🔎 Obtener perfil + rol
  const { data: profile, error } = await supabase
    .from("app_users")
    .select(
      `
      activo,
      nombres,
      apellidos,
      role_id
    `,
    )
    .eq("user_id", user.id)
    .single();
  if (!profile.activo) {
    redirect("/login");
  }
  if (error || !profile) {
    redirect("/");
  }

  // 🛑 Validar que sea admin
  if (profile.role_id !== 1) {
    redirect("/");
  }

  return (
    <div>
      <NavBar isAdmin={true} />
      <header className={styles.topbar}>
        <div className={styles.userInfo}>
          <span className={styles.welcome}>Bienvenido</span>
          <span className={styles.userName}>
            {profile.nombres} {profile.apellidos}
          </span>
          <span className={styles.role}>
            {profile.role_id === 1 ? "Admin" : "Usuario"}
          </span>
        </div>
        <LogoutButton />
      </header>
      {children}
    </div>
  );
}
