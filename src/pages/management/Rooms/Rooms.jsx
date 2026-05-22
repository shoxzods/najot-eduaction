import { useState, useEffect } from "react";
import styles from "./Rooms.module.scss";
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RoomModal from "../../../components/UI/RoomModal/RoomModal";
import { api } from "../../../api/api";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function Rooms() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const defaultRoomData = {
        name: "",
        capacity: "",
    };
    const [roomData, setRoomData] = useState(defaultRoomData);

    const fetchRooms = () => {
        setIsLoading(true);
        api.get('/rooms').then(
            res => {
                setRooms(res.data.data);
                setIsLoading(false);
                console.log(res.data.data)
            }
        ).catch(
            err => {
                console.log(err.message);
                setIsLoading(false);
            }
        );
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    function handleRoomInputChange(e) {
        setRoomData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    }

    const openAddRoomModal = () => {
        setSelectedRoom(null);
        setRoomData(defaultRoomData);
        setIsModalOpen(true);
    };

    const openEditRoomModal = (room) => {
        setSelectedRoom(room);
        setRoomData({
            name: room.name || "",
            capacity: room.capacity?.toString() || "",
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedRoom(null);
        setRoomData(defaultRoomData);
    };

    function deleteRoom(id) {
        if (!window.confirm("Haqiqatan ham xonani o'chirmoqchimisiz?")) return;
        setIsLoading(true);
        api.delete(`/rooms/${id}`)
            .then(res => {
                if (res.status === 200 || res.status === 204) {
                    setRooms(prev => prev.filter(room => room.id !== id));
                } else {
                    console.warn('Unexpected delete response', res);
                }
            })
            .catch(err => console.error(err.message))
            .finally(() => setIsLoading(false));
    }

    return (
        <div className={styles.roomsContainer}>
            <div className={styles.header}>
                <div className={styles.titleWrapper}>
                    <h2 className={styles.title}>Xonalar</h2>
                </div>
                <button className={styles.addBtn} onClick={openAddRoomModal}>
                    <AddRoundedIcon fontSize="small" />
                    Xonani qo'shish
                </button>
            </div>

            <div className={styles.grid} style={{ position: 'relative', opacity: isLoading ? 0.6 : 1, transition: 'opacity 0.2s', minHeight: '150px' }}>
                {isLoading && (
                    <Box sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.4)',
                        zIndex: 10
                    }}>
                        <CircularProgress sx={{ color: '#6c35de' }} />
                    </Box>
                )}
                {rooms.map((room) => (
                    <div key={room.id} className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.roomName}>{room.name}</h3>
                            <div className={styles.actions}>
                                <button
                                    onClick={() => deleteRoom(room.id)}
                                    className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                >
                                    <DeleteOutlineRoundedIcon />
                                </button>
                                <button
                                    onClick={() => openEditRoomModal(room)}
                                    className={`${styles.actionBtn} ${styles.editBtn}`}
                                >
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
                onClose={closeModal}
                title={selectedRoom ? "Xonani tahrirlash" : "Xonani qo'shish"}
                footer={
                    <>
                        <button type="button" className={styles.cancelBtn} onClick={closeModal}>Bekor qilish</button>
                        <button type="submit" form="roomForm" className={styles.saveBtn}>Saqlash</button>
                    </>
                }
            >

                <form id="roomForm" onSubmit={(e) => {
                    e.preventDefault();
                    const payload = {
                        name: roomData.name,
                        capacity: Number(roomData.capacity)
                    };

                    const request = selectedRoom
                        ? api.patch(`/rooms/${selectedRoom.id}`, payload)
                        : api.post('/rooms', payload);

                    request.then(
                        res => {
                            console.log(res.status);
                            fetchRooms();
                            closeModal();
                        }
                    ).catch(
                        err => console.log(err.message)
                    );

                }} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label>Nomi <span>*</span></label>
                        <input
                            value={roomData.name}
                            onChange={handleRoomInputChange}
                            name="name"
                            type="text"
                            placeholder="Xona nomi"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Sig'imi <span>*</span></label>
                        <input
                            value={roomData.capacity}
                            onChange={handleRoomInputChange}
                            name="capacity"
                            type="number"
                            placeholder="Masalan: 20"
                        />
                    </div>
                </form>
            </RoomModal>
        </div>
    );
}

