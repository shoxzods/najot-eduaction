"use client";
import { useRouter } from 'next/navigation';
import styles from './Login.module.scss';

import { api } from '../../api/api';
import { useState } from 'react';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { useForm, FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// ─── Zod Schema ───────────────────────────────────────────────────────────────
const loginSchema = z.object({
    phone: z.string().min(1, "Login kiritilishi shart"),
    password: z.string().min(1, "Parol kiritilishi shart")
});

type LoginFormData = z.infer<typeof loginSchema>;

// ─── Component ────────────────────────────────────────────────────────────────
export default function Login() {
    const [serverError, setServerError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: 'onTouched', // foydalanuvchi maydondan chiqganda validatsiya
    });

    // ─── Submit handler ──────────────────────────────────────────────────────
    async function onSubmit(data: LoginFormData) {
        setLoading(true);
        setServerError(null);

        try {
            const res = await api.post('/auth/login', data);

            if (res.status === 200 || res.status === 201) {
                // Backend "data" obyektini ichida qaytarishi mumkin
                const auth = res.data?.accessToken || res.data?.data?.accessToken || res.data?.token;
                const refresh = res.data?.refreshToken || res.data?.data?.refreshToken;

                if (auth) {
                    localStorage.setItem("accessToken", auth);
                    if (refresh) {
                        localStorage.setItem("refreshToken", refresh);
                    }
                    setSuccess("Muvaffaqiyatli kirdingiz!");
                    setTimeout(() => {
                        router.push('/dashboard', { replace: true } as any);
                    }, 1000);
                } else {
                    setServerError("Login yoki parol noto'g'ri");
                    setLoading(false);
                }
            } else {
                setServerError("Serverda xatolik yuz berdi");
                setLoading(false);
            }
        } catch (err: any) {
            console.error(err);
            const apiMsg = err.response?.data?.message || err.response?.data?.error;
            if (typeof apiMsg === 'string') {
                setServerError(`Xatolik yuz berdi: ${apiMsg}`);
            } else if (Array.isArray(apiMsg) && apiMsg.length > 0) {
                setServerError(`Xatolik yuz berdi: ${apiMsg[0]}`);
            } else {
                setServerError("Login yoki parol noto'g'ri");
            }
            setLoading(false);
        }
    }

    function onInvalid(formErrors: FieldErrors<LoginFormData>) {
        // Zod xatolaridan birinchisini Snackbar (processbar) da ko'rsatamiz
        const firstError = formErrors.phone?.message || formErrors.password?.message;
        if (firstError) {
            setServerError(firstError as string);
        }
    }

    function handleCloseSnackbar() {
        setServerError(null);
        setSuccess(null);
    }

    // ─── Render ──────────────────────────────────────────────────────────────
    return (
        <div className={styles.container}>
            <div className={styles.left_side}>
                <img className={styles.left_icon} src='/study.svg' alt="left images" />
            </div>

            <div className={styles.right_side}>
                {/* Error Snackbar */}
                <Snackbar
                    open={!!serverError}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    sx={{ position: 'absolute', top: 24, right: 24, width: 'auto' }}
                >
                    <Alert
                        onClose={handleCloseSnackbar}
                        severity="error"
                        variant="filled"
                        sx={{
                            width: '100%',
                            position: 'relative',
                            overflow: 'hidden',
                            padding: '6px 12px',
                            paddingBottom: '10px',
                            fontSize: '13px',
                            alignItems: 'center',
                            '& .MuiAlert-icon': { fontSize: '18px', marginRight: '8px' },
                            '& .MuiAlert-message': {
                                padding: '4px 0',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: '100%',
                            },
                            '& .MuiAlert-action': { padding: '0 0 0 8px', marginRight: '-4px' },
                        }}
                    >
                        {serverError}
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                height: '3px',
                                backgroundColor: 'rgba(255,255,255,0.5)',
                                animation: !!serverError ? 'shrink 6s linear forwards' : 'none',
                                '@keyframes shrink': {
                                    '0%': { width: '100%' },
                                    '100%': { width: '0%' },
                                },
                            }}
                        />
                    </Alert>
                </Snackbar>

                {/* Success Snackbar */}
                <Snackbar
                    open={!!success}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    sx={{ position: 'absolute', top: 24, right: 24, width: 'auto' }}
                >
                    <Alert
                        onClose={handleCloseSnackbar}
                        severity="success"
                        variant="filled"
                        sx={{
                            width: '100%',
                            position: 'relative',
                            overflow: 'hidden',
                            padding: '6px 12px',
                            paddingBottom: '10px',
                            fontSize: '13px',
                            alignItems: 'center',
                            '& .MuiAlert-icon': { fontSize: '18px', marginRight: '8px' },
                            '& .MuiAlert-message': {
                                padding: '4px 0',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: '100%',
                            },
                            '& .MuiAlert-action': { padding: '0 0 0 8px', marginRight: '-4px' },
                        }}
                    >
                        {success}
                        <Box
                            sx={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                height: '3px',
                                backgroundColor: 'rgba(255,255,255,0.5)',
                                animation: !!success ? 'shrink 6s linear forwards' : 'none',
                                '@keyframes shrink': {
                                    '0%': { width: '100%' },
                                    '100%': { width: '0%' },
                                },
                            }}
                        />
                    </Alert>
                </Snackbar>

                <div className={styles.right_container}>
                    <div style={{ padding: "0 20px" }}>
                        <h1 className={styles.title}>
                            NAJOT EDUCATION <br />
                            CENTER FOR MODERN IT PROFESSIONS <br />
                            AND DIGITAL TECHNOLOGIES
                        </h1>
                        <img className={styles.lms__icon} src={"/najot_edu.svg" as any} alt="" />
                        <h2 className={styles.lms_login}>Learning Management System</h2>
                    </div>

                    <form
                        onSubmit={handleSubmit(onSubmit, onInvalid)}
                        className={`${styles.form} ${serverError ? styles.shake : ''}`}
                    >
                        {/* Login field */}
                        <div className={styles.box}>
                            <label className={styles.form__label} htmlFor="phone">
                                Login
                            </label>
                            <input
                                {...register('phone')}
                                id="phone"
                                type="text"
                                placeholder="Loginni kiriting"
                                className={styles.form__input}
                                autoComplete="username"
                            />
                        </div>

                        {/* Password field */}
                        <div className={styles.box}>
                            <label className={styles.form__label} htmlFor="password">
                                Parol
                            </label>
                            <div className={styles.passwordWrapper}>
                                <input
                                    {...register('password')}
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Parolni kiriting"
                                    autoComplete="current-password"
                                />
                                <span
                                    className={styles.eyeIcon}
                                    onClick={() => setShowPassword(prev => !prev)}
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </span>
                            </div>
                        </div>

                        {/* Submit button */}
                        <button
                            type="submit"
                            className={styles.form__button}
                            disabled={loading}
                        >
                            {loading ? (
                                <CircularProgress size={16} color="inherit" sx={{ mr: 1 }} />
                            ) : null}
                            {loading ? 'Kirilmoqda...' : 'Kirish'}
                        </button>

                        {/* OneID button */}
                        <button
                            type="button"
                            className={styles.form__oneid_button}
                            onClick={() => window.open('https://sso.egov.uz/', '_blank')}
                        >
                            <div className={styles.oneid_logo}>
                                <span className={styles.one}>ONE</span>
                                <span className={styles.id}>iD</span>
                            </div>
                            OneID
                        </button>
                    </form>
                </div>

                <p className={styles.lisence}>
                    Copyright © {new Date().getFullYear()} Najot Eduaction
                </p>
            </div>
        </div>
    );
}