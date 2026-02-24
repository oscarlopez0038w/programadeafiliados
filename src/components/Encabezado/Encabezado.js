"use client";

import styles from "./Encabezado.module.css";
import Image from "next/image";

export default function Encabezado({
  fechaInicio,
  fechaFin,
  setFechaInicio,
  setFechaFin,
  onFiltrar,
  onReset,
}) {
  return (
    <div className={styles.container}>
      {/* ===== IZQUIERDA: LOGO + TITULOS ===== */}
      <div className={styles.headerInfo}>
        <div className={styles.logo}>
          <Image
            src="/ventas.png"
            alt="Ventas Social Selling"
            width={80}
            height={80}
            className={styles.imagen}
          />
        </div>

        <div>
          <h1 className={styles.titulo}>
            Dashboard Programa de Afiliados
          </h1>

          <p className={styles.subtitulo}>
            Social Selling · Análisis en tiempo real
          </p>
        </div>
      </div>

      {/* ===== DERECHA: FILTRO FECHAS ===== */}
      <div className={styles.filtro}>
        <div className={styles.field}>
          <label className={styles.label}>Desde</label>
          <input
            type="date"
            className={styles.input}
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Hasta</label>
          <input
            type="date"
            className={styles.input}
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
        </div>

        <div className={styles.actions}>
          <button
            className={styles.primaryButton}
            onClick={onFiltrar}
          >
            Aplicar
          </button>

          <button
            className={styles.secondaryButton}
            onClick={onReset}
          >
            Mes actual
          </button>
        </div>
      </div>
    </div>
  );
}
