import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from 'react'

export type Contact = { id: number; name: string; email: string }
type ContactState = { contacts: Contact[] }
type ContactAction = { type: 'addContact'; contact: Contact } | { type: 'removeContact'; id: number }
type ContactContextValue = { state: ContactState; dispatch: Dispatch<ContactAction> }

const initialState: ContactState = { contacts: [] }
const ContactContext = createContext<ContactContextValue | undefined>(undefined)

function contactReducer(state: ContactState, action: ContactAction): ContactState {
  switch (action.type) {
    case 'addContact': return { contacts: [...state.contacts, action.contact] }
    case 'removeContact': return { contacts: state.contacts.filter((contact) => contact.id !== action.id) }
  }
}

export function ContactProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(contactReducer, initialState)
  return <ContactContext.Provider value={{ state, dispatch }}>{children}</ContactContext.Provider>
}

export function useContacts() {
  const context = useContext(ContactContext)
  if (!context) throw new Error('useContacts must be used inside ContactProvider')
  return context
}