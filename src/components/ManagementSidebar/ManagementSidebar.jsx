import { useState } from "react";
import styles from "./ManagementSidebar.module.scss";
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import MeetingRoomRoundedIcon from '@mui/icons-material/MeetingRoomRounded';
import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import QuestionAnswerRoundedIcon from '@mui/icons-material/QuestionAnswerRounded';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import MonetizationOnRoundedIcon from '@mui/icons-material/MonetizationOnRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import FactCheckRoundedIcon from '@mui/icons-material/FactCheckRounded';

const subMenuItems = [
    { label: "Kurslar", icon: <SchoolRoundedIcon /> },
    { label: "Xonalar", icon: <MeetingRoomRoundedIcon /> },
    { label: "Filial", icon: <AccountTreeRoundedIcon /> },
    { label: "Hodimlar", icon: <BadgeRoundedIcon /> },
    { label: "Sabablar", icon: <QuestionAnswerRoundedIcon /> },
    { label: "Rollar", icon: <SecurityRoundedIcon /> },
    { label: "Coin", icon: <MonetizationOnRoundedIcon /> },
    { label: "Xabar Yuborish", icon: <SendRoundedIcon /> },
    { label: "FAQ", icon: <HelpRoundedIcon /> },
    { label: "Tekshiruv", icon: <FactCheckRoundedIcon /> },
];

export default function ManagementSidebar({ isOpen, onClose, isCollapsed }) {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div className={`${styles.subSidebar} ${isOpen ? styles.open : ""} ${isCollapsed ? styles.collapsed : ""}`}>
            <div className={styles.header}>
                <h3 className={styles.title}>Menu</h3>
            </div>
            <div className={styles.content}>
                {subMenuItems.map((item, index) => (
                    <div 
                        key={index} 
                        className={`${styles.item} ${activeIndex === index ? styles.itemActive : ""}`}
                        onClick={() => setActiveIndex(index)}
                    >
                        <span className={styles.icon}>{item.icon}</span>
                        <span className={styles.label}>{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
