import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthHeaders } from '../../context/AuthContext';  // Custom hook for headers
import useProject from '../../hooks/useProject';  // Custom hook to fetch project data
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material'; // Import MUI Select components
import "../../assets/css/Traffic.css";
const googleAnalyticsIcon = '/assets/img/google-analytics-icon.svg';

export default function Traffic({ id }) {
    const headers = useAuthHeaders();  // Fetch headers with authorization
    const { project } = useProject(id, headers);  // Fetch project details by ID

    const [loading, setLoading] = useState(false);
    const [accountSummary, setAccountSummary] = useState(null);
    const [selectedAccount, setSelectedAccount] = useState('');
    const [selectedProperty, setSelectedProperty] = useState('');
    const [error, setError] = useState(null);
    const [authUrl, setAuthUrl] = useState('');

      // Handle account selection
    const handleAccountChange = (event) => {
        setSelectedAccount(event.target.value);
        setSelectedProperty(''); // Reset property selection when account changes
    };

    // Handle property selection
    const handlePropertyChange = (event) => {
        setSelectedProperty(event.target.value);
    };

    const handleAuthRequest = async () => {
        try {
            const endPointGoogleAnalyticsAuth = process.env.REACT_APP_OOM_SEO_API_GOOGLE_ANALYTICS_AUTH;
            const response = await axios.get(endPointGoogleAnalyticsAuth, {
                params: { project_id: id },
                headers: headers,
            });
            setAuthUrl(response.data.url);
        } catch (error) {
            console.error('Error Google sign-in:', error);
        }
    };

    useEffect(() => {
        fetchAccountSummaries();
    }, []);

    //   // Step 1: Request Google Analytics authorization URL
      const handleGoogleSignIn = async () => {
        setLoading(true);
        setError(null); // Reset any previous errors

        try {
          const endPointGoogleAnalyticsAuth = process.env.REACT_APP_OOM_SEO_API_GOOGLE_ANALYTICS_AUTH;
          const response = await axios.get(endPointGoogleAnalyticsAuth, {
            params: { project_id: id },
            headers: headers,
          });

          const { url } = response.data;

          // Step 2: Open the Google sign-in popup
          const width = 600;
          const height = 800;
          const left = (window.innerWidth / 2) - (width / 2);
          const top = (window.innerHeight / 2) - (height / 2);

          const popup = window.open(url, 'googleSignIn', `width=${width},height=${height},top=${top},left=${left}`);

          console.log(popup);

          // Step 3: Listen for the message when the sign-in is complete
          const handleMessage = (event) => {
            console.log(event);
            if (event.origin !== window.location.origin) return; // Ignore messages from other origins

            if (event.data === 'googleSignInComplete') {
              alert('Google sign-in completed.');

              // Fetch account summaries after successful Google sign-in
              fetchAccountSummaries();

              // Close the event listener after successful sign-in
              window.removeEventListener('message', handleMessage);
            }
          };

          window.addEventListener('message', handleMessage);
        } catch (error) {
          console.error('Error Google sign-in:', error);
          setLoading(false);
          setError('There was an error with Google sign-in.');
        }
      };

    // Step 4: Fetch Google Analytics account summaries
    const fetchAccountSummaries = async () => {
        setLoading(true);
        try {
            const endPointAccountSummaries = process.env.REACT_APP_OOM_SEO_API_GOOGLE_ANALYTICS_ACCOUNTS;
            const response = await axios.get(endPointAccountSummaries, {
                headers: headers,
            });

            console.log(response);

            if (response.data.status === 200) {
                setAccountSummary(response.data.accounts);
            } else {
                setError('No accounts found.');
            }
        } catch (error) {
            console.error('Error fetching account summaries:', error);
            setError('There was an error fetching account summaries.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <React.Fragment>
            <div className="oom-page-attributes breadcrumb analytics-traffic">
                <p className="oom-page-attributes_breadcrumb">Analytics & Traffic</p>
                <p className="oom-page-attributes_title">
                    Analytics & Traffic / <span className="highlight">{project.projectName}</span>
                </p>
            </div>

            <div className="oom-sign-in-form">
                <div className="oom-sign-in-form-container">
                    <span className="oom-form_title">Connect Statistics and Analytics Services</span>
                    <button onClick={handleGoogleSignIn} title="Connect Google Analytics" className="oom-button plain">
                        <img className="img-icon" src={googleAnalyticsIcon} alt="Google Analytics Icon" />
                        <span className="text">Connect Google Analytics</span>
                    </button>

                    {authUrl && (
                        <div>
                            <p>Please visit the following link to authenticate:</p>
                            <a href={authUrl} target="_blank" rel="noopener noreferrer">
                                {authUrl}
                            </a>
                        </div>
                    )}
                </div>
            </div>

            {loading && <p>Loading...</p>}

            {accountSummary && (
                <div className="account-summary">
                    <h3>Google Analytics Accounts</h3>

                    {/* Account Dropdown */}
                    <FormControl fullWidth>
                        <InputLabel id="account-select-label">Select Account</InputLabel>
                        <Select
                            labelId="account-select-label"
                            value={selectedAccount}
                            onChange={handleAccountChange}
                            label="Select Account"
                        >
                            {accountSummary.map((account) => (
                                <MenuItem key={account.accountId} value={account.accountId}>
                                    {account.displayName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {selectedAccount && (
                        <div>
                            <h4>Properties</h4>

                            {/* Property Dropdown */}
                            <FormControl fullWidth>
                                <InputLabel id="property-select-label">Select Property</InputLabel>
                                <Select
                                    labelId="property-select-label"
                                    value={selectedProperty}
                                    onChange={handlePropertyChange}
                                    label="Select Property"
                                >
                                    {accountSummary
                                        .find(account => account.accountId === selectedAccount)
                                        ?.properties.map((property, idx) => (
                                            <MenuItem key={idx} value={property.property.property}>
                                                {property.property.displayName}
                                            </MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        </div>
                    )}
                </div>
            )}
        </React.Fragment>
    );
}
