"use client";

import { useEffect, useState } from "react";
import styles from "./ModalEditarUsuario.module.css";

export default function ModalEditarUsuario({
  usuario,
  onClose,
  onGuardado,
}) {
  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    email: "",
    employee_code: "",
    role_id: "",
    store_id: "",
    activo: true,
  });

  const [loading, setLoading] = useState(false);

  // cargar usuario seleccionado
  useEffect(() => {
    if (usuario) {
      setForm({
        nombres: usuario.nombres || "",
        apellidos: usuario.apellidos || "",
        email: usuario.email || "",
        employee_code: usuario.employee_code || "",
        role_id: usuario.app_roles?.role_id || "",
        store_id: usuario.app_stores?.store_id || "",
        activo: usuario.activo,
      });
    }
  }, [usuario]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const guardar = async () => {
    try {
      setLoading(true);

      const res = await fetch(`/api/users/${usuario.user_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Error al actualizar");

      onGuardado();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error actualizando usuario");
    } finally {
      setLoading(false);
    }
  };

  if (!usuario) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>Editar Usuario</h3>

        <input  name="nombres" value={form.nombres} onChange={handleChange} />
        <input  name="apellidos" value={form.apellidos} onChange={handleChange} />
        <input  name="email" value={form.email} onChange={handleChange} />
        <input 
          name="employee_code"
          value={form.employee_code}
          onChange={handleChange}
        />
        <input name="role_id" value={form.role_id} onChange={handleChange} />
        <input name="store_id" value={form.store_id} onChange={handleChange} />
        <label>
          Activo
          <input
            type="checkbox"
            name="activo"
            checked={form.activo}
            onChange={handleChange}
          />
        </label>

        <div className={styles.actions}>
          <button onClick={onClose}>Cancelar</button>
          <button onClick={guardar}>
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}