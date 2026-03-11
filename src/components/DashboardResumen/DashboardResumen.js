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
        title="Ticket Promedio"
        subtitle="Valor promedio por orden"
        ordenes={ordenes}
        type="ticketpromedio"
        url="/moneda.png"
      />
      <DashboardCard
        title="Ticket Promedio"
        subtitle="Valor promedio por orden"
        ordenes={ordenes}
        type="ticketpromedioCordobas"
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
        title="Tarjeta"
        ordenes={ordenes}
        type="visa"
        url="/Visa_Inc._logo_(2005–2014).png"
      />
      <DashboardCard
        title="Tarjeta"
        ordenes={ordenes}
        type="mastercard"
        url="/Mastercard-logo.png"
      />
      <DashboardCard
        title="Tarjeta"
        ordenes={ordenes}
        type="American Express"
        url="/amex.png"
      />
    </div>
  );
}
