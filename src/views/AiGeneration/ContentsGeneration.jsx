/**
 * Contents Generation
 *
 * @since 1.0.0
 *
 * @package OOmAISEOTools
 * @author  OOm Developer (oom_ss)
 */


import React, {} from 'react';
import { useAuthHeaders } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import usePostContents from '../../hooks/usePostContents';
import { formatDate } from '../../utils/formatDate';

export default function ContentsGeneration() {
    const navigate = useNavigate();
    const headers = useAuthHeaders();
    const { posts } = usePostContents(headers);

    const handleCreateNew = () => {
        navigate('/ai-generation/new/');
    };

    return (
        <React.Fragment>
            <div className='oom-page-attributes breadcrumb ai-generation'>
                <p className="oom-page-attributes_breadcrumb">AI Generation / <span className="highlight">Contents</span></p>
                <p className="oom-page-attributes_title">
                    AI Generation <span className="highlight">/ Contents</span>
                </p>
            </div>

            <div className="oom-page-results projects">
                <div className='oom-page-results__details'>
                    <div className="oom-page-results__details_heading">
                        <div className='oom-page-results__details_heading_button'>
                            <button onClick={handleCreateNew} title="Create New Content" className='oom-button plain'>
                                <span className='text'><AddIcon sx={{ fontSize: 14 }} /> Create New Content</span>
                            </button>
                        </div>
                    </div>

                    <div className="oom-page-results__details_results">
                        <div className="oom-page-results__details_results_heading">
                            <span>List of Contents</span>
                        </div>

                        <table className="oom-page-results__details_results_table">
                            <thead className="oom-page-results__details_results_table_heading">
                                <tr>
                                    <th className="oom-page-results__details_results_table_heading_item oom-column-30">
                                        <span>Content Name</span>
                                    </th>
                                    <th className="oom-page-results__details_results_table_heading_item oom-column-20">
                                        <span>Project</span>
                                    </th>
                                    <th className="oom-page-results__details_results_table_heading_item oom-column-20">
                                        <span>Created by</span>
                                    </th>
                                    <th className="oom-page-results__details_results_table_heading_item oom-column-20">
                                        <span>Date Created</span>
                                    </th>
                                    <th className="oom-page-results__details_results_table_heading_item oom-column-10">
                                        <span>Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="oom-page-results__details_results_items">
                            {posts.length > 0 ? (
                                    posts.map((post, index) => (
                                        <tr className="oom-page-results__details_results_table_item" key={index}>
                                            <td className='column-item oom-column-30'>
                                                <div className='project'>
                                                    <a href={post._id} className="link-underline"><span>{post.postName}</span></a>
                                                </div>
                                            </td>
                                            <td className='column-item oom-column-20'>
                                                <div className='project'>
                                                    <a href={`/projects/${post.projectId._id}`} className="link-underline"><span>{post.projectId.projectName}</span></a>
                                                </div>
                                            </td>
                                            <td className='column-item oom-column-20'>
                                                <div className='created-by'>
                                                    <span>{post.createdBy.displayName}</span>
                                                </div>
                                            </td>
                                            <td className='column-item oom-column-20'>
                                                <div className='created-at'>
                                                    <span>{formatDate(post.createdAt)}</span>
                                                </div>
                                            </td>
                                            <td className='column-item oom-column-10'>
                                                <div className='actions'>
                                                    <span></span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="no-found"><p>No contents found</p></td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                    </div>
                </div>
            </div>
          
        </React.Fragment>
    );
}