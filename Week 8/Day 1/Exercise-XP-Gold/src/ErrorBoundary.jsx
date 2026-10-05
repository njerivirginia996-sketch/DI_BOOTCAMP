import React from 'react'
import Modal from './Modal.jsx'

export default class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null, errorInfo: null }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Caught by ErrorBoundary:', error, errorInfo)
    this.setState({ errorInfo })
    this.props.onErrorInfo?.({ error, errorInfo })
  }

  occurError = (error = new Error('The requested action triggered an error.')) => {
    this.setState({ hasError: true, error, errorInfo: null })
    this.props.onErrorInfo?.({ error, errorInfo: null })
  }

  resetError = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
    this.props.onErrorInfo?.(null)
  }

  render() {
    if (this.state.hasError) {
      return (
        <Modal onClose={this.resetError}>
          <p>{this.state.error?.toString()}</p>
          {this.state.errorInfo?.componentStack && (
            <details>
              <summary>Component stack</summary>
              <pre>{this.state.errorInfo.componentStack}</pre>
            </details>
          )}
        </Modal>
      )
    }

    return this.props.children
  }
}