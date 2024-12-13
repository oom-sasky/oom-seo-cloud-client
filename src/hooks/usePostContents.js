/**
 * Custom Hook to Fetch Post Contents
 *
 * This hook retrieves a list of post contents from a given API endpoint. It manages loading, error, and the posts data states. 
 * The hook makes an asynchronous request to fetch post contents from the API and returns the data, loading state, and any errors that occur.
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
 * const { posts, loading, error } = usePostContents(headers);
 * // `posts` will contain the list of fetched posts.
 * // `loading` is `true` while fetching data.
 * // `error` will contain any error message if the request fails.
 */

import { useState, useEffect } from 'react';
import axios from 'axios';

const usePostContents = (headers) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPostContents = async () => {
            const endPointPostContents = process.env.REACT_APP_OOM_SEO_API_POST_CONTENT;
            setLoading(true);
            try {
                const response = await axios.get(endPointPostContents, { headers });
                setPosts(response.data.posts);
            } catch (err) {
                setError('Error retrieving post contents');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPostContents();
    }, [headers]);


    return { posts, loading, error };
};

export default usePostContents;
