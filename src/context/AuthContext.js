/**
 * AuthProvider component to provide authorization headers to the app.
 *
 * This component is responsible for providing the authorization headers (including the access token 
 * and refresh token) to the entire application via the context API. It accepts the `accessToken` 
 * and `refreshToken` as props and creates headers to be used in API requests. It uses the `AuthContext` 
 * to pass these headers down the component tree so they can be accessed anywhere via the `useAuthHeaders` hook.
 *
 * @since 1.0.0
 * @version 1.0.0
 * 
 * @package AuthContext
 * 
 * @author OOm Developer (oom_ss)
 * 
 * @example
 * // Example usage in a component
 * const { Authorization, 'x-refresh-token': refreshToken } = useAuthHeaders();
 * 
 * @param {object} props - The component props.
 * @param {string} props.accessToken - The access token to be used in the Authorization header.
 * @param {string} props.refreshToken - The refresh token to be included in the request headers.
 * @returns {React.Element} The `AuthProvider` component that provides headers to its children via context.
 */

import React, { createContext, useContext, useMemo } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children, accessToken, refreshToken }) => {
    const headers = useMemo(() => ({
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'x-refresh-token': refreshToken,
    }), [accessToken, refreshToken]);

    return (
        <AuthContext.Provider value={headers}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthHeaders = () => {
    return useContext(AuthContext); 
};