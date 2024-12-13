/**
 * Projects
 *
 * @since 1.0.0
 *
 * @package OOmAISEOTools
 * @author  OOm Developer (oom_ss)
 */


import React, { useEffect, useRef } from 'react';
import { useAuthHeaders } from '../../context/AuthContext';
import useProjects from '../../hooks/useProjects';
import useProject from '../../hooks/useProject';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { formatDate } from '../../utils/formatDate';
import AddIcon from '@mui/icons-material/Add';
import "../../assets/css/Projects.css";

export default function Projects({id}) {
    const navigate = useNavigate();
    const headers = useAuthHeaders();
    const { projects, error } = useProjects(headers);
    const { project } = useProject(id, headers);
    const toastRef = useRef(false);

    useEffect(() => {
        if (error && !toastRef.current) {
            toast.error(error);
        }
    }, [error]);

    const handleCreateNew = () => {
        navigate('/projects/new/');
    };

    return (
        <React.Fragment>
            <div className="oom-page-attributes breadcrumb">
                <p className="oom-page-attributes_breadcrumb">{id ? 'Project' : 'Projects' } / <span className="highlight">All Projects</span></p>
                <p className="oom-page-attributes_title">
                    Project / <a href="/projects/"><span className="highlight">All Projects</span></a> {id && (<>/ <span className="highlight">{project.projectName}</span></>)}
                </p>
            </div>

            {!id && (
            <div className="oom-page-results projects">
                <div className='oom-page-results__details'>
                    <div className="oom-page-results__details_heading">
                        <div className='oom-page-results__details_heading_button'>
                            <button onClick={handleCreateNew} title="Create New Content" className='oom-button plain'>
                                <span className="text"><AddIcon sx={{ fontSize: 14 }} /> Create New Project</span>
                            </button>
                        </div>
                    </div>

                    <div className="oom-page-results__details_results">
                        <div className="oom-page-results__details_results_heading">
                            <span>List of Projects</span>
                        </div>

                        <table className="oom-page-results__details_results_table">
                            <thead className="oom-page-results__details_results_table_heading">
                                <tr>
                                    <th className="oom-page-results__details_results_table_heading_item oom-column-30">
                                        <span>Project Name</span>
                                    </th>
                                    <th className="oom-page-results__details_results_table_heading_item oom-column-10">
                                        <span>Created by</span>
                                    </th>
                                    <th className="oom-page-results__details_results_table_heading_item oom-column-30">
                                        <span>Date Created</span>
                                    </th>
                                    <th className="oom-page-results__details_results_table_heading_item oom-column-20">
                                        <span>Assigned Users</span>
                                    </th>
                                    <th className="oom-page-results__details_results_table_heading_item oom-column-10">
                                        <span>Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="oom-page-results__details_results_items">
                                {projects.length > 0 ? (
                                    projects.map((project, index) => (
                                        <tr className="oom-page-results__details_results_table_item" key={index}>
                                            <td className='column-item oom-column-40'>
                                                <div className='project'>
                                                    <a href={project._id} className="link-underline"><span>{project.projectName}</span></a>
                                                </div>
                                            </td>
                                            <td className='column-item oom-column-10'>
                                                <div className='created-by'>
                                                    <span>{project.createdBy.displayName}</span>
                                                </div>
                                            </td>
                                            <td className='column-item oom-column-20'>
                                                <div className='created-at'>
                                                    <span>{formatDate(project.createdAt)}</span>
                                                </div>
                                            </td>
                                            <td className='column-item oom-column-20'>
                                                <div className='assigned-users'>
                                                    <span></span>
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
                                        <td colSpan={5} className="no-found"><p>No projects found</p></td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                    </div>
                </div>
            </div>
            )}

            {id && id !== "new" && project && (
            <div className="oom-page-results project-items">
                <a href={`/audit/results/${id}`} className="project-item">
                    <div className="item-type">
                        <span>Audit Reports </span>
                    </div>
                    <div className="item-records">
                        {/* <span>Chart </span>
                        <span>No. of Entries </span>
                        <span>20 </span> */}
                    </div>
                </a>

                <a href="/research/keywords-manager" className="project-item">
                    <div className="item-type">
                        <span>Keywords Manager </span>
                    </div>
                    <div className="item-records">
                        <span>Chart </span>
                        <span>No. of Entries </span>
                        <span>20 </span>
                    </div>
                </a>
               
                <a href="/ai-generation/contents" className="project-item">
                    <div className="item-type">
                        <span>Ai Generated <br/>Blog Contents</span>
                    </div>
                    <div className="item-records">
                        <span>Chart </span>
                        <span>No. of Entries </span>
                        <span>20 </span>
                    </div>
                </a>

                <a href={`/analytics-traffic/traffic/${id}`} className="project-item">
                    <div className="item-type">
                        <span>Analytics & Traffic</span>
                    </div>
                </a>
                
            </div>
            )}
        </React.Fragment>
    );
};