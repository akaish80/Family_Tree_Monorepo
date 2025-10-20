"use client";
import Link from "next/link";
import styles from "./landing.module.scss";

export default function LandingPage() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.heading}>Welcome to Family Tree App</h1>
      </div>
    </div>
  );
}
