import { useState } from "react";
import styles from "./Rooms.module.scss";
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import RoomModal from "../../../components/UI/RoomModal/RoomModal";

const roomsData = [
    { id: 1, name: "Autodesk", capacity: 20 },
    { id: 2, name: "Cisco", capacity: 15 },
    { id: 3, name: "Intel", capacity: 25 },
    { id: 4, name: "Microsoft", capacity: 18 },
];

export default function Rooms() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => setIsModalOpen(!isModalOpen);

    return (
        <div className={styles.roomsContainer}>
            <div className={styles.header}>
                <div className={styles.titleWrapper}>
                    <h2 className={styles.title}>Xonalar</h2>
                    <RefreshRoundedIcon className={styles.refreshIcon} />
                </div>
                <button className={styles.addBtn} onClick={toggleModal}>
                    <AddRoundedIcon />
                    Xonani qo'shish
                </button>
            </div>

            <div className={styles.grid}>
                {roomsData.map((room) => (
                    <div key={room.id} className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.roomName}>{room.name}</h3>
                            <div className={styles.actions}>
                                <button className={`${styles.actionBtn} ${styles.deleteBtn}`}>
                                    <DeleteOutlineRoundedIcon />
                                </button>
                                <button className={`${styles.actionBtn} ${styles.editBtn}`}>
                                    <EditOutlinedIcon />
                                </button>
                            </div>
                        </div>
                        <p className={styles.capacity}>Sig'imi: {room.capacity}</p>
                    </div>
                ))}
            </div>

            <RoomModal
                isOpen={isModalOpen}
                onClose={toggleModal}
                title="Xonani qo'shish"
                footer={
                    <>
                        <button className={styles.cancelBtn} onClick={toggleModal}>Bekor qilish</button>
                        <button className={styles.saveBtn}>Saqlash</button>
                    </>
                }
            >
                <div className={styles.form}>
                    <div className={styles.formGroup}>
                        <label>Nomi <span>*</span></label>
                        <input type="text" placeholder="Xona nomi" />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Sig'imi <span>*</span></label>
                        <input type="text" placeholder="Masalan: 20" />
                    </div>
                </div>
            </RoomModal>
        </div>
    );
}

