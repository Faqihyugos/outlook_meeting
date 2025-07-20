import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Icon from 'components/AppIcon';

const SSOHandler = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      localStorage.setItem('token', token);
      navigate('/employee-meeting-dashboard', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <Icon name="Loader" className="animate-spin h-10 w-10 text-primary" />
        </div>

        <h2 className="text-xl font-medium text-onBackground mb-2">Redirecting...</h2>
        <p className="text-onBackground/70">
          Please wait while we log you in using Microsoft SSO.
        </p>
      </div>
    </div>
  );
};

export default SSOHandler;
