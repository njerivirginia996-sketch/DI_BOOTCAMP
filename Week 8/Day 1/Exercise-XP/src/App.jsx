import React from 'react'
import ErrorBoundary from './ErrorBoundary.jsx'

class BuggyCounter extends React.Component {
  state = { counter: 0 }

  handleClick = () => {
    this.setState(({ counter }) => ({ counter: counter + 1 }))
  }

  render() {
    if (this.state.counter === 5) {
      throw new Error('I crashed!')
    }

    return (
      <button className="counter-button" onClick={this.handleClick}>
        <span className="counter-label">Buggy counter</span>
        <span className="counter-value">{this.state.counter}</span>
        <span className="counter-hint">Click to increment</span>
      </button>
    )
  }
}

class FavoriteColor extends React.Component {
  state = { favoriteColor: 'red' }

  componentDidMount() {
    this.colorTimer = window.setTimeout(() => {
      this.setState({ favoriteColor: 'yellow' })
    }, 1800)
  }

  shouldComponentUpdate() {
    return true
  }

  getSnapshotBeforeUpdate() {
    console.log('in getSnapshotBeforeUpdate')
    return this.state.favoriteColor
  }

  componentDidUpdate(_previousProps, _previousState, snapshot) {
    console.log('after update')
    if (snapshot) {
      console.log(`Previous favorite color: ${snapshot}`)
    }
  }

  componentWillUnmount() {
    window.clearTimeout(this.colorTimer)
  }

  changeColor = () => {
    this.setState({ favoriteColor: 'blue' })
  }

  render() {
    return (
      <div className="color-demo">
        <div className="color-swatch" style={{ '--swatch-color': this.state.favoriteColor }}>
          <span>{this.state.favoriteColor}</span>
        </div>
        <div className="color-copy">
          <p className="eyebrow">Current favorite</p>
          <h3 style={{ color: this.state.favoriteColor }}>{this.state.favoriteColor}</h3>
          <p>Starts red, turns yellow after mounting, or change it to blue.</p>
          <button className="action-button" onClick={this.changeColor}>Change to blue <span aria-hidden="true">↗</span></button>
        </div>
      </div>
    )
  }
}

class Child extends React.Component {
  componentWillUnmount() {
    window.alert('Child component unmounted')
  }

  render() {
    return <h3 className="hello-message">Hello World!</h3>
  }
}

const sections = [
  { id: 'boundaries', number: '01', label: 'Error boundaries' },
  { id: 'updates', number: '02', label: 'Updating' },
  { id: 'unmounting', number: '03', label: 'Unmounting' },
]

export default class App extends React.Component {
  state = { activeSection: 'boundaries', show: true }

  setSection = (activeSection) => {
    this.setState({ activeSection })
  }

  deleteChild = () => {
    this.setState({ show: false })
  }

  resetChild = () => {
    this.setState({ show: true })
  }

  renderBoundaryDemo() {
    return (
      <div className="demo-grid">
        <article className="demo-card demo-card-wide">
          <div className="card-heading">
            <div><p className="eyebrow">Simulation 01</p><h3>One boundary, two counters</h3></div>
            <span className="boundary-tag">Shared boundary</span>
          </div>
          <p className="card-description">When either counter crashes, the boundary replaces both counters.</p>
          <ErrorBoundary key="shared">
            <div className="counter-row"><BuggyCounter /><BuggyCounter /></div>
          </ErrorBoundary>
        </article>

        <article className="demo-card">
          <div className="card-heading">
            <div><p className="eyebrow">Simulation 02</p><h3>Independent boundaries</h3></div>
            <span className="boundary-tag">Isolated</span>
          </div>
          <p className="card-description">Each counter has its own boundary, so a sibling keeps running.</p>
          <div className="counter-stack">
            <ErrorBoundary key="left"><BuggyCounter /></ErrorBoundary>
            <ErrorBoundary key="right"><BuggyCounter /></ErrorBoundary>
          </div>
        </article>

        <article className="demo-card demo-card-unprotected">
          <div className="card-heading">
            <div><p className="eyebrow">Simulation 03</p><h3>No boundary</h3></div>
            <span className="boundary-tag boundary-tag-danger">Unprotected</span>
          </div>
          <p className="card-description">At five, the uncaught render error unmounts this React app. Reload to try again.</p>
          <BuggyCounter />
        </article>
      </div>
    )
  }

