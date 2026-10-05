import React from 'react'
import ErrorBoundary from './ErrorBoundary.jsx'

export default class App extends React.Component {
  state = { errorInfo: null }

  errorBoundaryRef = React.createRef()

  handleShowError = () => {
    this.errorBoundaryRef.current?.occurError(new Error('Something went wrong. The error boundary contained it.'))
  }

  handleErrorInfo = (errorInfo) => {
    this.setState({ errorInfo })
  }

  render() {
    return (
      <main className="app-shell">
        <header className="topbar">
          <a className="brand" href="#top"><span className="brand-mark">R</span><span>REACT / FIELD NOTES</span></a>
          <span className="topbar-meta">WEEK 08 <i /> XP GOLD</span>
        </header>

        <section className="exercise" id="top">
          <div className="exercise-copy">
            <p className="eyebrow"><span className="live-dot" /> COMPONENT RECOVERY / 01</p>
            <h1>When things<br /><em>go sideways.</em></h1>
            <p className="intro-copy">Errors happen. An error boundary catches them and gives the interface a graceful way to recover.</p>
            <ErrorBoundary ref={this.errorBoundaryRef} onErrorInfo={this.handleErrorInfo}>
              <button className="trigger-button" onClick={this.handleShowError}>
                <span>Trigger an error</span><span className="trigger-icon" aria-hidden="true">↗</span>
              </button>
            </ErrorBoundary>
            <p className="state-note"><span className={this.state.errorInfo ? 'status-dot status-dot-error' : 'status-dot'} />
              {this.state.errorInfo ? 'The boundary has caught the error.' : 'All components are running normally.'}
            </p>
          </div>
          <aside className="diagram" aria-label="Error boundary status">
            <div className="diagram-header"><span>COMPONENT TREE</span><span>01 / 01</span></div>
            <div className="tree-node tree-parent"><span className="tree-indicator">●</span><span>App</span><span className="node-status">ACTIVE</span></div>
            <div className="tree-branch">
              <div className="tree-node tree-boundary"><span className="tree-indicator">◇</span><span>ErrorBoundary</span><span className="node-status">WATCHING</span></div>
              <div className="tree-node tree-child"><span className="tree-indicator">○</span><span>Child components</span><span className="node-status">{this.state.errorInfo ? 'CAUGHT' : 'READY'}</span></div>
            </div>
            <div className="diagram-footer"><span className="diagram-pulse" /> FALLBACK UI AVAILABLE</div>
          </aside>
        </section>

        <footer className="page-footer"><span>ERROR BOUNDARY / CLASS COMPONENT</span><span>DETECT · CONTAIN · RECOVER</span></footer>

      </main>
    )
  }
}