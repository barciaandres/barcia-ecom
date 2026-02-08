import { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { jwtDecode } from 'jwt-decode'; // Need to install jwt-decode

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Function to set user data from token or null
    const setUserFromToken = (token) => {
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                // Check if token is expired
                if (decodedToken.exp * 1000 < Date.now()) {
                    localStorage.removeItem('token');
                    setCurrentUser(null);
                } else {
                    setCurrentUser({
                        id: decodedToken.id,
                        email: decodedToken.email,
                        name: decodedToken.name, // Assuming name is in token payload
                        role: decodedToken.role,
                        token: token // Store token with user object if needed elsewhere
                    });
                }
            } catch (error) {
                console.error("Error decoding token:", error);
                localStorage.removeItem('token');
                setCurrentUser(null);
            }
        } else {
            setCurrentUser(null);
        }
    };

    // On mount, check for existing token
    useEffect(() => {
        const token = localStorage.getItem('token');
        setUserFromToken(token);
        setLoading(false);
    }, []);

    const signup = async (email, password, name, address, phone) => {
        const response = await fetch('/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, name, address, phone }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to register');
        }
        return data; // Return data, frontend component will handle success
    };

    const login = async (email, password) => {
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to login');
        }

        localStorage.setItem('token', data.token);
        setUserFromToken(data.token);
        return data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setCurrentUser(null);
    };

    const value = {
        currentUser,
        loading,
        signup,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
