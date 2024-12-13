/**
 * Custom Hook to Fetch Projects Data
 *
 * This hook retrieves a list of projects from an API and handles loading, error, and project states. It makes an asynchronous request to fetch project details.
 * If the response indicates a lack of permissions, it will set the error state. Otherwise, it will return the list of projects.
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
 * const { projects, loading, error } = useProjects(headers);
 * // `projects` will contain the list of projects fetched from the API.
 * // `loading` is `true` while fetching data.
 * // `error` will contain any error message if the request fails or if there are no permissions.
 */

import { useState, useEffect } from 'react';
import axios from 'axios';

const useProjects = (headers) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            const endPointProjects = process.env.REACT_APP_OOM_SEO_API_PROJECTS;
            setLoading(true);
            try {
                const response = await axios.get(endPointProjects, { headers });
                setProjects(response);

                if(response.data.has_permission !== false) {
                    setProjects(response.data.projects);
                } else {
                    setProjects([]);
                    setError(response.data.message);
                }
            } catch (err) {
                setError('Error retrieving projects');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, [headers]);


    return { projects, loading, error };
};

export default useProjects;
