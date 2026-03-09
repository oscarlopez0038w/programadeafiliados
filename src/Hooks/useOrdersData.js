"use client";
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";

export default function useOrdersData() {
  const { roleName, storeId, employeeCode } = useUser();
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  // 🔹 calcular mes actual
  const calcularMesActual = () => {
    const now = new Date();
   const primerDia = new Date(now.getFullYear(), now.getMonth(), 1)
  .toLocaleDateString("sv-SE");
const hoy = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  .toLocaleDateString("sv-SE");
    return { primerDia, hoy };
  };

  // 🔹 fetch centralizado
  const fetchOrders = async (inicio, fin) => {
    if (!roleName) return;
    setLoading(true);

    const params = [];
    if (inicio) params.push(`inicio=${inicio}`);
    if (fin) params.push(`fin=${fin}`);
    if (roleName) params.push(`roleName=${roleName}`);
    if (storeId) params.push(`storeId=${storeId}`);
    if (employeeCode) params.push(`employeeCode=${employeeCode}`);

    try {
      const url = "/api/orders" + (params.length ? `?${params.join("&")}` : "");
      const res = await fetch(url);
      const data = await res.json();
      setOrdenes(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 primera carga → mes actual (solo una vez)
  useEffect(() => {
    const { primerDia, hoy } = calcularMesActual();
    setFechaInicio(primerDia);
    setFechaFin(hoy);
    fetchOrders(primerDia, hoy);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleName, storeId, employeeCode]); // ❌ no incluimos fetchOrders aquí para no sobrescribir

  // 🔹 aplicar filtros manualmente
  const aplicarFiltro = () => fetchOrders(fechaInicio, fechaFin);

  // 🔹 resetear a mes actual
  const resetMesActual = () => {
    const { primerDia, hoy } = calcularMesActual();
    setFechaInicio(primerDia);
    setFechaFin(hoy);
    fetchOrders(primerDia, hoy);
  };

  return {
    ordenes,
    loading,
    fechaInicio,
    fechaFin,
    setFechaInicio,
    setFechaFin,
    aplicarFiltro,
    resetMesActual,
  };
}
