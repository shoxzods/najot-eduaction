"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import styles from "./PageTransition.module.scss";

export default function PageTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Scroll to top on every route change
        const scrollContainer = ref.current?.closest<HTMLElement>('[class*="main"]');
        if (scrollContainer) {
            scrollContainer.scrollTop = 0;
        }
    }, [pathname]);

    return (
        <div key={pathname} ref={ref} className={styles.page}>
            {children}
        </div>
    );
}
