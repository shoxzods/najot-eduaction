import { useState, useEffect } from "react";
import styles from "./Rooms.module.scss";
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import RoomModal from "../../../components/UI/RoomModal/RoomModal";
import { api } from "../../../api/api";

export default function Rooms() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const toggleModal = () => setIsModalOpen(!isModalOpen);
    const [rooms, setRooms] = useState([]);
    const fetchRooms = () => {
        api.get('/rooms', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
        }).then(
            res => {
                setRooms(res.data.data)
            }
        ).catch(
            err => console.log(err.message)
        )
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    const [roomData, setRoomData] = useState({
        name: "",
        capacity: "",
    });

    function dataSubmit(e) {
        setRoomData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    return (
        <div className={styles.roomsContainer}>
            <div className={styles.header}>
                <div className={styles.titleWrapper}>
                    <h2 className={styles.title}>Xonalar</h2>
                    <RefreshRoundedIcon className={styles.refreshIcon} />
                </div>
                <button className={styles.addBtn} onClick={toggleModal}>
                    <AddRoundedIcon fontSize="small" />
                    Xonani qo'shish
                </button>
            </div>

            <div className={styles.grid}>
                {rooms.map((room) => (
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
                        <button type="submit" form="roomForm" className={styles.saveBtn}>Saqlash</button>
                    </>
                }
            >

                <form id="roomForm" onSubmit={(e) => {
                    e.preventDefault();

                    api.post('/rooms', {
                        name: roomData.name,
                        capacity: Number(roomData.capacity)
                    }, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                        }
                    }).then(
                        res => {
                            console.log(res.status);
                            fetchRooms();
                            setIsModalOpen(false);
                            setRoomData({
                                name: "",
                                capacity: "",
                            });
                        }
                    ).catch(
                        err => console.log(err.message)
                    )

                }} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label>Nomi <span>*</span></label>
                        <input onChange={dataSubmit} name="name" type="text" placeholder="Xona nomi" />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Sig'imi <span>*</span></label>
                        <input onChange={dataSubmit} name="capacity" type="number" placeholder="Masalan: 20" />
                    </div>
                </form>
            </RoomModal>
        </div>
    );
}

