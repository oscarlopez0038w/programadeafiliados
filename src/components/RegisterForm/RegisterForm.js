"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import styles from "./RegisterForm.module.css";
export default function RegisterForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [employeeCode, setEmployeeCode] = useState("");
  const [storeId, setStoreId] = useState("");
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadStores = async () => {
      const { data, error } = await supabase
        .from("app_stores")
        .select("store_id, store_name")
        .eq("is_active", true);

      if (!error && data) {
        setStores(data);
      }
    };

    loadStores();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1️⃣ Validar employee_code y tienda asignada
      const { data: employee, error: empError } = await supabase
        .from("sales_people")
        .select("employee_code, store_id")
        .eq("employee_code", employeeCode)
        .single();

      if (empError || !employee) {
        alert("El código de empleado no existe.");
        setLoading(false);
        return;
      }

      // ✅ Validar tienda correcta
      if (!storeId) {
        alert("Debes seleccionar una tienda.");
        setLoading(false);
        return;
      }

      // Normalizar tipos
      const employeeStoreId = Number(employee.store_id);
      const selectedStoreId = Number(storeId);

      if (employeeStoreId !== selectedStoreId) {
        alert(
          "La tienda seleccionada no coincide con la tienda asignada al empleado.",
        );
        setLoading(false);
        return;
      }

      // 2️⃣ Crear usuario en Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        },
      });

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }

      if (!data.user) {
        alert("No se pudo crear el usuario.");
        setLoading(false);
        return;
      }

      // 3️⃣ Insertar en app_users
      const { error: insertError } = await supabase.from("app_users").insert({
        user_id: data.user.id,
        nombres,
        apellidos,
        email,
        employee_code: employeeCode,
        role_id: 3, // vendedor
        store_id: storeId,
        activo: true,
      });

      if (insertError) {
        alert(insertError.message);
        setLoading(false);
        return;
      }

      alert("Revisa tu correo para confirmar tu cuenta.");
      router.push("/login");
    } catch (err) {
      console.error(err);
      alert("Error inesperado.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleRegister} className={styles.form}>
      <h1 className={styles.title}>Crear cuenta</h1>

      <div className={styles.group}>
        <label>Información personal</label>

        <input
          className={styles.input}
          placeholder="Nombres"
          value={nombres}
          onChange={(e) => setNombres(e.target.value)}
          required
        />

        <input
          className={styles.input}
          placeholder="Apellidos"
          value={apellidos}
          onChange={(e) => setApellidos(e.target.value)}
          required
        />
      </div>

      <div className={styles.group}>
        <label>Información laboral</label>

        <input
          className={styles.input}
          placeholder="Código de empleado"
          value={employeeCode}
          onChange={(e) => setEmployeeCode(e.target.value)}
          required
        />

        <select
          className={styles.select}
          value={storeId}
          onChange={(e) => setStoreId(e.target.value)}
          required
        >
          <option value="">Selecciona tienda</option>
          {stores.map((store) => (
            <option key={store.store_id} value={store.store_id}>
              {store.store_name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.group}>
        <label>Credenciales</label>

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
      </div>

      <button className={styles.button} disabled={loading}>
        {loading ? "Registrando..." : "Crear cuenta"}
      </button>
    </form>
  );
}
