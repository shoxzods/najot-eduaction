"use client";
import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';

import { Suspense } from "react";
import Loader from "../../components/UI/Loader/Loader";
import styles from "./Management.module.scss";

const tabs = [
    { label: "Kurslar", id: "courses" },
    { label: "Xonalar", id: "rooms" },
    { label: "Xodimlar", id: "staff" },
];

export default function Management({ children }) {
    const pathname = usePathname() || '';
    const searchParams = useSearchParams();
    const activeTab = searchParams.get("tab") || "courses";

    // Check if we are on the main management page (not an archive subpage)
    const isMainPage = pathname === "/management";

    return (
        <div className={styles.managementPage}>
            <div className={styles.header}>
                <h1 className={styles.title}>Boshqarish</h1>
                <div className={styles.tabs}>
                    {tabs.map((item) => (
                        <Link
                            key={item.id}
                            href={`/management?tab=${item.id}`}
                            className={`${styles.tab} ${isMainPage && activeTab === item.id ? styles.tabActive : ""}`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            </div>

            <div className={styles.content}>
                <Suspense fallback={<Loader fullScreen={false} />}>
                    {children}
                </Suspense>
            </div>
        </div>
    );
}
