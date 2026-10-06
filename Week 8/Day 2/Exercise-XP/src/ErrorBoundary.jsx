import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { hasError: false }

  componentDidCatch(error) {
    this.setState({ hasError: true })
    console.error('A route failed to render:', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="route-error" role="alert">
          <span className="section-index">ROUTE ERROR</span>
          <h2>This page hit an error.</h2>
          <p>Choose another route above to continue exploring.</p>
        </div>
      )
    }

    return this.props.children
  }
}