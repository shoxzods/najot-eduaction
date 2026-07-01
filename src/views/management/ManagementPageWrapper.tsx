"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styles from "./Management.module.scss";

export default function ManagementPageWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [animClass, setAnimClass] = useState(styles.contentVisible);
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    if (pathname === prevPathRef.current) return;
    prevPathRef.current = pathname;

    // Fade out
    setAnimClass(styles.contentHidden);

    const timer = setTimeout(() => {
      setDisplayChildren(children);
      setAnimClass(styles.contentVisible);
    }, 150);

    return () => clearTimeout(timer);
  }, [pathname, children]);

  // Sync children without animation on same path (e.g. data refresh)
  useEffect(() => {
    if (pathname === prevPathRef.current) {
      setDisplayChildren(children);
    }
  }, [children, pathname]);

  return <div className={`${styles.content} ${animClass}`}>{displayChildren}</div>;
}
