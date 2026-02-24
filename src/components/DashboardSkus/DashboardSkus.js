"use client";

import { useMemo, useState } from "react";
import styles from "./DashboardSkus.module.css";

export default function DashboardSkus({ ordenes = [] }) {
  const [ordenarPor, setOrdenarPor] = useState("monto");
  const [mostrarTodos, setMostrarTodos] = useState(false);

  const items = useMemo(() => {
    const map = {};

    ordenes.forEach((o) => {
      if (!o.order_items) return;

      o.order_items.forEach((item) => {
        const nombre = item.products?.product_name || "Sin nombre";
        const sku = item.products?.sku_id || "-";
        const cantidad = Number(item.quantity || 1);
        const monto = Number(item.total_price || 0);

        if (!map[sku]) {
          map[sku] = {
            nombre,
            sku,
            unidades: 0,
            ordenes: new Set(),
            total: 0,
          };
        }

        map[sku].unidades += cantidad;
        map[sku].ordenes.add(o.order_id);
        map[sku].total += monto;
      });
    });

    const resultado = Object.values(map).map((i) => ({
      ...i,
      ordenes: i.ordenes.size,
    }));

    resultado.sort((a, b) =>
      ordenarPor === "monto"
        ? b.total - a.total
        : b.unidades - a.unidades
    );

    return resultado;
  }, [ordenes, ordenarPor]);

  // 🔥 solo mostramos 10 o todos
  const itemsVisibles = mostrarTodos ? items : items.slice(0, 10);

  return (
    <div className={styles.container}>
      <h2>Top 10 SKUs más vendidos</h2>

      {/* botones ordenar */}
      <div className={styles.buttons}>
        <button
          className={`${styles.button} ${
            ordenarPor === "monto" ? styles.active : ""
          }`}
          onClick={() => setOrdenarPor("monto")}
        >
          Ordenar por monto
        </button>

        <button
          className={`${styles.button} ${
            ordenarPor === "unidades" ? styles.active : ""
          }`}
          onClick={() => setOrdenarPor("unidades")}
        >
          Ordenar por unidades
        </button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Producto</th>
              <th>SKU</th>
              <th>Unidades</th>
              <th>Órdenes</th>
              <th>Monto total</th>
            </tr>
          </thead>

          <tbody>
            {itemsVisibles.map((i, index) => (
              <tr key={i.sku}>
                <td>{index + 1}</td>
                <td>{i.nombre}</td>
                <td>{i.sku}</td>
                <td>{i.unidades}</td>
                <td>{i.ordenes}</td>
                <td>
                  {new Intl.NumberFormat("es-NI", {
                    style: "currency",
                    currency: "NIO",
                    maximumFractionDigits: 0,
                  }).format(i.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔥 botón ver todos */}
      {items.length > 10 && (
        <div className={styles.showMore}>
          <button
            className={styles.showButton}
            onClick={() => setMostrarTodos(!mostrarTodos)}
          >
            {mostrarTodos ? "Mostrar menos" : "Ver todos los SKUs"}
          </button>
        </div>
      )}
    </div>
  );
}
