"use client";

import { useMemo, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import styles from "./DashboardVendedores.module.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export default function DashboardVendedoresChart({ ordenes = [] }) {
  const [ordenarPor, setOrdenarPor] = useState("monto");
  const [showModal, setShowModal] = useState(false);

  const vendedores = useMemo(() => {
    const map = {};

    ordenes.forEach((o) => {
      const nombre = o.sales_people?.full_name || "Sin agente";
      const storeId = o.sales_people?.store_id;
      const tienda = storeId || "Sin tienda";
      const monto = Number(o.value || 0);

      const nombreConTienda = `${nombre} (${tienda})`;

      if (!map[nombreConTienda])
        map[nombreConTienda] = { cantidad: 0, total: 0 };

      map[nombreConTienda].cantidad += 1;
      map[nombreConTienda].total += monto;
    });

    const resultado = Object.entries(map).map(([nombre, data]) => ({
      nombre,
      ...data,
    }));

    resultado.sort((a, b) =>
      ordenarPor === "monto" ? b.total - a.total : b.cantidad - a.cantidad,
    );

    return resultado;
  }, [ordenes, ordenarPor]);

  const MAX_VISIBLE = 10;
  const BAR_WIDTH = 90;

  const vendedoresVisibles = vendedores.slice(0, MAX_VISIBLE);
  const chartWidth = MAX_VISIBLE * BAR_WIDTH;

  const buildData = (list) => ({
    labels: list.map((v) => v.nombre),
    datasets: [
      {
        label:
          ordenarPor === "monto" ? "Monto total (NIO)" : "Cantidad de órdenes",
        data: list.map((v) => (ordenarPor === "monto" ? v.total : v.cantidad)),
        backgroundColor: "rgba(37, 99, 235, 0.8)",
      },
    ],
  });

  const options = {
    responsive: false,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Órdenes por Afiliado",
        font: { size: 18, weight: "bold" },
      },
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          autoSkip: false,
        },
      },
      y: { beginAtZero: true },
    },
  };

  return (
    <>
      <div className={styles.container}>
       
        <div className={styles.buttons}>
          <button
            className={`${styles.button} ${
              ordenarPor === "monto" ? styles.buttonActive : ""
            }`}
            onClick={() => setOrdenarPor("monto")}
          >
            Ordenar por Monto
          </button>

          <button
            className={`${styles.button} ${
              ordenarPor === "cantidad" ? styles.buttonActive : ""
            }`}
            onClick={() => setOrdenarPor("cantidad")}
          >
            Ordenar por Cantidad
          </button>

          {vendedores.length > MAX_VISIBLE && (
            <button
              className={styles.verTodos}
              onClick={() => setShowModal(true)}
            >
              Ver todos ({vendedores.length})
            </button>
          )}
        </div>

      
        <div className={styles.chartWrapper}>
          <div
            className={styles.chartInner}
            style={{ width: `${chartWidth}px` }}
          >
            <Bar
              data={buildData(vendedoresVisibles)}
              options={options}
              width={chartWidth}
              height={400}
            />
          </div>
        </div>
      </div>

     
      {showModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowModal(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Todos los Afiliados</h3>

              <button
                className={styles.closeBtn}
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <div className={styles.modalChart}>
              <Bar
                data={buildData(vendedores)}
                options={{ ...options, responsive: true }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
