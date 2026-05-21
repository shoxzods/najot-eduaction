import { useNavigate } from "react-router-dom";
import styles from "./CreateHomework.module.scss";
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import FormatBoldRoundedIcon from '@mui/icons-material/FormatBoldRounded';
import FormatItalicRoundedIcon from '@mui/icons-material/FormatItalicRounded';
import FormatUnderlinedRoundedIcon from '@mui/icons-material/FormatUnderlinedRounded';
import StrikethroughSRoundedIcon from '@mui/icons-material/StrikethroughSRounded';
import FormatQuoteRoundedIcon from '@mui/icons-material/FormatQuoteRounded';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';
import FormatListNumberedRoundedIcon from '@mui/icons-material/FormatListNumberedRounded';
import FormatAlignLeftRoundedIcon from '@mui/icons-material/FormatAlignLeftRounded';
import InsertLinkRoundedIcon from '@mui/icons-material/InsertLinkRounded';

export default function CreateHomework() {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button className={styles.backBtn} onClick={() => navigate(-1)}>
                    <ArrowBackIosNewRoundedIcon fontSize="small" />
                </button>
                <h1>Yangi uyga vazifa yaratish</h1>
            </div>

            <form className={styles.form}>
                <div className={styles.formGroup}>
                    <label><span>*</span> Mavzu</label>
                    <select className={styles.select}>
                        <option value="">Mavzulardan birini tanlang</option>
                        <option value="1">Html asoslari</option>
                        <option value="2">Kirish</option>
                        <option value="3">Nodejs</option>
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label><span>*</span> Izoh</label>
                    <div className={styles.richEditor}>
                        <div className={styles.toolbar}>
                            <select className={styles.formatSelect} defaultValue="H1">
                                <option value="H1">H1 H2</option>
                            </select>
                            <select className={styles.fontSelect} defaultValue="Sans Serif">
                                <option value="Sans Serif">Sans Serif</option>
                            </select>
                            <select className={styles.styleSelect} defaultValue="Normal">
                                <option value="Normal">Normal</option>
                            </select>
                            
                            <div className={styles.divider}></div>
                            
                            <button type="button" className={styles.toolBtn}><FormatBoldRoundedIcon fontSize="small" /></button>
                            <button type="button" className={styles.toolBtn}><FormatItalicRoundedIcon fontSize="small" /></button>
                            <button type="button" className={styles.toolBtn}><FormatUnderlinedRoundedIcon fontSize="small" /></button>
                            <button type="button" className={styles.toolBtn}><StrikethroughSRoundedIcon fontSize="small" /></button>
                            <button type="button" className={styles.toolBtn}><FormatQuoteRoundedIcon fontSize="small" /></button>
                            <button type="button" className={styles.toolBtn}><CodeRoundedIcon fontSize="small" /></button>
                            
                            <div className={styles.divider}></div>

                            <button type="button" className={styles.toolBtn}><FormatListBulletedRoundedIcon fontSize="small" /></button>
                            <button type="button" className={styles.toolBtn}><FormatListNumberedRoundedIcon fontSize="small" /></button>
                            <button type="button" className={styles.toolBtn}><FormatAlignLeftRoundedIcon fontSize="small" /></button>
                            
                            <div className={styles.divider}></div>
                            
                            <button type="button" className={styles.toolBtn}><InsertLinkRoundedIcon fontSize="small" /></button>
                        </div>
                        <textarea 
                            className={styles.editorTextarea}
                            placeholder="Vazifa haqida batafsil ma'lumot kiriting..."
                        ></textarea>
                    </div>
                </div>

                <div className={styles.uploadArea}>
                    <div className={styles.uploadContent}>
                        <CloudUploadRoundedIcon className={styles.uploadIcon} />
                        <p>Faylni tanlash yoki shu yerga tashlang</p>
                    </div>
                </div>

                <div className={styles.formActions}>
                    <button type="button" className={styles.cancelBtn} onClick={() => navigate(-1)}>Bekor qilish</button>
                    <button type="button" className={styles.submitBtn}>E'lon qilish</button>
                </div>
            </form>
        </div>
    );
}
