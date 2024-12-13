/**
 * Custom Hook to Fetch Geo Target Constants
 *
 * This hook fetches geo-targeting constants from a given API endpoint. It handles loading, error, and successful data retrieval states.
 * The hook makes an asynchronous request to the geo-target constants API and returns the data along with the loading and error states.
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
 * const { geoTargetData, loading, error } = useGeoTargetConstants(headers);
 * // `geoTargetData` will contain the geo target constants when fetched.
 * // `loading` is true while the data is being fetched.
 * // `error` will contain any error message if the request fails.
 */

import { useState, useEffect } from 'react';
import axios from 'axios';

const useGeoTargetConstants = (headers) => {
    const [geoTargetData, setGeoTargetData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGeoTargetConstants = async () => {
            const endPointGeoTargetConstants = process.env.REACT_APP_OOM_SEO_API_GEO_TARGET_CONSTANTS;
            try {
                const response = await axios.get(endPointGeoTargetConstants, {
                    headers,
                });
                if (response.data && response.status === 200) {
                    setGeoTargetData(response.data.geo_target_constants);
                }
            } catch (error) {
                setError('Error fetching projects');
                console.error('Error fetching geo target constants:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchGeoTargetConstants();
    }, [headers]);

    return { geoTargetData, loading, error };
};

export default useGeoTargetConstants;