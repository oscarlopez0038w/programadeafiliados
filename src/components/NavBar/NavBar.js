"use client";

import { useRouter, usePathname } from "next/navigation";
import styles from "./NavBar.module.css";

export default function NavBar({ isAdmin }) {
  const router = useRouter();
  const pathname = usePathname();

  const goTo = (path) => router.push(path);

  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <span className={styles.logo}>
          Programa de Afiliados
        </span>
      </div>

      {isAdmin && (
        <div className={styles.menu}>
          <button
            className={`${styles.link} ${
              pathname === "/" ? styles.active : ""
            }`}
            onClick={() => goTo("/")}
          >
            Inicio
          </button>

          <button
            className={`${styles.link} ${
              pathname === "/admin" ? styles.active : ""
            }`}
            onClick={() => goTo("/admin")}
          >
            Panel Admin
          </button>
        </div>
      )}
    </nav>
  );
}
