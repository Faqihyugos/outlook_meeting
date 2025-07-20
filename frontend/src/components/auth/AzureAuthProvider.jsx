import React, { createContext, useContext, useState, useEffect } from 'react';
import { PublicClientApplication, InteractionRequiredAuthError } from '@azure/msal-browser';

const AzureAuthContext = createContext();

const msalConfig = {
  auth: {
    clientId: process.env.REACT_APP_AZURE_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.REACT_APP_AZURE_TENANT_ID}`,
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  }
};

const loginRequest = {
  scopes: ['User.Read', 'Calendars.Read', 'Calendars.ReadWrite']
};

export function AzureAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const msalInstance = new PublicClientApplication(msalConfig);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const accounts = msalInstance.getAllAccounts();
        if (accounts.length > 0) {
          msalInstance.setActiveAccount(accounts[0]);
          const response = await msalInstance.acquireTokenSilent(loginRequest);
          setUser({
            account: accounts[0],
            accessToken: response.accessToken
          });
        }
      } catch (error) {
        if (error instanceof InteractionRequiredAuthError) {
          // User needs to login again
          setUser(null);
        }
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async () => {
    try {
      const response = await msalInstance.loginPopup(loginRequest);
      msalInstance.setActiveAccount(response.account);
      setUser({
        account: response.account,
        accessToken: response.accessToken
      });
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await msalInstance.logoutPopup();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    msalInstance
  };

  return (
    <AzureAuthContext.Provider value={value}>
      {children}
    </AzureAuthContext.Provider>
  );
}

export const useAzureAuth = () => {
  const context = useContext(AzureAuthContext);
  if (!context) {
    throw new Error('useAzureAuth must be used within an AzureAuthProvider');
  }
  return context;
};
