"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import styles from "./configurations.module.scss";

export default function ConfigurationsPage() {
    const [configs, setConfigs] = useState<{ id: string; name: string }[]>([]);
    const [newConfigName, setNewConfigName] = useState("");

    useEffect(() => {
        axios.get("/api/family-tree/configs").then(res => setConfigs(res.data));
    }, []);

    const handleCreate = async () => {
        if (!newConfigName.trim()) return;
        const res = await axios.post("/api/family-tree/configs", { name: newConfigName, id: newConfigName.replace(/\s+/g, '-').toLowerCase() });
        setConfigs([...configs, res.data]);
        setNewConfigName("");
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <h1 className={styles.heading}>Family Tree Configurations</h1>
                <div className={styles.inputRow}>
                    <input
                        value={newConfigName}
                        onChange={e => setNewConfigName(e.target.value)}
                        placeholder="New configuration name"
                        className={styles.input}
                    />
                    <button onClick={handleCreate} className={styles.createBtn}>Create</button>
                </div>
                <ul className={styles.configList}>
                    {configs.map(cfg => (
                        <li key={cfg.id} className={styles.configItem}>
                            <span className={styles.configName}>{cfg.name}</span>
                            <Link href={`/flow/${cfg.id}`} className={styles.viewFlowBtn}>
                                View Flow →
                            </Link>
                        </li>
                    ))}
                    {configs.length === 0 && (
                        <li className={styles.emptyMsg}>
                            No configurations found. Create one above!
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
}