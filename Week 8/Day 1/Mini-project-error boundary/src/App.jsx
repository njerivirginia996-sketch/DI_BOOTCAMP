import React from 'react'
import ErrorBoundary from './ErrorBoundary.jsx'
import { ColumnLeft } from './columns/ColumnLeft.jsx'
import { ColumnRight } from './columns/ColumnRight.jsx'

export default function App() {
  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top"><span className="brand-mark">R</span><span>REACT / FIELD STUDY</span></a>
        <span className="topbar-meta">WEEK 08 <i /> MINI PROJECT</span>
      </header>

      <section className="page-intro" id="top">
        <div>
          <p className="eyebrow"><span className="live-dot" /> COMPONENT FAILURE / STUDY 01</p>
          <h1>Error boundaries<br /><em>keep the rest alive.</em></h1>
        </div>
        <p className="intro-note">One deliberate render crash, contained at the smallest useful boundary. The rest of the interface keeps doing its job.</p>
      </section>

      <div className="columns-layout">
        <ColumnLeft />
        <ErrorBoundary>
          <ColumnRight />
        </ErrorBoundary>
      </div>

      <footer className="page-footer"><span>REACT ERROR BOUNDARY</span><span>RENDERING · EVENTS · RECOVERY</span></footer>
    </main>
  )
}