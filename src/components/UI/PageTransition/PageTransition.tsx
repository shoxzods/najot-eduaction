"use client";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef } from "react";
import styles from "./PageTransition.module.scss";

export default function PageTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const ref = useRef<HTMLDivElement>(null);

    // Create a stable pathname that ignores date segments and topic ids at the
    // end of the URL, so navigating between days/topics doesn't remount the
    // route's own layout (e.g. the topics/[topicId] sidebar layout).
    const stablePathname = pathname
        ? pathname
            .replace(/\/\d{4}-\d{2}-\d{2}$/, '')
            .replace(/\/topics\/[^/]+$/, '/topics')
        : '';

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
