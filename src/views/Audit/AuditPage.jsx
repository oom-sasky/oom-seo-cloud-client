/**
 * Audit Page
 *
 * @since 1.0.0
 *
 * @package OOmAISEOTools
 * @author  OOm Developer (oom_ss)
 */

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { useAuthHeaders } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const endPointServer = process.env.REACT_APP_OOM_SEO_API_SERVER;
const socket = io(`${endPointServer}`);

export default function AuditPage() {
    const [clientUrl, setClientUrl] = useState('');
    const [clientName, setClientName] = useState('');
    const [messages, setMessages] = useState([]);
    const [isScanning, setIsScanning] = useState(false);
    const [socketId, setSocketId] = useState('');
    const navigate = useNavigate();
    const headers = useAuthHeaders();

    useEffect(() => {
        socket.on('connect', () => {
            setSocketId(socket.id);
            console.log('Connected to socket with ID:', socket.id); // Log the socket ID
        });

        // Listeners for messages specific to this socket
        socket.on('startScanning', (data) => {
            console.log('start');
            console.log(data);
            if (data.socketId === socket.id) {
                setMessages((prev) => [...prev, data.message]);
                setIsScanning(true);
            }
        });

        // Listeners for messages specific to this socket
        socket.on('urlsSaved', (data) => {
            console.log(data);
            if (data.socketId === socket.id) {
                setMessages((prev) => [...prev, data.message]);
                setIsScanning(true);
            }
        });

        socket.on('fetchedPageData', (data) => {
            if (data.socketId === socket.id) {
                setMessages((prev) => [...prev, `${data.message}`]);
            }
        });

        socket.on('scanCompleted', (data) => {
            console.log(data);
            if (data.socketId === socket.id) {
                setMessages((prev) => [...prev, data.message]);
                setIsScanning(false);
                navigate(`/audit/results/${data.projectId}`);
            }
        });

        return () => {
            socket.off('startScanning');
            socket.off('urlsSaved');
            socket.off('fetchedPageData');
            socket.off('scanCompleted');
        };
    }, [navigate]);

    const handleScan = async () => {
        if (!clientUrl) {
            toast.error("Please enter a URL to scan");
            return;
        }
        console.log('Attempting to scan URL:', clientUrl); // Log the URL
        console.log('Using Socket ID:', socketId); // Log the socket ID
        setIsScanning(true);
        setMessages([]);

        const refreshToken = localStorage.getItem('oom-refresh-token');

        try {
            const endPointAudit = process.env.REACT_APP_OOM_SEO_API_AUDIT_WEBSITE;
            const response = await axios.post(
                `${endPointAudit}`,
                {
                    client_url: clientUrl,
                    client_name: clientName,
                    socket_id: socketId,

                },
                { headers }
            );

            if (response.data && response.status === 200) {
                console.log('Response from server:', response.data);
                setMessages((prev) => [...prev, 'Scanning started...']);
            }

        } catch (error) {
            console.error('Error starting scan:', error);
            if (error.response && error.response.status === 401) {
                // Handle expired token: Try refreshing the token
                const newAccessToken = await refreshAccessToken(refreshToken);
                if (newAccessToken) {
                    // Retry the original request with the new access token
                    return handleScan(); // Recursive call to retry scan
                } else {
                    setMessages((prev) => [...prev, 'Session expired, please log in again.']);
                    navigate('/login');  // Redirect to login page
                }
            } else {
                setMessages((prev) => [...prev, 'Error starting scan']);
            }
        }
    };

    const refreshAccessToken = async (refreshToken) => {
        try {
            const endPointRefreshToken = process.env.REACT_APP_OOM_SEO_API_USER_REFRESH_TOKEN;
            const response = await axios.post(
                `${endPointRefreshToken}`,
                { refresh_token: refreshToken }
            );
            const newAccessToken = response.data.accessToken;
            if (newAccessToken) {
                localStorage.setItem('oom-access-token', newAccessToken);  // Store the new access token
                return newAccessToken;
            }
        } catch (error) {
            console.error('Error refreshing token:', error);
            return null;
        }
    };

    return (
        <React.Fragment>
            <div className="oom-page-attributes breadcrumb audit">
                <p className="oom-page-attributes_breadcrumb">Website Audit</p>
                <p className="oom-page-attributes_title">
                    Website Audit <span className="highlight">/ New Audit</span>
                </p>
            </div>

            <div className="oom-form_box">
                <p className="oom-form_title">Client Details</p>
                <div className="oom-form">
                    <input
                        type="text"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Client Name"
                        disabled={isScanning}
                        style={{ marginRight: '10px' }}
                    />
                    <input
                        type="text"
                        value={clientUrl}
                        onChange={(e) => setClientUrl(e.target.value)}
                        placeholder="Enter URL to scan"
                        disabled={isScanning}
                        style={{ marginRight: '10px' }}
                    />
                    <input type="text" id="industry_type" name="industry_type" placeholder="Industry" />
                    <input type="text" id="client_description" name="client_description" placeholder="Description" />
                    <button onClick={handleScan} title="Audit" className='oom-button oom-btn-loader action' disabled={isScanning}>
                        {isScanning ? 'Scanning...' : 'Audit'}
                    </button>
                </div>

                <div className="oom-audit-progress">
                    <ul>
                        {messages.map((msg, index) => (
                            <li key={index}>{msg}</li>
                        ))}
                    </ul>
                </div>

            </div>
        </React.Fragment>
    );
}