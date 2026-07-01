"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import styles from "./PageTransition.module.scss";

export default function PageTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const ref = useRef<HTMLDivElement>(null);

    // Create a stable pathname that ignores date segments at the end of the URL
    // so navigating between days doesn't remount the entire application layout
    const stablePathname = pathname ? pathname.replace(/\/\d{4}-\d{2}-\d{2}$/, '') : '';

    useEffect(() => {
        // Scroll to top only when stablePathname changes
        const scrollContainer = ref.current?.closest<HTMLElement>('[class*="main"]');
        if (scrollContainer) {
            scrollContainer.scrollTop = 0;
        }
    }, [stablePathname]);

    return (
        <div key={stablePathname} ref={ref} className={styles.page}>
            {children}
        </div>
    );
}
