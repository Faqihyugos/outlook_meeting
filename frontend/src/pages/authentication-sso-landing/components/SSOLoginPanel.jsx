import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const SSOLoginPanel = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(null);
  const [showManualLogin, setShowManualLogin] = useState(false);
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  // Company domain configuration
  const COMPANY_DOMAIN = import.meta.env.VITE_COMPANY_DOMAIN || 'kpk.go.id';
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  // Validate company email domain
  const validateCompanyEmail = (email) => {
    if (!email) return false;
    const domain = email.split('@')[1]?.toLowerCase();
    return domain === COMPANY_DOMAIN;
  };

  // Company account validation rules
  const validateCompanyAccount = (email) => {
    if (!validateCompanyEmail(email)) {
      return { isValid: false, error: `Please use your ${COMPANY_DOMAIN} email address` };
    }

    // Block personal email domains
    const blockedDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    const domain = email.split('@')[1]?.toLowerCase();
    if (blockedDomains.includes(domain)) {
      return { isValid: false, error: 'Personal email addresses are not allowed' };
    }

    return { isValid: true };
  };

  useEffect(() => {
    if (isLocked && lockoutTime) {
      const timer = setTimeout(() => {
        setIsLocked(false);
        setLoginAttempts(0);
        setLockoutTime(null);
      }, lockoutTime);
      return () => clearTimeout(timer);
    }
  }, [isLocked, lockoutTime]);

  const handleSSOLogin = async () => {
    setIsLoading(true);
    setErrors({});

    try {
      // Call Microsoft SSO authentication with domain restriction
      const response = await fetch(`${API_URL}/auth/microsoft`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domain: COMPANY_DOMAIN,
          redirectUrl: `${API_URL}/auth/callback`
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Authentication failed');
      }

      const data = await response.json();
      
      // Redirect to Microsoft login
      window.location.href = data.authUrl;
    } catch (error) {
      console.error('SSO login error:', error);
      setErrors({ general: 'Failed to initialize Microsoft login. Please try again.' });
      setIsLoading(false);
    }
  };

  const handleManualLogin = async (e) => {
    e.preventDefault();
    
    if (isLocked) return;
    setErrors({});
    
    // Validate credentials
    if (!credentials.email || !credentials.password) {
      setErrors({ general: 'Please enter both email and password' });
      return;
    }

    // Validate company email first
    const companyValidation = validateCompanyAccount(credentials.email);
    if (!companyValidation.isValid) {
      setErrors({ general: companyValidation.error });
      return;
    }

    try {
      // Attempt to authenticate with backend
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      // Store authentication token
      localStorage.setItem('authToken', data.token);
      
      // Redirect to dashboard on success
      navigate('/employee-meeting-dashboard');
    } catch (error) {
      console.error('Login error:', error);
      
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      
      if (newAttempts >= 3) {
        setIsLocked(true);
        setLockoutTime(300000); // 5 minutes lockout
        setErrors({ general: 'Account locked due to multiple failed attempts. Try again in 5 minutes.' });
      } else {
        setErrors({ 
          general: `Invalid credentials. ${3 - newAttempts} attempts remaining.` 
        });
      }
    }

    if (validCredential) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        navigate('/employee-meeting-dashboard');
      }, 1500);
    } else {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      
      if (newAttempts >= 3) {
        setIsLocked(true);
        setLockoutTime(300000); // 5 minutes lockout
        setErrors({ general: 'Account locked due to multiple failed attempts. Try again in 5 minutes.' });
      } else {
        setErrors({ 
          general: `Invalid credentials. ${3 - newAttempts} attempts remaining.` 
        });
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user starts typing
    if (errors.general) {
      setErrors({});
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-enterprise p-8 h-full">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Building2" size={32} className="text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-heading font-semibold text-foreground mb-2">
          Employee Login
        </h2>
        <p className="text-muted-foreground">
          Sign in with your company Microsoft 365 account
        </p>
      </div>

      {/* Company Domain Verification */}
      <div className="bg-success/10 border border-success/20 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-3">
          <Icon name="Shield" size={20} className="text-success" />
          <div>
            <p className="text-sm font-medium text-success">Domain Verified</p>
            <p className="text-xs text-success/80">kpk.go.id • Enterprise Account</p>
          </div>
        </div>
      </div>

      {/* SSO Login Button */}
      <Button
        variant="default"
        size="lg"
        fullWidth
        loading={isLoading}
        disabled={isLocked}
        onClick={handleSSOLogin}
        iconName="Microsoft"
        iconPosition="left"
        className="mb-4"
      >
        {isLoading ? 'Authenticating...' : 'Sign in with Microsoft 365'}
      </Button>

      {/* Alternative Login Options */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-card text-muted-foreground">or</span>
        </div>
      </div>

      <Button
        variant="outline"
        size="default"
        fullWidth
        onClick={() => setShowManualLogin(!showManualLogin)}
        iconName={showManualLogin ? "ChevronUp" : "ChevronDown"}
        iconPosition="right"
        className="mb-4"
      >
        Manual Login
      </Button>

      {/* Manual Login Form */}
      {showManualLogin && (
        <form onSubmit={handleManualLogin} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            name="email"
            value={credentials.email}
            onChange={handleInputChange}
            placeholder="your.email@company.com"
            disabled={isLocked}
            required
          />
          
          <Input
            label="Password"
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
            disabled={isLocked}
            required
          />

          {errors.general && (
            <div className="bg-error/10 border border-error/20 rounded-lg p-3">
              <p className="text-sm text-error">{errors.general}</p>
            </div>
          )}

          <Button
            type="submit"
            variant="default"
            size="default"
            fullWidth
            loading={isLoading}
            disabled={isLocked}
          >
            Sign In
          </Button>
        </form>
      )}

      {/* Security Features */}
      <div className="mt-8 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Failed Attempts:</span>
          <span className={`font-medium ${loginAttempts > 0 ? 'text-warning' : 'text-success'}`}>
            {loginAttempts}/3
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Session Timeout:</span>
          <span className="text-muted-foreground">30 minutes</span>
        </div>
      </div>

      {/* Role-based Login Indicators */}
      <div className="mt-6 p-4 bg-muted rounded-lg">
        <h4 className="text-sm font-medium text-foreground mb-2">Access Levels</h4>
        <div className="space-y-1 text-xs text-muted-foreground">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span>Employee Dashboard</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-accent rounded-full"></div>
            <span>Manager Console</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-warning rounded-full"></div>
            <span>Admin Panel</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SSOLoginPanel;