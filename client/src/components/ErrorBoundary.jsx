import { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('AgriLink page render error:', error, errorInfo);
  }

  goToDashboard = () => {
    window.history.pushState({}, '', '/dashboard');
    window.dispatchEvent(new PopStateEvent('popstate'));
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return (
        <main className="error-page">
          <span>AgriLink</span>
          <h1>Something went wrong while loading this page.</h1>
          <p>
            The issue has been logged to the browser console for development.
          </p>
          <button className="primary" onClick={this.goToDashboard}>
            Go to Dashboard
          </button>
        </main>
      );
    }

    return this.props.children;
  }
}
