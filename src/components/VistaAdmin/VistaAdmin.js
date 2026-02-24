import DashboardResumen from "../DashboardResumen/DashboardResumen";
import DashboardVendedoresChart from "../DashboardVendedores/DashboardVendedores";
import DashboardTiendaPie from "../DashboardTiendas/DashboardTiendas";
import styles from "./VistaAdmin.module.css";
export default function VistaAdmin({ ordenes }) {
  return (
    <div className={styles.container}>
      <DashboardResumen ordenes={ordenes} />
      <div className={styles.subContainer}>
        <DashboardVendedoresChart ordenes={ordenes} />
        <DashboardTiendaPie ordenes={ordenes} />
      </div>
    </div>
  );
}
