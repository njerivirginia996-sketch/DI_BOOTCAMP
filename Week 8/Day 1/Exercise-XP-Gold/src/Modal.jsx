import React from 'react'

export default class Modal extends React.Component {
  handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      this.props.onClose()
    }
  }

  render() {
    const { children, onClose } = this.props

    return (
      <div className="modal-background" onMouseDown={this.handleOverlayClick}>
        <section className="modal-body" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="modal-topline"><span>ERROR REPORT / 01</span><button className="close-icon" onClick={onClose} aria-label="Close dialog">×</button></div>
          <div className="modal-symbol" aria-hidden="true">!</div>
          <p className="eyebrow">BOUNDARY ACTIVE</p>
          <h2 id="modal-title">A component<br /><em>hit a problem.</em></h2>
          <div className="modal-message">{children}</div>
          <button className="close-button" onClick={onClose}>Close report <span aria-hidden="true">×</span></button>
          <p className="modal-footnote">THE REST OF THE APP IS STILL RUNNING</p>
        </section>
      </div>
    )
  }
}