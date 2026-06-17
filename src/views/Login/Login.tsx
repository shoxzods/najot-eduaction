"use client";
import { useRouter } from 'next/navigation';
import styles from './Login.module.scss';

import { api } from '../../api/api';
import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';

interface LoginInput {
    number: string;
    password: string;
}

export default function Login() {
    const [input, setInput] = useState<LoginInput>({
        number: '',
        password: ""
    });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const router = useRouter();

    function Submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        api.post('/auth/login', input).then(
            res => {
                if (res.status === 201 || res.status === 200) {
                    const auth = res.data?.accessToken as string | undefined;
                    const refresh = res.data?.refreshToken as string | undefined;

                    if (auth && refresh) {
                        localStorage.setItem("accessToken", auth);
                        localStorage.setItem("refreshToken", refresh);
                        setSuccess("Muvaffaqiyatli kirdingiz!");
                        setTimeout(() => {
                            router.push('/dashboard', {
                                replace: true
                            } as any);
                        }, 1000);
                    } else {
                        setError("Login yoki parol noto'g'ri");
                    }
                } else {
                    setError("Serverda xatolik yuz berdi");
                }
            }
        ).catch(
            (err: any) => {
                console.error(err);
                const apiMsg = err.response?.data?.message || err.response?.data?.error;
                if (typeof apiMsg === 'string') {
                    setError(`Xatolik yuz berdi: ${apiMsg}`);
                } else if (Array.isArray(apiMsg) && apiMsg.length > 0) {
                    setError(`Xatolik yuz berdi: ${apiMsg[0]}`);
                } else {
                    setError("Login yoki parol noto'g'ri");
                }
            }
        )
    }

    function InputData(e: React.ChangeEvent<HTMLInputElement>) {
        setError(null);
        setSuccess(null);
        setInput(current => ({
            ...current,
            [e.target.id]: e.target.value
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

                        <img className={styles.lms__icon} src={"/logo-md.png" as any} alt="" />
                        <h2 className={styles.lms_login}>
                            Learning Management System
                        </h2>
                    </div>
                    <form onSubmit={Submit} className={`${styles.form} ${error ? styles.shake : ''}`}>
                        <Collapse in={!!error}>
                            <Alert
                                severity="error"
                                variant="filled"
                                sx={{
                                    mb: 1,
                                    fontSize: '0.85rem',
                                    borderRadius: '8px',
                                    fontFamily: 'inherit'
                                }}
                            >
                                {error}
                            </Alert>
                        </Collapse>

                        <Collapse in={!!success}>
                            <Alert
                                severity="success"
                                variant="filled"
                                sx={{
                                    mb: 1,
                                    fontSize: '0.85rem',
                                    borderRadius: '8px',
                                    fontFamily: 'inherit'
                                }}
                            >
                                {success}
                            </Alert>
                        </Collapse>

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