"use client";

import { useMemo } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import styles from "./DashboardTiendas.module.css";

ChartJS.register(ArcElement, Tooltip, Legend);

// 🔹 tabla de tiendas manual (store_id → store_name)
const STORE_MAP = {
  "45": "Ventas Digitales",
  "15": "Radial",
  "10": "Norte",
  "24": "Mega Tienda",
  "23": "El Periodista",
  "22": "Estelí",
  "21": "Juigalpa",
  "31": "Masaya",
  "12": "Home Center",
  "28": "León",
  "29": "Jinotepe",
  "13": "Chinandega",
  "11": "Matagalpa",
  "30": "Rivas",
  // agrega todas tus tiendas aquí
};

export default function DashboardTiendaPie({ ordenes = [] }) {
  const data = useMemo(() => {
    const map = {};
    ordenes.forEach((o) => {
      // obtener el store_id
      const storeId = o.sales_people?.store_id;
      // buscar el nombre de la tienda
      const tienda = STORE_MAP[storeId] || "Sin tienda";
      map[tienda] = (map[tienda] || 0) + 1;
    });

    const tiendasOrdenadas = Object.entries(map)
      .map(([tienda, total]) => ({ tienda, total }))
      .sort((a, b) => b.total - a.total);

    const MAX_VISIBLE = 8;

    let visibles = tiendasOrdenadas.slice(0, MAX_VISIBLE);
    const restantes = tiendasOrdenadas.slice(MAX_VISIBLE);

    if (restantes.length > 0) {
      const otrasTotal = restantes.reduce((acc, t) => acc + t.total, 0);
      visibles.push({ tienda: "Otras", total: otrasTotal });
    }

    const labels = visibles.map((t) => t.tienda);
    const values = visibles.map((t) => t.total);

    const backgroundColors = [
      "#2563eb",
      "#1eff00",
      "#60a5fa",
      "#34d399",
      "#facc15",
      "#f87171",
      "#a855f7",
      "#ec4899",
      "#f97316",
    ];

    return {
      labels,
      datasets: [
        {
          label: "Órdenes por tienda",
          data: values,
          backgroundColor: backgroundColors,
          borderColor: "#fff",
          borderWidth: 1,
        },
      ],
    };
  }, [ordenes]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 14,
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Órdenes por Tienda</h2>

      <div className={styles.chartWrapper}>
        <Pie data={data} options={options} />
      </div>
    </div>
  );
}
