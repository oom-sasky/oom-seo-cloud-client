/**
 * Retrieves the value of a query parameter from the current URL.
 *
 * This function accepts the name of a query parameter and returns its corresponding value from the URL's query string.
 * If the parameter is not present in the URL, it returns `null`.
 *
 * @since 1.0.0
 * @version 1.0.0
 * 
 * @package URLUtilities
 * 
 * @author OOm Developer (oom_ss)
 *
 * @example
 * // Assume the current URL is https://example.com?page=2&sort=asc
 * const page = getQueryParam('page');
 * console.log(page); // Outputs: "2"
 *
 * @param {string} param - The name of the query parameter to retrieve.
 * @returns {string | null} The value of the query parameter, or `null` if the parameter does not exist.
 */

export const getQueryParam = (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
};