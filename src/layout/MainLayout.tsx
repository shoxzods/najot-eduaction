"use client";
import { useState, Suspense } from "react";

import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/header/Header";
import ManagementSidebar from "../components/ManagementSidebar/ManagementSidebar";
import Loader from "../components/UI/Loader/Loader";
import PageTransition from "../components/UI/PageTransition/PageTransition";
import styles from "./MainLayout.module.scss";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
    const [isSubSidebarVisible, setIsSubSidebarVisible] = useState<boolean>(false);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const toggleSubSidebar = () => {
        setIsSubSidebarVisible(!isSubSidebarVisible);
    };

    const closeSubSidebar = () => {
        setIsSubSidebarVisible(false);
    };

    return (
        <div className={styles.layout}>
            <Sidebar
                isCollapsed={isCollapsed}
                toggleSidebar={toggleSidebar}
                isSubSidebarOpen={isSubSidebarVisible}
                toggleSubSidebar={toggleSubSidebar}
            /> 
            <ManagementSidebar
                isOpen={isSubSidebarVisible}
                isCollapsed={isCollapsed}
                onClose={closeSubSidebar}
            />
            <div 
                className={`${styles.backdrop} ${isSubSidebarVisible ? styles.backdropVisible : ""}`} 
                onClick={closeSubSidebar} 
            />
            <div className={`${styles.main} ${isCollapsed ? styles.mainCollapsed : ""} ${isSubSidebarVisible ? styles.mainWithSubSidebar : ""}`}>
                <Header />
                <main className={styles.content}>
                    <Suspense fallback={<Loader fullScreen={false} />}>
                        <PageTransition>
                            {children}
                        </PageTransition>
                    </Suspense>
                </main>
            </div>
        </div>
    );
}
