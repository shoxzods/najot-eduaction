import styles from './Login.module.scss';
import LMS from "../../assets/logo-md.png";

export default function() {
    return (
        <div className={styles.container}>
            <h1>
                MUHAMMAD AL-XORAZMIY NOMIDAGI
                TOSHKENT AXBOROT TEXNOLOGIYALARI
                UNIVERSITETI
            </h1>
            <img src={LMS} alt="" />
            <h2>Learning Management System</h2>

            <form>
                <label htmlFor="login">Login</label>
                <input type="text" id='login' placeholder='Loginni kiriting' />
                <label htmlFor="password">Parol</label>
                <input type="password" id='password' placeholder='Parolni kirriting' />
            </form>
        </div>
    )
}