// ErrorBoundary.js
import React, { Component } from 'react';

class ErrorBoundaryTable extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h6>A valid <span className='fw-bold' style={{color:'#00c4c9'}}>Table</span> wasn't generated for this response.</h6>;
    }

    return this.props.children; 
  }
}

export default ErrorBoundaryTable;
