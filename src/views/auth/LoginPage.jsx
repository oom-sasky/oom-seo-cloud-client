import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CryptoJS from 'crypto-js';
import styles from './LoginRegister.module.css';

const SALT_kEY = "abc123";

export default function LoginPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        document.body.style.backgroundColor = '#2C81FF';
        return () => {
            document.body.style.backgroundColor = ''; 
        }
    }, []);

    useEffect(() => {
        const storedLogin = localStorage.getItem('remembered-login');
        const storedPassword = localStorage.getItem('remembered-password');
        
        if (storedLogin && storedPassword) {
            const decryptedLogin = decryptData(storedLogin);
            const decryptedPassword = decryptData(storedPassword);
            setLogin(decryptedLogin);
            setPassword(decryptedPassword);
            setRememberMe(true);
        }
    }, []);

    const encryptData = (password) => {
        return CryptoJS.AES.encrypt(password, SALT_kEY).toString();  // Encrypt password
    };

    const decryptData = (encryptedPassword) => {
        const bytes = CryptoJS.AES.decrypt(encryptedPassword, SALT_kEY);
        return bytes.toString(CryptoJS.enc.Utf8);  // Decrypt password
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!login || !password) {
            toast.error("Please enter your user login and password.");
            return;
        }

        const endPointUserLogin = process.env.REACT_APP_OOM_SEO_API_USER_LOGIN;
        setLoading(true);
        try {
            const response = await axios.post(endPointUserLogin, { login, password });
            toast.success("Login successful, please wait..");
            localStorage.setItem('oom-access-token', response.data.accessToken);
            localStorage.setItem('oom-refresh-token', response.data.refreshToken);

            if (rememberMe) {
                localStorage.setItem('remembered-login', encryptData(login));
                localStorage.setItem('remembered-password', encryptData(password));
            } else {
                localStorage.removeItem('remembered-login');
                localStorage.removeItem('remembered-password');
            }
            setTimeout(() => {
                navigate("/dashboard");
            }, 1000);
        } catch (err) {
            console.error('Error logging in', err);
            toast.error("Invalid Credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <React.Fragment>
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <div className={styles['oom-login-register']}>
                <div className={styles['oom-login-register__container']}>
                    <div className={`${styles['oom-login-register__row']} ${styles['heading']}`}>
                        <h2>Login</h2>
                    </div>

                    <div className={`${styles['oom-login-register__row']} ${styles['login']}`}>
                        <input
                            type="text"
                            className={styles['oom-field']}
                            placeholder="Username or Email"
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                        />
                    </div>

                    <div className={`${styles['oom-login-register__row']} ${styles['password']}`}>
                        <input
                            type={showPassword ? "text" : "password"}
                            className={styles['oom-field']}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <div
                            className={styles['password-visibility-icon']}
                            onClick={() => setShowPassword(!showPassword)} // Toggle visibility
                            title={showPassword ? "Hide Password" : "Show Password"}
                        >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </div>
                    </div>

                    <div className={`${styles['oom-login-register__row']} ${styles['remember-me']}`}>
                        <label className={styles['remember-me']}>
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={() => setRememberMe(!rememberMe)}
                            />
                            Remember Me
                        </label>
                    </div>

                    <div className={`${styles['oom-login-register__row']} ${styles.action}`}>
                        <button onClick={handleLogin} title="Login" disabled={loading}>{loading ? 'loading...' : 'Login'}</button>
                        <span className={styles['small-text']}>beta v1.0.0</span>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};