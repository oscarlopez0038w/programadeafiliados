import styles from "./DashboardResumen.module.css";
import DashboardCard from "../DashboardCard/DashboardCard";

export default function DashboardResumen({ ordenes }) {
  return (
    <div className={styles.container}>
      <DashboardCard
        title="Ingreso Total"
        subtitle="Valor acumulado"
        ordenes={ordenes}
        type="ingresoDolares"
        url="/moneda.png"
      />
         <DashboardCard
        title="Ingreso Total"
        subtitle="Valor acumulado"
        ordenes={ordenes}
        type="ingreso"
        url="/moneda.png"
      />
      <DashboardCard
        title="Total Órdenes"
        subtitle="Ordenes registradas"
        ordenes={ordenes}
        type="total"
        url="/shopping-cart.png"
      />
      <DashboardCard
        title="Pagos Visa"
        ordenes={ordenes}
        type="visa"
        url="/credit.png"
      />
      <DashboardCard
        title="Pagos Mastercard"
        ordenes={ordenes}
        type="mastercard"
        url="/credit.png"
      />
      <DashboardCard
        title="Pagos American Express"
        ordenes={ordenes}
        type="American Express"
        url="/credit.png"
      />
    </div>
  );
}
