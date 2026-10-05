import React from 'react'

export default class ErrorBoundary extends React.Component {
  state = { error: null, errorInfo: null }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo })
  }

  render() {
    if (this.state.error) {
      return (
        <section className="crash-panel" role="alert">
          <span className="crash-mark" aria-hidden="true">!</span>
          <div>
            <h3>This counter crashed</h3>
            <p>The boundary caught an error in its child tree.</p>
            <details>
              <summary>Error details</summary>
              <pre>
                {this.state.error.toString()}
                {'\n'}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          </div>
        </section>
      )
    }

    return this.props.children
  }
}