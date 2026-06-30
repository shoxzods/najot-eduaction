"use client";
import React, { useEffect, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import { toastManager, ToastOptions } from '../../../utils/toast';

export default function ToastProvider() {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState<ToastOptions>({ message: '', type: 'info' });

    useEffect(() => {
        toastManager.subscribe((newOptions) => {
            setOptions(newOptions);
            setOpen(true);
        });
    }, []);

    const handleClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') return;
        setOpen(false);
    };

    return (
        <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            sx={{ zIndex: 9999, top: '20px !important', right: '20px !important', width: 'calc(25vw - 40px)', maxWidth: '400px' }}
        >
            <MuiAlert
                onClose={handleClose}
                severity={options.type}
                elevation={6}
                variant="filled"
                sx={{
                    width: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    padding: '6px 12px',
                    paddingBottom: '10px',
                    fontSize: '13px',
                    alignItems: 'center',
                    backgroundColor: options.type === 'error' ? '#ef4444' : options.type === 'success' ? '#22c55e' : 'var(--primary)',
                    color: '#fff',
                    '& .MuiAlert-icon': {
                        fontSize: '18px',
                        marginRight: '8px',
                        color: '#fff'
                    },
                    '& .MuiAlert-message': {
                        padding: '4px 0',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '100%'
                    },
                    '& .MuiAlert-action': {
                        padding: '0 0 0 8px',
                        marginRight: '-4px'
                    }
                }}
            >
                {options.message}
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        height: '3px',
                        backgroundColor: 'rgba(255,255,255,0.5)',
                        animation: open ? 'shrink 6s linear forwards' : 'none',
                        '@keyframes shrink': {
                            '0%': { width: '100%' },
                            '100%': { width: '0%' }
                        }
                    }}
                />
            </MuiAlert>
        </Snackbar>
    );
}
