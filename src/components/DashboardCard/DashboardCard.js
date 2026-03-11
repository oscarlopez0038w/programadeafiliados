import styles from "./DashboardCard.module.css";
import Image from "next/image";

export default function DashboardCard({
  title,
  subtitle,
  ordenes = [],
  type,
  url,
}) {
  let value = 0;
  let porcentaje = 0;
  const tasaCambio = 36.6243;
  const totalOrdenes = ordenes.length || 1;

  switch (type) {
    case "total":
      value = ordenes.length;
      break;

    case "ingreso": {
      const total = ordenes.reduce((acc, o) => acc + Number(o.value), 0);
      // Formatear a moneda en dólares con separador de miles
      value = new Intl.NumberFormat("es-NI", {
        style: "currency",
        currency: "NIO",
      }).format(total);
      break;
    }
    case "ingresoDolares": {
      const total = ordenes.reduce((acc, o) => acc + Number(o.value), 0);
      const totalDolares = total / tasaCambio;
      // Formatear a moneda en dólares con separador de miles
      value = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(totalDolares);
      break;
    }
    case "ticketpromedioCordobas": {
      const total = ordenes.reduce((acc, o) => acc + Number(o.value), 0);
      const cantidad = ordenes.length || 1; // evita división entre 0

      const ticketpromedio = total / cantidad; // Convertir a dólares
      // Formatear a moneda en dólares con separador de miles
      value = new Intl.NumberFormat("es-NI", {
        style: "currency",
        currency: "NIO",
      }).format(ticketpromedio);
      break;
    }
    case "ticketpromedio": {
      const total = ordenes.reduce((acc, o) => acc + Number(o.value), 0);
      const cantidad = ordenes.length || 1; // evita división entre 0

      const ticketpromedio = total / cantidad / tasaCambio; // Convertir a dólares
      // Formatear a moneda en dólares con separador de miles
      value = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(ticketpromedio);
      break;
    }
    case "visa": {
      const cantidad = ordenes.filter(
        (o) => o.payment_method === "Visa",
      ).length;
      value = cantidad;
      porcentaje = ((cantidad / totalOrdenes) * 100).toFixed(1);
      break;
    }

    case "mastercard": {
      const cantidad = ordenes.filter(
        (o) => o.payment_method === "Mastercard",
      ).length;
      value = cantidad;
      porcentaje = ((cantidad / totalOrdenes) * 100).toFixed(1);
      break;
    }

    case "American Express": {
      const cantidad = ordenes.filter(
        (o) => o.payment_method === "American Express",
      ).length;
      value = cantidad;
      porcentaje = ((cantidad / totalOrdenes) * 100).toFixed(1);
      break;
    }

    default:
      value = 0;
  }

  return (
    <div className={styles.card}>
      <div className={styles.encabezado}>
        <span className={styles.title}>{title}</span>

        {url && (
          <Image
            className={styles.image}
            src={url}
            alt="icon"
            width={575}
            height={415}
          />
        )}
      </div>

      <strong className={styles.value}>{value}</strong>

      {/* Mostrar porcentaje solo para tarjetas */}
      {porcentaje > 0 && (
        <span className={styles.porcentaje}>{porcentaje}% del total</span>
      )}

      {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
    </div>
  );
}
