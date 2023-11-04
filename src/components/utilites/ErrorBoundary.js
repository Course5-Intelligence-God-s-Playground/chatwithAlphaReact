import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const ErrorBoundary = () => {
  const [hasError, setHasError] = useState(false);
  const navigate = useNavigate(); // Renamed 'nav' to 'navigate'

  const componentDidCatch = (error, errorInfo) => {
    // You can log the error to an error tracking service here
    // Example: sendErrorToService(error, errorInfo);
    setHasError(true);
  };

  if (hasError) {
    // Navigate to the root route on error
    navigate('/'); // Use navigate to go to the root route
    return null; // You may not need to render anything here
  }

  return <Outlet />;
};

export default ErrorBoundary;
