"use client";
import { useRouter, usePathname } from 'next/navigation';

import { Suspense } from "react";
import Loader from "../../components/UI/Loader/Loader";
import styles from "./Management.module.scss";

const tabs = [
    { label: "Kurslar", slug: "courses" },
    { label: "Xonalar", slug: "rooms" },
    { label: "Xodimlar", slug: "staff" },
];

export default function Management({ children }) {
    const pathname = usePathname() || '';
    const router = useRouter();

    const pathParts = pathname.split("/").filter(Boolean);
    const managementIndex = pathParts.indexOf("management");
    const currentTab = managementIndex >= 0 ? pathParts[managementIndex + 1] : "courses";

    const handleTabChange = (slug) => {
        router.push(`/management/${slug}`);
    };

    return (
        <div className={styles.managementPage}>
            {pathname !== "/management" && (
                <div className={styles.header}>
                    <h1 className={styles.title}>Boshqarish</h1>
                    <div className={styles.tabs}>
                        {tabs.map((item) => (
                            <button
                                key={item.slug}
                                className={`${styles.tab} ${currentTab === item.slug ? styles.tabActive : ""}`}
                                onClick={() => handleTabChange(item.slug)}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className={styles.content}>
                <Suspense fallback={<Loader fullScreen={false} />}>
                    {children}
                </Suspense>
            </div>
        </div>
    );
}
