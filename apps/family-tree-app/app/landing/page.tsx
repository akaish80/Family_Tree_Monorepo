"use client";
import Link from "next/link";
import styles from "./landing.module.scss";

export default function LandingPage() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.heading}>Welcome to Family Tree App</h1>
        {/* <p className={styles.subheading}>Choose an option to get started:</p>
        <div className={styles.ctaRow}>
          <Link href="/configurations" passHref>
            <button className={styles.ctaBtn} type="button">Configurations</button>
          </Link>
          <Link href="/flow" >
            <button className={styles.ctaBtn}>App Flow</button>
          </Link>
          <Link href="/canvas" >
            <button className={styles.ctaBtn}>Canvas</button>
          </Link>
        </div> */}
      </div>
    </div>
  );
}
