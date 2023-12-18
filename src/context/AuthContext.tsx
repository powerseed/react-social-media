import { getCurrentUser } from '@/lib/appwrite/api';
import { IContextType, IUser } from '@/types';
import { createContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const INITIAL_USER = {
    id: '',
    email: '',
    imageUrl: ''
}

const INITIAL_STATE = {
    user: INITIAL_USER,
    isLoading: false,
    isAuthenticated: false,
    setUser: () => { },
    setIsAuthenticated: () => { },
    checkIsUserAuthenticated: async () => false
}

export const AuthContext = createContext<IContextType>(INITIAL_STATE);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<IUser>(INITIAL_USER);
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('cookieFallback') === '[]' || localStorage.getItem('cookieFallback') === null) {
            navigate('/sign-in');
        }
        
        checkIsUserAuthenticated();
    }, [])

    const checkIsUserAuthenticated = async () => {
        try {
            const currentUser = await getCurrentUser();

            if (currentUser) {
                setUser({
                    id: currentUser.$id,
                    email: currentUser.email,
                    imageUrl: currentUser.imageUrl
                });

                setIsAuthenticated(true);
                return true;
            }

            return false;
        }
        catch (error) {
            console.log(error);
            return false;
        }
        finally {
            setIsLoading(false);
        }
    };

    const value = {
        user,
        setUser,
        isLoading,
        isAuthenticated,
        setIsAuthenticated,
        checkIsUserAuthenticated
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;