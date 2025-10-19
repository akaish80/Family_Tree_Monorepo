"use client";
import Link from "next/link";
import styles from './GlobalHeader.module.scss'

const GlobalHeader = () => {
    return (
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
        </div>
    )
}

export default GlobalHeader;