  render() {
    const { activeSection, show } = this.state

    return (
      <main className="app-shell">
        <header className="topbar">
          <a className="brand" href="#top" aria-label="React Lifecycle Lab home"><span className="brand-mark">R</span><span>FIELD NOTES <b>/ REACT</b></span></a>
          <span className="topbar-meta">WEEK 08 <i /> DAY 01</span>
        </header>

        <section className="intro" id="top">
          <div className="intro-copy">
            <p className="eyebrow"><span className="live-dot" /> COMPONENTS &amp; EVENTS</p>
            <h1>React<br /><em>Lifecycle Lab</em></h1>
            <p className="intro-summary">Three small experiments in catching errors, responding to updates, and saying goodbye.</p>
          </div>
          <div className="intro-stamp" aria-hidden="true"><span>CLASS</span><strong>03</strong><span>EXERCISES</span></div>
        </section>

        <nav className="section-nav" aria-label="Exercise sections">
          {sections.map((section) => (
            <button
              className={activeSection === section.id ? 'nav-tab nav-tab-active' : 'nav-tab'}
              key={section.id}
              onClick={() => this.setSection(section.id)}
              aria-current={activeSection === section.id ? 'page' : undefined}
            >
              <span>{section.number}</span>{section.label}
            </button>
          ))}
        </nav>

        <section className="content-section" key={activeSection}>
          {activeSection === 'boundaries' && <>
            <div className="section-title"><div><p className="eyebrow">EXERCISE 01</p><h2>Contain the crash</h2></div><p>Click a counter five times to trigger <code>I crashed!</code></p></div>
            {this.renderBoundaryDemo()}
          </>}

          {activeSection === 'updates' && <>
            <div className="section-title"><div><p className="eyebrow">EXERCISE 02</p><h2>Watch an update happen</h2></div><p>Open DevTools to follow the lifecycle logs.</p></div>
            <article className="demo-card lifecycle-card">
              <div className="card-heading"><div><p className="eyebrow">UPDATING PHASE</p><h3>Favorite color</h3></div><span className="boundary-tag">Class component</span></div>
              <p className="card-description">The component mounts red, changes to yellow on a timer, and can be changed to blue. Updates are allowed.</p>
              <FavoriteColor key="favorite-color" />
              <div className="lifecycle-order"><span>01 <b>getDerivedStateFromProps</b></span><span>02 <b>shouldComponentUpdate</b></span><span>03 <b>render</b></span><span>04 <b>getSnapshotBeforeUpdate</b></span><span>05 <b>componentDidUpdate</b></span></div>
            </article>
          </>}

          {activeSection === 'unmounting' && <>
            <div className="section-title"><div><p className="eyebrow">EXERCISE 03</p><h2>Remove a child</h2></div><p>Unmounting the child triggers its lifecycle method.</p></div>
            <article className="demo-card lifecycle-card">
              <div className="card-heading"><div><p className="eyebrow">UNMOUNTING PHASE</p><h3>Conditional rendering</h3></div><span className="boundary-tag">componentWillUnmount</span></div>
              <p className="card-description">Delete the child to remove it from the tree and show the unmounted alert.</p>
              <div className="child-demo">
                <div className="child-preview">{show ? <Child /> : <p className="empty-state">The child has been removed.</p>}</div>
                {show ? <button className="action-button action-button-danger" onClick={this.deleteChild}>Delete child <span aria-hidden="true">×</span></button> : <button className="action-button" onClick={this.resetChild}>Mount again <span aria-hidden="true">↗</span></button>}
              </div>
            </article>
          </>}
        </section>

        <footer className="footer"><span>REACT / LIFECYCLE STUDIES</span><span>STATE · EVENTS · TREE</span></footer>
      </main>
    )
  }
}