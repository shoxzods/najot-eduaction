"use client";
import { useState } from "react";
import styles from "./Home.module.scss";

import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import AcUnitRoundedIcon from '@mui/icons-material/AcUnitRounded';
import ArchiveRoundedIcon from '@mui/icons-material/ArchiveRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

const stats = [
    { label: "Faol talabalar", value: "52", icon: <SchoolRoundedIcon /> },
    { label: "Guruhlar", value: "23", icon: <GroupRoundedIcon /> },
    { label: "Joriy oy to'lovlar", value: "0", icon: <CreditCardRoundedIcon /> },
    { label: "Qarzdorlar", value: "104", icon: <WarningRoundedIcon /> },
    { label: "Muzlatilganlar", value: "0", icon: <AcUnitRoundedIcon /> },
    { label: "Arxivdagilar", value: "23", icon: <ArchiveRoundedIcon /> },
];

export default function Home() {
    const [openAccordion, setOpenAccordion] = useState(0);

    const toggleAccordion = (index) => {
        setOpenAccordion(openAccordion === index ? null : index);
    };

    return (
        <div className={styles.container}>
            <div className={styles.welcomeSection}>
                <h1 className={styles.welcomeTitle}>Salom, Shoxzod Primov!</h1>
                <p className={styles.welcomeSubtitle}>NajotEdu platformasiga xush kelibsiz!</p>
            </div>

            <div className={styles.statsGrid}>
                {stats.map((stat, index) => (
                    <div key={index} className={styles.statCard}>
                        <div className={styles.statIcon}>
                            {stat.icon}
                        </div>
                        <div className={styles.statInfo}>
                            <div className={styles.statLabel}>{stat.label}</div>
                            <div className={styles.statValue}>{stat.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.accordionList}>
                <div className={styles.accordionItem}>
                    <div
                        className={styles.accordionHeader}
                        onClick={() => toggleAccordion(0)}
                    >
                        <span>Joriy oy uchun to'lovlar</span>
                        <KeyboardArrowDownRoundedIcon
                            style={{ transform: openAccordion === 0 ? 'rotate(180deg)' : 'rotate(0)' }}
                        />
                    </div>
                </div>
                <div className={styles.accordionItem}>
                    <div
                        className={styles.accordionHeader}
                        onClick={() => toggleAccordion(1)}
                    >
                        <span>Yillik Foyda</span>
                        <KeyboardArrowDownRoundedIcon
                            style={{ transform: openAccordion === 1 ? 'rotate(180deg)' : 'rotate(0)' }}
                        />
                    </div>
                </div>
                <div className={styles.accordionItem}>
                    <div
                        className={styles.accordionHeader}
                        onClick={() => toggleAccordion(2)}
                    >
                        <span>Dars jadvali</span>
                        <KeyboardArrowDownRoundedIcon
                            style={{ transform: openAccordion === 2 ? 'rotate(180deg)' : 'rotate(0)' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
