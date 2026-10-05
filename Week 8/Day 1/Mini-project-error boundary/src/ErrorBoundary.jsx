import React from 'react'

export default class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null, errorInfo: null }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    this.setState({ errorInfo })
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children
    }

    return (
      <section className="error-fallback" role="alert">
        <div className="error-symbol" aria-hidden="true">!</div>
        <div className="error-content">
          <p className="eyebrow">BOUNDARY CAUGHT AN ERROR</p>
          <h3>This part of the interface stopped rendering.</h3>
          <p className="error-message">{this.state.error?.toString()}</p>
          <details>
            <summary>View component stack</summary>
            <pre>{this.state.errorInfo?.componentStack}</pre>
          </details>
          <button className="reload-button" onClick={() => window.location.reload()}>
            Reload page <span aria-hidden="true">↗</span>
          </button>
        </div>
      </section>
    )
  }
}