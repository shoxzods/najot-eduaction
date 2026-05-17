import styles from './Login.module.scss';
import LMS from "../../assets/logo-md.png";
import { useNavigate } from 'react-router-dom';
import { api } from '../../api/api';
import { useState } from 'react';

export default function () {
    const [ input , setInput ] = useState({
        number:'',
        password:""
    });

    const navigate = useNavigate();

    function Submit(e) {
        e.preventDefault();
        const auth = localStorage.getItem('accessToken') || false;

        api.post('/auth/login' , input ).then(
            res => {
                if (res.status == 201) {
                    localStorage.setItem("accessToken" , res.data.accessToken);
                }
            } 
        ).catch(
            err => console.log(err.message)
        )

        console.log(auth)

        if (auth) {
            navigate('/dashboard' , {
                replace:true
            });
        }
    }

    function InputData(e) {
        setInput(current => ({
            ...current,
            [e.target.id]:e.target.value
        }))
    }

    return (
        <div className={styles.container}>
            <div className={styles.left_side}>
                <img className={styles.left_icon} src='/study.svg' alt="left images" />
            </div>
            <div className={`${styles.right_side}`}>
                <div className={styles.right_container}>
                    <div style={{ padding: "0 20px" }}>
                        <h1 className={styles.title}>MUHAMMAD AL-XORAZMIY NOMIDAGI <br />
                            TOSHKENT AXBOROT TEXNOLOGIYALARI <br />
                            UNIVERSITETI</h1>

                        <img className={styles.lms__icon} src={LMS} alt="" />
                        <h2 className={styles.lms_login}>
                            Learning Management System
                        </h2>
                    </div>
                    <form onSubmit={Submit} className={styles.form}>
                        <div className={styles.box}>
                            <label className={styles.form__label} htmlFor="phone">Login</label>
                            <input onChange={InputData} className={styles.form__input} id='phone' type="text" placeholder='Loginni kiriting' required />
                        </div>
                        <div className={styles.box}>
                            <label className={styles.form__label} htmlFor="password">Parol</label>
                            <input onChange={InputData} className={styles.form__input} id='password' type="password" placeholder='Parolni kiriting' required />
                        </div>
                        <button className={styles.form__button}>Kirish</button>
                    </form>
                </div>

                <p className={styles.lisence}>Copyright © 2021 of Tashkent University of Information Technologies</p>
            </div>
        </div>
    )
}