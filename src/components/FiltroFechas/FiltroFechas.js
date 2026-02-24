"use client";

import styles from "./FiltroFechas.module.css";

export default function FiltroFechas({
  fechaInicio,
  fechaFin,
  setFechaInicio,
  setFechaFin,
  onFiltrar,
  onReset,
}) {
  return (
    <div className={styles.container}>
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
  );
}
