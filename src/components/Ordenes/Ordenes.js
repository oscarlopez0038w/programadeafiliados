"use client";

import { useState, useMemo } from "react";
import styles from "./Ordenes.module.css";

export default function Ordenes({ ordenes = [] }) {
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);

  const ORDENES_POR_PAGINA = 10;

  // 🔎 FILTRO DE BUSQUEDA
  const ordenesFiltradas = useMemo(() => {
    return ordenes.filter((orden) =>
      orden.order_id?.toString().toLowerCase().includes(busqueda.toLowerCase()),
    );
  }, [ordenes, busqueda]);

  // 📄 PAGINACIÓN
  const totalPaginas = Math.ceil(ordenesFiltradas.length / ORDENES_POR_PAGINA);

  const ordenesPaginadas = useMemo(() => {
    const inicio = (paginaActual - 1) * ORDENES_POR_PAGINA;
    return ordenesFiltradas.slice(inicio, inicio + ORDENES_POR_PAGINA);
  }, [ordenesFiltradas, paginaActual]);

  // Reset página cuando se busca
  const handleBusqueda = (e) => {
    setBusqueda(e.target.value);
    setPaginaActual(1);
  };

  if (!ordenes.length) {
    return (
      <div className={styles.empty}>
        <p>No hay órdenes para mostrar</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Órdenes</h2>

      {/* 🔎 BUSCADOR */}
      <input
        type="text"
        placeholder="Buscar orden por ID..."
        value={busqueda}
        onChange={handleBusqueda}
        className={styles.search}
      />

      <div className={styles.table}>
        <div className={styles.header}>
          <span>ID</span>
          <span>Vendedor</span>
          <span>Monto</span>
          <span>Fecha</span>
          <span>Estado</span>
        </div>

        {ordenesPaginadas.map((orden) => {
          const fechaUTC = new Date(orden.created_at + "Z");

          const fechaNI = fechaUTC.toLocaleString("es-NI", {
            timeZone: "America/Managua",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div key={orden.order_id} className={styles.row}>
              <span>{orden.order_id}</span>

              <span>{orden.sales_people.full_name}</span>

              <span>
                {new Intl.NumberFormat("es-NI", {
                  style: "currency",
                  currency: "NIO",
                }).format(Number(orden.value))}
              </span>

              <span>{fechaNI}</span>

              <span className={styles.status}>{orden.status}</span>
            </div>
          );
        })}
      </div>

      {/* 📄 CONTROLES PAGINACION */}
      <div className={styles.pagination}>
        {/* ⏮ IR A PRIMERA */}
        <button
          onClick={() => setPaginaActual(1)}
          disabled={paginaActual === 1}
        >
          ⏮
        </button>

        {/* ← ANTERIOR */}
        <button
          onClick={() => setPaginaActual((p) => Math.max(p - 1, 1))}
          disabled={paginaActual === 1}
        >
          ←
        </button>

        <span>
          Página {paginaActual} de {totalPaginas || 1}
        </span>

        {/* SIGUIENTE → */}
        <button
          onClick={() => setPaginaActual((p) => Math.min(p + 1, totalPaginas))}
          disabled={paginaActual === totalPaginas}
        >
          →
        </button>

        {/* ⏭ IR A ÚLTIMA */}
        <button
          onClick={() => setPaginaActual(totalPaginas)}
          disabled={paginaActual === totalPaginas}
        >
          ⏭
        </button>
      </div>
    </div>
  );
}
