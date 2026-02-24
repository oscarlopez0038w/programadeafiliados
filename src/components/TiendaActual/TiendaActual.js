"use client";
import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import { supabase } from "../../lib/supabaseClient";
import styles from "./TiendaActual.module.css";
export default function TiendaActual() {
  const { storeId } = useUser();
  const [storeName, setStoreName] = useState("");

  useEffect(() => {
    if (!storeId) return;

    const fetchStore = async () => {
      const { data, error } = await supabase
        .from("app_stores") // nombre de tu tabla de tiendas
        .select("store_name")
        .eq("store_id", storeId)
        .single();

      if (!error && data) setStoreName(data.store_name);
    };

    fetchStore();
  }, [storeId]);

  return (
    <div className={styles.tiendaWrapper}>
      <strong>Tienda</strong> {storeName || storeId || "No asignada"}
    </div>
  );
}
