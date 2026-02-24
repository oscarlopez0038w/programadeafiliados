"use client";

import useOrdersData from "../../Hooks/useOrdersData";
import Encabezado from "../../components/Encabezado/Encabezado";
import DashboardSkus from "../../components/DashboardSkus/DashboardSkus";
import TiendaActual from "../../components/TiendaActual/TiendaActual";
import VistaGerente from "../../components/VistaGerente/VistaGerente";
import VistaAdmin from "../../components/VistaAdmin/VistaAdmin";
import { useUser } from "../../context/UserContext";
import styles from "../page.module.css";
import Ordenes from "../../components/Ordenes/Ordenes";

export default function DashboardPage() {
  const { roleName } = useUser();
  const isAdmin = roleName;
  const {
    ordenes,
    loading,
    fechaInicio,
    fechaFin,
    setFechaInicio,
    setFechaFin,
    aplicarFiltro,
    resetMesActual,
  } = useOrdersData(); //

  if (loading)
    return (
      <div className={styles.main}>
        <div className={styles.container}>
          <p>Cargando Ventas...</p>
        </div>
      </div>
    );

  return (
    <div className={styles.main}>
      <div className={styles.background}>
        <Encabezado
          fechaInicio={fechaInicio}
          fechaFin={fechaFin}
          setFechaInicio={setFechaInicio}
          setFechaFin={setFechaFin}
          onFiltrar={aplicarFiltro}
          onReset={resetMesActual}
        />
        <TiendaActual />
      </div>
      <div className={styles.container}>
        {isAdmin === "admin" && <VistaAdmin ordenes={ordenes} />}
        {(isAdmin === "gerente" || isAdmin === "vendedor") && (
          <VistaGerente ordenes={ordenes} />
        )}

        <Ordenes ordenes={ordenes} />
        <DashboardSkus ordenes={ordenes} />
        <p className={styles.footer}>
          © {new Date().getFullYear()} SINSA. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
