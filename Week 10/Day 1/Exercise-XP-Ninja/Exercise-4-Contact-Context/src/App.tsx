import { useState, type FormEvent } from 'react'
import { ContactProvider, useContacts } from './ContactContext'

function ContactManager() {
  const { state, dispatch } = useContacts()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  function addContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    dispatch({ type: 'addContact', contact: { id: Date.now(), name: name.trim(), email: email.trim() } })
    setName('')
    setEmail('')
  }

  return <main className="page"><a className="back-link" href="../">← All Exercises</a><p className="eyebrow">EXERCISE 04 / useContext</p><h1>Shared contact list</h1><p className="lede">The nested list reads shared reducer state through a typed context hook.</p><section className="panel"><form className="add-form" onSubmit={addContact}><label>Name<input required placeholder="Jamie Lee" value={name} onChange={(event) => setName(event.target.value)} /></label><label>Email<input required type="email" placeholder="jamie@example.com" value={email} onChange={(event) => setEmail(event.target.value)} /></label><button aria-label="Add contact" title="Add contact" type="submit">+</button></form><div className="list-heading"><span>CONTACTS</span><span>{String(state.contacts.length).padStart(2, '0')} ENTRIES</span></div>{state.contacts.length === 0 ? <p className="empty">Your shared contact list is empty.</p> : <ul>{state.contacts.map((contact) => <li key={contact.id}><span className="avatar">{contact.name.slice(0, 1).toUpperCase()}</span><span className="identity"><strong>{contact.name}</strong><small>{contact.email}</small></span><button aria-label={`Remove ${contact.name}`} className="remove" onClick={() => dispatch({ type: 'removeContact', id: contact.id })} title="Remove contact" type="button">×</button></li>)}</ul>}</section></main>
}

export default function App() {
  return <ContactProvider><ContactManager /></ContactProvider>
}