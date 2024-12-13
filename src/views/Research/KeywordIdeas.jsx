/**
 * Keyword Ideas
 *
 * @since 1.0.0
 *
 * @package OOmAISEOTools
 * @author  OOm Developer (oom_ss)
 */


import React, {} from 'react';
// import { useLocation } from 'react-router-dom';
// import axios from 'axios';
import "../../assets/css/KeywordIdeas.css";


export default function KeywordIdeas() {
    // const keywordIdeasEndpoint = process.env.REACT_APP_OOM_SEO_API_KEYWORD_IDEAS;
    // const location = useLocation();
    // const queryParams = new URLSearchParams(location.search);
    // const keywords = queryParams.get('keywords');  // Get 'keywords' value
    // const locations = queryParams.get('locations');  // Get 'locations' value
    // const startWith = queryParams.get('start_with');  // Get 'start_with' value
    // const useType = queryParams.get('use_type');  // Get 'use_type' value
    // const siteUrl = queryParams.get('site_url');  // Get 'site_url' value

    // const getKeywordIdeas = async () => {
    //     console.log('fire b');
    //     const params = new URLSearchParams({
    //         keywords: keywords,
    //         locations: locations,
    //         start_with: startWith,
    //         use_type: useType,
    //         site_url: siteUrl,
    //     });
    //     const response = await axios.get(`${keywordIdeasEndpoint}?${params.toString()}`);
    //     console.log(response.data);
    // };

    // useEffect(() => {
    //     getKeywordIdeas();
    // }, []);

    return (
        <React.Fragment>
            <div className="oom-page-attributes breadcrumb keyword-ideas">
                <p className="oom-page-attributes_breadcrumb">Research / <span className="highlight">Keyword Planner</span></p>
                <p className="oom-page-attributes_title">
                    Keyword Planner <span className="highlight">/ Company A</span>
                </p>
            </div>

            <div className='oom-page-results keyword-ideas'>
                <div className='oom-page-results__navigation'>
                </div>
                <div className='oom-page-results__details'>
                    <div className='oom-page-results__details_heading'>
                        <span>Keywords Ideas</span>
                    </div>

                    <table className='oom-page-results__details_table'>
                        <thead className='oom-page-results__details_table_heading'>
                            <tr>
                                <th className='oom-page-results__details_table_heading_item oom-column-40'><span>Keywords</span></th>
                                <th className='oom-page-results__details_table_heading_item oom-column-20'><span>Search Vol.</span></th>
                                <th className='oom-page-results__details_table_heading_item oom-column-20'><span>CPC</span></th>
                                <th className='oom-page-results__details_table_heading_item oom-column-20'><span>Competition</span></th>
                            </tr>
                        </thead>
                        <tbody className='oom-page-results__details_items'>
                            <tr className='oom-page-results__details_table_item'>
                                <td className='column-item checkbox oom-column-40'>
                                    <input type="checkbox"/>
                                    <span>digital marketing</span>
                                </td>

                                <td className='column-item oom-column-20'>
                                    <span>200</span>
                                </td>

                                <td className='column-item oom-column-20'>
                                    <span>$2.90</span>
                                </td>
                                <td className='column-item oom-column-20'>
                                    <span>MEDIUM</span>
                                </td>
                            </tr>

                            <tr className='oom-page-results__details_table_item'>
                                <td className='column-item checkbox oom-column-40'>
                                    <input type="checkbox"/>
                                    <span>digital marketing</span>
                                </td>

                                <td className='column-item oom-column-20'>
                                    <span>200</span>
                                </td>

                                <td className='column-item oom-column-20'>
                                    <span>$2.90</span>
                                </td>
                                <td className='column-item oom-column-20'>
                                    <span>MEDIUM</span>
                                </td>
                            </tr>

                            <tr className='oom-page-results__details_table_item'>
                                <td className='column-item checkbox oom-column-40'>
                                    <input type="checkbox"/>
                                    <span>digital marketing</span>
                                </td>

                                <td className='column-item oom-column-20'>
                                    <span>200</span>
                                </td>

                                <td className='column-item oom-column-20'>
                                    <span>$2.90</span>
                                </td>
                                <td className='column-item oom-column-20'>
                                    <span>MEDIUM</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </React.Fragment>
    );
};