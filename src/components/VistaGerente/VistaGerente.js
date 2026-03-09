import DashboardResumen from "../DashboardResumen/DashboardResumen";
import DashboardVendedoresChart from "../DashboardVendedores/DashboardVendedores";
import styles from "./VistaGerente.module.css";
export default function VistaGerente({ ordenes }) {
  return (
    <div className={styles.container}>
      <DashboardResumen ordenes={ordenes} />
      <DashboardVendedoresChart ordenes={ordenes} />
    </div>
  );
}
