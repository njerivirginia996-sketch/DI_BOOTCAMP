import { useState } from 'react'

const emptyContact = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
}

function ContactForm() {
  const [contact, setContact] = useState(emptyContact)
  const [submittedContact, setSubmittedContact] = useState(null)

  const handleChange = (event) => {
    const { name, value } = event.target
    setContact((currentContact) => ({ ...currentContact, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmittedContact({ ...contact })
  }

  const handleReset = () => {
    setContact(emptyContact)
    setSubmittedContact(null)
  }

  if (submittedContact) {
    return (
      <div className="contact-result" aria-live="polite">
        <div className="contact-summary">
          <h3 className="summary-title">Contact saved</h3>
          <p><strong>First name:</strong> {submittedContact.firstName}</p>
          <p><strong>Last name:</strong> {submittedContact.lastName}</p>
          <p><strong>Phone:</strong> {submittedContact.phone}</p>
          <p><strong>Email:</strong> {submittedContact.email}</p>
        </div>
        <button className="action-button secondary" type="button" onClick={handleReset}>
          Reset form
        </button>
      </div>
    )
  }

  return (
    <form className="exercise-form" onSubmit={handleSubmit}>
      <label className="field-label" htmlFor="first-name">
        First name
        <input className="field-control" id="first-name" name="firstName" autoComplete="given-name" value={contact.firstName} onChange={handleChange} required />
      </label>
      <label className="field-label" htmlFor="last-name">
        Last name
        <input className="field-control" id="last-name" name="lastName" autoComplete="family-name" value={contact.lastName} onChange={handleChange} required />
      </label>
      <label className="field-label" htmlFor="phone">
        Phone
        <input className="field-control" id="phone" name="phone" type="tel" autoComplete="tel" pattern="\+?[0-9 ]{7,19}" title="Enter a valid phone number." value={contact.phone} onChange={handleChange} required />
      </label>
      <label className="field-label" htmlFor="email">
        Email
        <input className="field-control" id="email" name="email" type="email" autoComplete="email" value={contact.email} onChange={handleChange} required />
      </label>
      <button className="action-button" type="submit">Submit details</button>
    </form>
  )
}

export default ContactForm