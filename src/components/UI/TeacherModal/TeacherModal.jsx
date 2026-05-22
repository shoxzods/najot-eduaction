import { useEffect, useState } from "react";
import styles from "./TeacherModal.module.scss";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import { createPortal } from "react-dom";
import AddGroupModal from "./AddGroupModal/AddGroupModal";

export default function TeacherModal({
    isOpen,
    onClose,
    onSubmit,
    teacherToEdit
}) {
    const [shouldRender, setShouldRender] = useState(isOpen);
    const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState(false);

    const defaultTeacherData = {
        phone: "+998",
        email: "",
        fullName: "",
        address: "",
        password: "",
        photo: null,
        groups: []
    };

    const [teacherData, setTeacherData] = useState(defaultTeacherData);

    const normalizeGroups = (groups = []) => {
        if (!Array.isArray(groups)) return [];
        return groups.map((group) => {
            if (group && typeof group === 'object') {
                return group;
            }
            return { id: group, name: String(group) };
        });
    };

    const toggleAddGroupModal = () => setIsAddGroupModalOpen(!isAddGroupModalOpen);

    const resetForm = () => {
        setTeacherData(defaultTeacherData);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTeacherData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            document.body.style.overflow = 'hidden';
            if (teacherToEdit) {
                setTeacherData({
                    phone: teacherToEdit.phone || "+998",
                    email: teacherToEdit.email || "",
                    fullName: teacherToEdit.full_name || teacherToEdit.fullName || "",
                    address: teacherToEdit.address || "",
                    password: "",
                    photo: null,
                    groups: normalizeGroups(teacherToEdit.groups || [])
                });
            } else {
                resetForm();
            }
        } else {
            const timer = setTimeout(() => {
                setShouldRender(false);
                document.body.style.overflow = 'unset';
                resetForm();
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen, teacherToEdit]);

    const handleSubmit = (e) => {
        if (e) e.preventDefault();

        const { fullName, email, password, phone, address, photo, groups } = teacherData;
        const isEditing = Boolean(teacherToEdit?.id);

        if (!fullName || !email || !phone) {
            alert("Iltimos, barcha majburiy maydonlarni to'ldiring!");
            return;
        }

        if (!isEditing && !password) {
            alert("Iltimos, parolni kiriting!");
            return;
        }

        // Clean phone number (format strictly as E.164 international phone number: +998XXXXXXXXX)
        const phoneValue = phone || "";
        let cleanPhone = String(phoneValue).replace(/[^\d+]/g, "").trim();
        if (!cleanPhone.startsWith("+")) {
            cleanPhone = "+" + cleanPhone;
        }

        const payload = {
            full_name: fullName,
            email,
            phone: cleanPhone,
            address: address || "",
            groups: normalizeGroups(groups)
                .map(group => typeof group === 'object' ? group.id : group)
                .filter(groupId => groupId != null && groupId !== "")
                .map(Number)
        };

        if (password) {
            payload.password = password;
        }

        if (photo) {
            const formData = new FormData();
            formData.append("full_name", payload.full_name);
            formData.append("email", payload.email);
            formData.append("phone", payload.phone);
            formData.append("address", payload.address);
            if (payload.password) {
                formData.append("password", payload.password);
            }
            formData.append("photo", photo);
            payload.groups.forEach(groupId => formData.append("groups", groupId));

            if (onSubmit) {
                onSubmit(formData, teacherToEdit);
            }
        } else {
            if (onSubmit) {
                onSubmit(payload, teacherToEdit);
            }
        }
    };

    if (!shouldRender) return null;

    return createPortal(
        <div
            className={`${styles.overlay} ${!isOpen ? styles.fadeOut : ""}`}
            onClick={onClose}
        >
            <form
                className={`${styles.modal} ${!isOpen ? styles.slideOut : ""}`}
                onSubmit={handleSubmit}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.header}>
                    <div className={styles.headerTop}>
                        <h2 className={styles.title}>{teacherToEdit?.id ? "O'qituvchini tahrirlash" : "O'qituvchi qo'shish"}</h2>
                        <button type="button" className={styles.closeBtn} onClick={onClose}>
                            <CloseRoundedIcon />
                        </button>
                    </div>
                    <p className={styles.subtitle}>Bu yerda siz yangi o'qituvchi qo'shishingiz mumkin.</p>
                </div>

                <div className={styles.body}>
                    <div className={styles.formGroup}>
                        <label>Telefon raqam</label>
                        <input type="text" name="phone" value={teacherData.phone} onChange={handleInputChange} />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Mail</label>
                        <input type="email" name="email" placeholder="Elektron pochtani kiriting" value={teacherData.email} onChange={handleInputChange} />
                    </div>

                    <div className={styles.formGroup}>
                        <label>O'qituvchi FIO</label>
                        <input type="text" name="fullName" placeholder="Ma'lumotni kiriting" value={teacherData.fullName} onChange={handleInputChange} />
                    </div>


                    <div className={styles.formGroup}>
                        <label>Guruh</label>
                        <div className={styles.groupsInputContainer}>
                            {teacherData.groups.length > 0 && (
                                <div className={styles.groupTags}>
                                    {teacherData.groups.map((group, index) => {
                                        const key = group?.id ?? `${group?.name ?? group}-${index}`;
                                        const label = group?.name ?? group?.title ?? String(group);
                                        return (
                                            <span key={key} className={styles.groupTag}>
                                                {label}
                                                <button 
                                                    type="button"
                                                    className={styles.removeGroupBtn}
                                                    onClick={() => setTeacherData(prev => ({
                                                        ...prev,
                                                        groups: prev.groups.filter((g, i) => i !== index)
                                                    }))}
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        );
                                    })}
                                </div>
                            )}
                            <button type="button" className={styles.addGroupBtnInline} onClick={toggleAddGroupModal}>
                                <AddRoundedIcon fontSize="small" />
                                <span>Qo'shish</span>
                            </button>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Surati</label>
                        <label 
                            className={styles.uploadArea}
                            onDragOver={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                            onDrop={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                    setTeacherData(prev => ({
                                        ...prev,
                                        photo: e.dataTransfer.files[0]
                                    }));
                                }
                            }}
                        >
                            <input 
                                type="file" 
                                style={{ display: "none" }} 
                                accept="image/*"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        setTeacherData(prev => ({
                                            ...prev,
                                            photo: e.target.files[0]
                                        }));
                                    }
                                }}
                            />
                            <CloudUploadOutlinedIcon className={styles.uploadIcon} />
                            {teacherData.photo ? (
                                <>
                                    <p className={styles.uploadText}>
                                        Tanlandi: <span className={styles.purpleText}>{teacherData.photo.name}</span>
                                    </p>
                                    <p className={styles.uploadHint}>O'zgartirish uchun bosing</p>
                                </>
                            ) : (
                                <>
                                    <p className={styles.uploadText}>
                                        <span className={styles.purpleText}>Click to upload</span> or drag and drop
                                    </p>
                                    <p className={styles.uploadHint}>JPG or PNG (max. 800x800px)</p>
                                </>
                            )}
                        </label>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Manzil</label>
                        <input type="text" name="address" placeholder="Manzilni kiriting" value={teacherData.address} onChange={handleInputChange} />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Parol</label>
                        <input type="password" name="password" placeholder="Parolni kiriting" value={teacherData.password} onChange={handleInputChange} />
                    </div>
                </div>

                <div className={styles.footer}>
                    <div className={styles.footerButtons}>
                        <button type="button" className={styles.cancelBtn} onClick={onClose}>Bekor qilish</button>
                        <button type="submit" className={styles.saveBtn}>Saqlash</button>
                    </div>
                    <div className={styles.logoWrapper}>
                        <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M50 20L80 35V65L50 80L20 65V35L50 20Z" stroke="#D4AF37" strokeOpacity="0.2" strokeWidth="1" />
                            <path d="M50 30L70 40V60L50 70L30 60V40L50 30Z" stroke="#D4AF37" strokeOpacity="0.2" strokeWidth="1" />
                            <path d="M50 40L60 45V55L50 60L40 55V45L50 40Z" fill="#D4AF37" fillOpacity="0.1" />
                        </svg>
                    </div>
                </div>

                <AddGroupModal
                    isOpen={isAddGroupModalOpen}
                    onClose={toggleAddGroupModal}
                    initialSelectedGroups={teacherData.groups}
                    onAdd={(selected) => {
                        setTeacherData(prev => ({
                            ...prev,
                            groups: selected
                        }));
                        toggleAddGroupModal();
                    }}
                />
            </form>
        </div>,
        document.body
    );
}
