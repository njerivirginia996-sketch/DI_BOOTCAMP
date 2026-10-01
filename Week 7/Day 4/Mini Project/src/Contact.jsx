import { useState } from 'react';

function Contact() {
  const [status, setStatus] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    setStatus('Thanks for reaching out. This demo form is not connected to a mailbox yet.');
    event.currentTarget.reset();
  }

  return (
    <section className="contact-section" id="contact" aria-labelledby="contact-heading">
      <div className="container contact-panel">
        <h2 id="contact-heading">Contact us</h2>
        <div className="row g-5 contact-content">
          <div className="col-md-5 contact-details">
            <p className="contact-intro">Tell us what you are working on. We will get back to you within 24 hours.</p>
            <ul className="contact-list">
              <li>
                <i className="fa-solid fa-location-dot" aria-hidden="true" />
                <span>25 Example Street<br />New York, NY 10001</span>
              </li>
              <li>
                <i className="fa-solid fa-phone" aria-hidden="true" />
                <a href="tel:+12125550148">+1 212 555 0148</a>
              </li>
              <li>
                <i className="fa-solid fa-envelope" aria-hidden="true" />
                <a href="mailto:hello@company.example">hello@company.example</a>
              </li>
            </ul>
          </div>

          <div className="col-md-7">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label" htmlFor="contact-email">Email address</label>
                <input
                  className="form-control"
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="contact-message">Message</label>
                <textarea
                  className="form-control"
                  id="contact-message"
                  name="message"
                  rows="5"
                  placeholder="How can we help?"
                  required
                />
              </div>
              <button className="btn send-button" type="submit">Send message</button>
              <p className="form-status" role="status" aria-live="polite">{status}</p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;