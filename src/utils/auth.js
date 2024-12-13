/**
 * Function to refresh the access token using a provided refresh token.
 *
 * This function sends a `POST` request to the server's refresh token endpoint and returns the newly obtained access token.
 * If the refresh token is valid, it returns the new access token, otherwise, it throws an error.
 *
 * @since 1.0.0
 * @version 1.0.0
 *
 * @package OOmAISEOTools
 * @package utilities
 * 
 * @author OOm Developer (oom_ss)
 *
 * @example
 * const newAccessToken = await refreshAccessToken(refreshToken, headers);
 * // This will call the API to refresh the access token, and return the new token.
 *
 * @param {string} refreshToken - The refresh token used to request a new access token.
 * @param {Object} headers - The headers to include in the request, typically for authorization or content-type.
 * @returns {Promise<string>} A promise that resolves to the new access token string if successful.
 * @throws {Error} Throws an error if the token refresh request fails or if the response is not successful.
 *
 * @throws {Error} If the fetch request fails, or if the server responds with a non-OK status.
 */

export const refreshAccessToken = async (refreshToken, headers) => {
    try {
      const endPointRefreshToken = process.env.REACT_APP_OOM_SEO_API_USER_REFRESH_TOKEN;
      const response = await fetch(endPointRefreshToken, {
        method: 'POST',
        headers,
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }
  
      const data = await response.json();
      return data.accessToken; // Assuming the server returns { accessToken: 'newToken' }
    } catch (error) {
      console.error('Error refreshing access token:', error);
      throw error;
    }
};