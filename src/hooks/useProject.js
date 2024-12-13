/**
 * Custom Hook to Fetch Project Data
 *
 * This hook retrieves project data from the API based on a provided `project_id`. It handles loading, error, and project states. 
 * The hook makes an asynchronous request to fetch project details and returns the data, loading state, and any errors that occur.
 *
 * @since 1.0.0
 * @version 1.0.0
 *
 * @package OOmAISEOTools
 * @package react-hooks
 * 
 * @author OOm Developer (oom_ss)
 *
 * @example
 * const { project, loading, error } = useProject(project_id, headers);
 * // `project` will contain the fetched project data.
 * // `loading` is `true` while fetching data.
 * // `error` will contain any error message if the request fails.
 */

import { useState, useEffect } from 'react';
import axios from 'axios';

const useProject = (project_id, headers) => {
    const [project, setProject] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if(project_id && project_id !== "new") {
            const fetchProject = async () => {
                const endPointProject = process.env.REACT_APP_OOM_SEO_API_PROJECTS;
                setLoading(true);
                try {
                    const response = await axios.get(`${endPointProject}/${project_id}`, { headers });
                    setProject(response.data.project);
                } catch (err) {
                    setError('Error retrieving project');
                    console.error('Error:', err);
                } finally {
                    setLoading(false);
                }
            };
            fetchProject();
        }
    }, [project_id, headers]);

    return { project, loading, error };
};

export default useProject;
