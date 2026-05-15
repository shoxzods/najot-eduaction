import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/header/Header";
import ManagementSidebar from "../components/ManagementSidebar/ManagementSidebar";
import styles from "./MainLayout.module.scss";

export default function MainLayout() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isSubSidebarOpen, setIsSubSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const toggleSubSidebar = (value) => {
        setIsSubSidebarOpen(typeof value === "boolean" ? value : !isSubSidebarOpen);
    };

    return (
        <div className={styles.layout}>
            <Sidebar 
                isCollapsed={isCollapsed} 
                toggleSidebar={toggleSidebar} 
                onToggleSubSidebar={toggleSubSidebar}
                isSubSidebarOpen={isSubSidebarOpen}
            />
            <ManagementSidebar 
                isOpen={isSubSidebarOpen} 
                onClose={() => setIsSubSidebarOpen(false)} 
                isCollapsed={isCollapsed}
            />
            <div className={`${styles.main} ${isCollapsed ? styles.mainCollapsed : ""} ${isSubSidebarOpen ? styles.mainWithSubSidebar : ""}`}>
                <Header />
                <main className={styles.content}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
