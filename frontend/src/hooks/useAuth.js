import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
<<<<<<< Updated upstream
  console.log('useAuth hook - context:', {
    hasContext: !!context,
    user: context?.user,
    token: !!context?.token
  });
  
  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  
  return context;
}; 
=======
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }

  const isAuthenticated = () => {
    console.log('Vérification auth:', {
      hasToken: !!context.token,
      hasUser: !!context.user,
      isAuth: !!context.token && !!context.user
    });
    return !!context.token && !!context.user;
  };

  return {
    ...context,
    isAuthenticated,
    user: context.user,
    token: context.token
  };
};

export default useAuth; 
>>>>>>> Stashed changes
