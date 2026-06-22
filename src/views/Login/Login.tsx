"use client";
import { useRouter } from 'next/navigation';
import styles from './Login.module.scss';

import { api } from '../../api/api';
import { useState, useEffect, useRef } from 'react';
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

    // ─── Forgot password modal (step 1) ─────────────────────────────────────
    const [forgotOpen, setForgotOpen] = useState<boolean>(false);
    const [forgotPhone, setForgotPhone] = useState<string>('');
    const [forgotError, setForgotError] = useState<string | null>(null);
    const [forgotLoading, setForgotLoading] = useState<boolean>(false);

    // ─── SMS verification modal (step 2) ─────────────────────────────────────
    const [smsOpen, setSmsOpen] = useState<boolean>(false);
    const [smsCode, setSmsCode] = useState<string>('');
    const [smsError, setSmsError] = useState<string | null>(null);
    const [smsLoading, setSmsLoading] = useState<boolean>(false);
    const [countdown, setCountdown] = useState<number>(60);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // ─── New password modal (step 3) ─────────────────────────────────────
    const [newPassOpen, setNewPassOpen] = useState<boolean>(false);
    const [newPass, setNewPass] = useState<string>('');
    const [confirmPass, setConfirmPass] = useState<string>('');
    const [newPassError, setNewPassError] = useState<string | null>(null);
    const [newPassLoading, setNewPassLoading] = useState<boolean>(false);
    const [showNewPass, setShowNewPass] = useState<boolean>(false);
    const [showConfirmPass, setShowConfirmPass] = useState<boolean>(false);

    function startCountdown() {
        setCountdown(60);
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current!);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }

    useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

    function openForgot() {
        setForgotPhone('');
        setForgotError(null);
        setForgotOpen(true);
    }

    function closeForgot() {
        setForgotOpen(false);
    }

    function closeSms() {
        setSmsOpen(false);
        setSmsCode('');
        setSmsError(null);
        if (timerRef.current) clearInterval(timerRef.current);
    }

    function closeNewPass() {
        setNewPassOpen(false);
        setNewPass('');
        setConfirmPass('');
        setNewPassError(null);
        setShowNewPass(false);
        setShowConfirmPass(false);
    }

    function closeAll() {
        closeForgot();
        closeSms();
        closeNewPass();
    }

    async function handleForgotSubmit() {
        if (!forgotPhone.trim()) {
            setForgotError('Telefon raqamni kiriting');
            return;
        }

        const phone = '+' + forgotPhone.replace(/\D/g, '');

        setForgotLoading(true);
        setForgotError(null);
        try {
            await api.post('/auth/send-otp', { phone });
            setForgotOpen(false);
            setSmsCode('');
            setSmsError(null);
            setSmsOpen(true);
            startCountdown();
        } catch (err: any) {
            const msg = err.response?.data?.message || err.response?.data?.error;
            setForgotError(typeof msg === 'string' ? msg : "Xatolik yuz berdi. Qayta urinib ko'ring.");
        } finally {
            setForgotLoading(false);
        }
    }

    async function handleSmsSubmit() {
        if (!smsCode.trim()) {
            setSmsError('SMS kodni kiriting');
            return;
        }

        const phone = '+' + forgotPhone.replace(/\D/g, '');

        setSmsLoading(true);
        setSmsError(null);
        try {
            await api.post('/auth/verify-otp', { phone, otp: smsCode });
            closeSms();
            setNewPass('');
            setConfirmPass('');
            setNewPassError(null);
            setNewPassOpen(true);
        } catch (err: any) {
            const msg = err.response?.data?.message || err.response?.data?.error;
            setSmsError(typeof msg === 'string' ? msg : "Kod noto'g'ri yoki muddati o'tgan.");
        } finally {
            setSmsLoading(false);
        }
    }

    async function handleNewPassSubmit() {
        if (!newPass.trim()) {
            setNewPassError('Yangi parol kiritilishi shart');
            return;
        }
        if (newPass.length < 6) {
            setNewPassError('Parol kamida 6 ta belgidan iborat bo\'lishi kerak');
            return;
        }
        if (newPass !== confirmPass) {
            setNewPassError('Parollar mos kelmaydi');
            return;
        }

        const phone = '+' + forgotPhone.replace(/\D/g, '');

        setNewPassLoading(true);
        setNewPassError(null);
        try {
            await api.put('/auth/change-password', { phone, password: newPass });
            closeAll();
            setSuccess('Parol muvaffaqiyatli o\'zgartirildi!');
        } catch (err: any) {
            const msg = err.response?.data?.message || err.response?.data?.error;
            setNewPassError(typeof msg === 'string' ? msg : "Xatolik yuz berdi. Qayta urinib ko'ring.");
        } finally {
            setNewPassLoading(false);
        }
    }

    async function handleResend() {
        if (countdown > 0) return;
        const phone = '+' + forgotPhone.replace(/\D/g, '');
        try {
            await api.post('/auth/send-otp', { phone });
            startCountdown();
            setSuccess("Kod qayta yuborildi");
        } catch (err: any) {
            const msg = err.response?.data?.message || err.response?.data?.error;
            setSmsError(typeof msg === 'string' ? msg : "Xatolik yuz berdi.");
        }
    }

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
                const role = res.data?.role || res.data?.data?.role || 'STUDENT'; // default to STUDENT if not provided

                if (auth) {
                    localStorage.setItem("accessToken", auth);
                    localStorage.setItem("userRole", role);
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

                        {/* Forgot password link */}
                        <div className={styles.forgotPassword}>
                            <button
                                type="button"
                                className={styles.forgotPasswordLink}
                                onClick={openForgot}
                            >
                                Parolni unutdingizmi?
                            </button>
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

            {/* ─── Step 1: Parolni tiklash ────────────────────────────────── */}
            {forgotOpen && (
                <div className={styles.modalOverlay} onClick={closeForgot}>
                    <div className={styles.modalBox} onClick={e => e.stopPropagation()}>
                        <h3 className={styles.modalTitle}>Parolni tiklash</h3>
                        <p className={styles.modalDesc}>
                            Tizimda ro'yxatdan o'tgan telefon raqamingizni kiriting. Biz
                            sizga tasdiqlash kodini yuboramiz.
                        </p>

                        <div className={styles.modalField}>
                            <label className={styles.modalLabel} htmlFor="forgot-phone">
                                Telefon raqam
                            </label>
                            <input
                                id="forgot-phone"
                                type="text"
                                placeholder="998XXXXXXXXX"
                                value={forgotPhone}
                                onChange={e => { setForgotPhone(e.target.value); setForgotError(null); }}
                                className={`${styles.modalInput} ${forgotError ? styles.modalInputError : ''}`}
                                autoFocus
                            />
                            {forgotError && (
                                <span className={styles.modalError}>{forgotError}</span>
                            )}
                        </div>

                        <div className={styles.modalActions}>
                            <button
                                type="button"
                                className={styles.modalCancelBtn}
                                onClick={closeForgot}
                                disabled={forgotLoading}
                            >
                                Bekor qilish
                            </button>
                            <button
                                type="button"
                                className={styles.modalSendBtn}
                                onClick={handleForgotSubmit}
                                disabled={forgotLoading}
                            >
                                {forgotLoading ? (
                                    <CircularProgress size={14} color="inherit" sx={{ mr: 0.8 }} />
                                ) : null}
                                Kodni yuborish
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── Step 2: SMS kodni tasdiqlash ───────────────────────────── */}
            {smsOpen && (
                <div className={styles.modalOverlay} onClick={closeAll}>
                    <div className={styles.modalBox} onClick={e => e.stopPropagation()}>
                        <h3 className={styles.modalTitle}>SMS kodni tasdiqlash</h3>
                        <p className={styles.modalDesc}>
                            Tasdiqlash kodi quyidagi raqamga yuborildi:{' '}
                            <strong>{forgotPhone}</strong>{' '}
                            <button
                                type="button"
                                className={styles.changePhoneBtn}
                                onClick={() => { closeSms(); setForgotOpen(true); }}
                            >
                                O'zgartirish
                            </button>
                        </p>

                        <div className={styles.modalField}>
                            <input
                                id="sms-code"
                                type="text"
                                placeholder="SMS Kodi"
                                value={smsCode}
                                onChange={e => { setSmsCode(e.target.value); setSmsError(null); }}
                                className={`${styles.modalInput} ${smsError ? styles.modalInputError : ''}`}
                                autoFocus
                                maxLength={6}
                            />
                            {smsError && (
                                <span className={styles.modalError}>{smsError}</span>
                            )}
                        </div>

                        <div className={styles.resendRow}>
                            <span className={styles.resendText}>
                                Kodni qayta yuborish:{' '}
                                <button
                                    type="button"
                                    className={`${styles.resendBtn} ${countdown > 0 ? styles.resendDisabled : ''}`}
                                    onClick={handleResend}
                                    disabled={countdown > 0}
                                >
                                    {countdown > 0 ? `${countdown} soniya` : 'Qayta yuborish'}
                                </button>
                            </span>
                        </div>

                        <div className={styles.modalActions}>
                            <button
                                type="button"
                                className={styles.modalCancelBtn}
                                onClick={closeAll}
                                disabled={smsLoading}
                            >
                                Bekor qilish
                            </button>
                            <button
                                type="button"
                                className={styles.modalSendBtn}
                                onClick={handleSmsSubmit}
                                disabled={smsLoading}
                            >
                                {smsLoading ? (
                                    <CircularProgress size={14} color="inherit" sx={{ mr: 0.8 }} />
                                ) : null}
                                Kodni tasdiqlash
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* ─── Step 3: Yangi parol o'rnatish ──────────────────────────── */}
            {newPassOpen && (
                <div className={styles.modalOverlay} onClick={closeAll}>
                    <div className={styles.modalBox} onClick={e => e.stopPropagation()}>
                        <h3 className={styles.modalTitle}>Yangi parol o'rnatish</h3>
                        <p className={styles.modalDesc}>
                            Hisobingiz uchun yangi xavfsiz parol kiriting.
                        </p>

                        <div className={styles.modalField}>
                            {/* New password */}
                            <div className={styles.newPassWrapper}>
                                <input
                                    id="new-password"
                                    type={showNewPass ? 'text' : 'password'}
                                    placeholder="Yangi parol"
                                    value={newPass}
                                    onChange={e => { setNewPass(e.target.value); setNewPassError(null); }}
                                    className={`${styles.modalInput} ${newPassError ? styles.modalInputError : ''}`}
                                    autoFocus
                                />
                                <span
                                    className={styles.newPassEye}
                                    onClick={() => setShowNewPass(p => !p)}
                                >
                                    {showNewPass ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                </span>
                            </div>

                            {/* Confirm password */}
                            <div className={styles.newPassWrapper}>
                                <input
                                    id="confirm-password"
                                    type={showConfirmPass ? 'text' : 'password'}
                                    placeholder="Parolni tasdiqlash"
                                    value={confirmPass}
                                    onChange={e => { setConfirmPass(e.target.value); setNewPassError(null); }}
                                    className={`${styles.modalInput} ${newPassError ? styles.modalInputError : ''}`}
                                />
                                <span
                                    className={styles.newPassEye}
                                    onClick={() => setShowConfirmPass(p => !p)}
                                >
                                    {showConfirmPass ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                </span>
                            </div>

                            {newPassError && (
                                <span className={styles.modalError}>{newPassError}</span>
                            )}
                        </div>

                        <div className={styles.modalActions}>
                            <button
                                type="button"
                                className={styles.modalCancelBtn}
                                onClick={closeAll}
                                disabled={newPassLoading}
                            >
                                Bekor qilish
                            </button>
                            <button
                                type="button"
                                className={styles.modalSendBtn}
                                onClick={handleNewPassSubmit}
                                disabled={newPassLoading}
                            >
                                {newPassLoading ? (
                                    <CircularProgress size={14} color="inherit" sx={{ mr: 0.8 }} />
                                ) : null}
                                Parolni saqlash
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}