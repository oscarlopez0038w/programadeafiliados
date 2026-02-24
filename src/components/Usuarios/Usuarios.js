"use client";

import { useEffect, useState } from "react";
import ModalEditarUsuario from "../ModalEditarUsuario/ModalEditarUsuario";
import styles from "./Usuarios.module.css";
export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [itemsPorPagina, setItemsPorPagina] = useState(10);

  const usuariosFiltrados = usuarios.filter((u) =>
    u.employee_code?.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPaginas =
    itemsPorPagina === "todos"
      ? 1
      : Math.ceil(usuariosFiltrados.length / itemsPorPagina);

  const indiceInicio =
    itemsPorPagina === "todos" ? 0 : (paginaActual - 1) * itemsPorPagina;

  const usuariosPaginados =
    itemsPorPagina === "todos"
      ? usuariosFiltrados
      : usuariosFiltrados.slice(indiceInicio, indiceInicio + itemsPorPagina);
  // traer usuarios

  const obtenerUsuarios = async () => {
    try {
      const res = await fetch("/api/users");

      if (!res.ok) {
        throw new Error("Error al obtener usuarios");
      }

      const data = await res.json();
      setUsuarios(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);
  const abrirEditar = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setOpenModal(true);
  };
  // estados
  if (loading) return <p>Cargando usuarios...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <div className={styles.container}>
        <h2 className={styles.title}>Usuarios</h2>
        <div className={styles.toolbar}>
          <input
            type="text"
            placeholder="Buscar por código empleado..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPaginaActual(1);
            }}
            className={styles.search}
          />

          <select
            value={itemsPorPagina}
            onChange={(e) => {
              const value =
                e.target.value === "todos" ? "todos" : Number(e.target.value);

              setItemsPorPagina(value);
              setPaginaActual(1);
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value="todos">Todos</option>
          </select>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nombres</th>
              <th>Apellidos</th>
              <th>Email</th>
              <th>Codigo de Empleado</th>
              <th>Rol</th>
              <th>Tienda</th>
              <th>Activo</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {usuariosPaginados.map((usuario) => (
              <tr key={usuario.user_id}>
                <td>{usuario.nombres}</td>
                <td>{usuario.apellidos}</td>
                <td>{usuario.email}</td>
                <td>{usuario.employee_code}</td>
                <td>{usuario.app_roles?.name}</td>
                <td>{usuario.app_stores?.store_name}</td>
                <td>{usuario.activo ? "Sí" : "No"}</td>
                <td>
                  <button
                    className={styles.button}
                    onClick={() => abrirEditar(usuario)}
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {itemsPorPagina !== "todos" && (
          <div className={styles.paginacion}>
            <button
              disabled={paginaActual === 1}
              onClick={() => setPaginaActual((p) => p - 1)}
            >
              ← Anterior
            </button>

            <span>
              Página {paginaActual} de {totalPaginas}
            </span>

            <button
              disabled={paginaActual === totalPaginas}
              onClick={() => setPaginaActual((p) => p + 1)}
            >
              Siguiente →
            </button>
          </div>
        )}
      </div>
      {openModal && (
        <ModalEditarUsuario
          usuario={usuarioSeleccionado}
          onClose={() => setOpenModal(false)}
          onGuardado={obtenerUsuarios}
        />
      )}
    </>
  );
}
