import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthHeaders } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';
import useProject from '../../hooks/useProject';
import { toast } from 'react-toastify';

import { Select, MenuItem, FormControl, InputLabel, Button } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs'

import CheckIcon from '@mui/icons-material/Check';

import CustomPagination from '../../components/widgets/CustomPagination';
import { capitalizeString } from '../../utils/capitalizeString';
import { formatNumber } from '../../utils/formatNumber';

import "../../assets/css/Traffic.css";
const googleAnalyticsIcon = '/assets/img/google-analytics-icon.svg';

export default function Traffic({ subpage, id }) {
    const location = useLocation();
    const headers = useAuthHeaders();
    const { project } = useProject(id, headers);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [connected, setConnected] = useState(false);
    const [accountSummary, setAccountSummary] = useState(null);
    const [dataPagesScreens, setDataPagesScreens] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState('');
    const [selectedProperty, setSelectedProperty] = useState('');
    const [code, setCode] = useState(null);

    const defaultStartDate = dayjs().subtract(28, 'days').toDate();
    const defaultEndDate = dayjs().subtract(1, 'days').toDate();

    const [startDate, setStartDate] = useState(defaultStartDate);
    const [endDate, setEndDate] = useState(defaultEndDate);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalResults = dataPagesScreens.length;
    const totalPages = Math.ceil(totalResults / itemsPerPage);

    const paginateData = (data) => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return data.slice(startIndex, endIndex);
    };

    useEffect(() => {

        if (project.googleAnalytics && project.googleAnalytics.property) {
            setConnected(true);
        }

        const fetchdataAnalyticsPageScreens = async () => {
            setLoading(true);
            setDataPagesScreens([]);
            try {
                const endPointGoogleAnalyticsDataPagesScreens = process.env.REACT_APP_OOM_SEO_API_GOOGLE_ANALYTICS_DATA;
                const response = await axios.get(`${endPointGoogleAnalyticsDataPagesScreens}/${id}`, {
                    params: {
                        from_date: dayjs(startDate).format('YYYY-MM-DD'),
                        to_date: dayjs(endDate).format('YYYY-MM-DD'),
                    },
                    headers: headers,
                });


                if (response.data.status === 200) {
                    if (response.data.data_pages_screens <= 0) {
                        setError(response.data.message);
                    }
                    setDataPagesScreens(response.data.data_pages_screens);
                    setCurrentPage(1);
                } else {
                    toast.error("No data found");
                }
            } catch (error) {
                console.error('Error retrieving data reports:', error);
                toast.error("There was an error retrieving data reports");
            } finally {
                setLoading(false);
            }
        };

        if (project.googleAnalytics && project.googleAnalytics.property) {
            fetchdataAnalyticsPageScreens();
        }
    }, [id, project, headers, code, startDate, endDate]);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const codeParam = queryParams.get('code');
        if (codeParam) {
            setCode(codeParam);
        }
    }, [location]);

    useEffect(() => {
        const fetchAccountSummaries = async () => {
            setLoading(true);
            try {
                const endPointAccountSummaries = process.env.REACT_APP_OOM_SEO_API_GOOGLE_ANALYTICS_ACCOUNTS;
                const response = await axios.get(`${endPointAccountSummaries}/${id}`, {
                    headers: headers,
                });
                if (response.data.status === 200) {
                    setAccountSummary(response.data.accounts);
                } else {
                    toast.error("No accounts found");
                }
            } catch (error) {
                console.error('Error retrieving account summaries:', error);
                toast.error("There was an error retrieving account summaries");
            } finally {
                setLoading(false);
            }
        };
        if (code) {
            fetchAccountSummaries();
        }
    }, [id, headers, code]);

    const handleAccountChange = (e) => {
        setSelectedAccount(e.target.value);
        setSelectedProperty('');
    };

    const handlePropertyChange = (e) => {
        setSelectedProperty(e.target.value);
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            const endPointGoogleAnalyticsAuth = process.env.REACT_APP_OOM_SEO_API_GOOGLE_ANALYTICS_AUTH;
            const response = await axios.get(endPointGoogleAnalyticsAuth, {
                params: { id },
                headers: headers,
            });
            const { url } = response.data;
            window.location.href = url;
        } catch (error) {
            console.error('Error during Google sign-in:', error);
            setLoading(false);
            toast.error("Error during Google sign-in");
        }
    };

    const handleSaveConnect = async (e) => {
        e.preventDefault();

        if (selectedAccount === "") {
            toast.error("Please select account");
            return;
        }

        if (selectedProperty === "") {
            toast.error("Please select property");
            return;
        }

        setConnected(false);
        try {
            const selectedAccountName = accountSummary.find(account => account.accountId === selectedAccount)?.displayName;
            const selectedPropertyName = accountSummary
                .find(account => account.accountId === selectedAccount)
                ?.properties.find(property => property.property.property === selectedProperty)?.property.displayName;

            const endPointGoogleAnalytics = process.env.REACT_APP_OOM_SEO_API_GOOGLE_ANALYTICS;
            const response = await axios.put(`${endPointGoogleAnalytics}/${id}`,
                {
                    account: selectedAccount,
                    account_name: selectedAccountName,
                    property: selectedProperty,
                    property_name: selectedPropertyName
                },
                {
                    headers: headers,
                }
            );
            if (response.data && response.status === 200) {
                toast.success("Connected Successfully");
                setConnected(true);
            }
        } catch (error) {
            console.log("Error saving google account:", error);
            toast.error("Error saving Google account");
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <React.Fragment>
            <div className="oom-page-attributes breadcrumb analytics-traffic">
                <p className="oom-page-attributes_breadcrumb">Analytics & Traffic</p>
                <p className="oom-page-attributes_title">
                    Analytics & Traffic / {capitalizeString(subpage)} / <span className="highlight">{project.projectName}</span>
                </p>
            </div>

            {project.googleAnalytics && project.googleAnalytics.property && (
                <div className="oom-page-filter">
                    <div className="dates-filter">
                        <div className="dates-range">
                            <div className="dates-filter-label">
                                <label>Last 28 days:</label>
                            </div>

                            <div className="dates-filter-range">
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <div className="dates-range-from">
                                        <DatePicker
                                            className="oom-datepicker-field"
                                            label=""
                                            defaultValue={dayjs(startDate)}
                                            selected={startDate}
                                            onChange={(date) => setStartDate(date)}
                                        />
                                    </div>
                                    <div className="dates-range-to">
                                        <DatePicker
                                            className="oom-datepicker-field"
                                            label="To"
                                            defaultValue={dayjs(endDate)}
                                            selected={endDate}
                                            onChange={(date) => setEndDate(date)}
                                        />
                                    </div>
                                </LocalizationProvider>
                            </div>
                        </div>
                    </div>

                    <div className="connections-button">
                        <br />
                        <button title="Connected Google Analytics" className="oom-button plain active">
                            <CheckIcon sx={{ fontSize: 14 }} />
                            {project.googleAnalytics?.property?.propertyName?.trim() && (
                                <span className="text">
                                    Google Analytics ({project.googleAnalytics.property.propertyName})
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {project.googleAnalytics && project.googleAnalytics.property && (
                <div className="oom-page-results traffic">
                    <div className='oom-page-results__details'>
                        <div className="oom-page-results__details_results">
                            <div className="oom-page-results__details_results_heading">
                                <span>Pages and screens: Page path and screen class</span>
                            </div>

                            <table className="oom-page-results__details_results_table">
                                <thead className="oom-page-results__details_results_table_heading">
                                    <tr>
                                        <th className="oom-page-results__details_results_table_heading_item oom-column-5">
                                            <span>Page No.</span>
                                        </th>
                                        <th className="oom-page-results__details_results_table_heading_item oom-column-40">
                                            <span>Page Title</span>
                                        </th>
                                        <th className="oom-page-results__details_results_table_heading_item oom-column-15">
                                            <span>Page Views</span>
                                        </th>
                                        <th className="oom-page-results__details_results_table_heading_item oom-column-20">
                                            <span>Active Users</span>
                                        </th>
                                        <th className="oom-page-results__details_results_table_heading_item oom-column-20">
                                            <span>Views Per User</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="oom-page-results__details_results_items">
                                    {dataPagesScreens.length > 0 ? (
                                        paginateData(dataPagesScreens).map((data) => (
                                            <tr className="oom-page-results__details_results_table_item" key={data.index}>
                                                <td className='column-item oom-column-5'>
                                                    <div className='page-no'>
                                                        <span>{data.index + 1}</span>
                                                    </div>
                                                </td>
                                                <td className='column-item oom-column-40'>
                                                    <div className='page-name'>
                                                        <a href="/" className="link-underline"><span>{data.pageTitle}</span></a>
                                                    </div>
                                                </td>
                                                <td className='column-item oom-column-15'>
                                                    <div className='page-views'>
                                                        <span>{formatNumber(data.screenPageViews)}</span>
                                                    </div>
                                                </td>
                                                <td className='column-item oom-column-20'>
                                                    <div className='active-users'>
                                                        <span>{formatNumber(data.activeUsers)}</span>
                                                    </div>
                                                </td>
                                                <td className='column-item oom-column-20'>
                                                    <div className='views-per-user'>
                                                        <span>{parseFloat(data.viewsPerUser).toFixed(2)}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="no-found">
                                                <p>
                                                    {!loading ? (
                                                        <span>{error ? error : 'Connect your Google Analytics to start analyzing your site’s performance'}</span>
                                                    ) : (
                                                        <span className="ai-loader">
                                                            <span></span><span></span><span></span><span></span>
                                                        </span>
                                                    )}
                                                </p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            <div className='oom-page-results__pagination'>
                                {CustomPagination(currentPage, totalPages, handlePageChange)}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {!project.googleAnalytics && (
                <div className="oom-sign-in-form">
                    <div className="oom-sign-in-form-container">
                        {!code && (
                            <>
                                <span className="oom-form_title">Connect Statistics and Analytics Services</span>
                                {loading && (
                                    <div className='ai-loader'>
                                        <span></span><span></span><span></span><span></span>
                                    </div>
                                )}
                                <button onClick={handleGoogleSignIn} title="Connect Google Analytics" className="oom-button plain">
                                    <img className="img-icon" src={googleAnalyticsIcon} alt="Google Analytics Icon" />
                                    <span className="text">Connect Google Analytics</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}

            {code && accountSummary && !connected && (
                <div className="accounts-properties">
                    <div className="accounts-properties-container">
                        <div className="accounts">
                            <h3>Google Analytics Accounts</h3>

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
                        </div>

                        {selectedAccount && (
                            <div className="properties">
                                <h4>Properties</h4>

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

                                <Button
                                    type="submit"
                                    variant="contained"
                                    className="oom-button oom-btn-loader action"
                                    onClick={handleSaveConnect}
                                    style={{ marginTop: '16px' }}
                                >
                                    Save
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </React.Fragment>
    );
}
