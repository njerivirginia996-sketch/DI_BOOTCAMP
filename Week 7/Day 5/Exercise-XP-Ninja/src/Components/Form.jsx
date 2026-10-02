import { useState } from 'react'
import Input from './Input'

const initialValues = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
}

const validators = {
  firstName: (value) => value.trim() ? '' : 'First name is required.',
  lastName: (value) => value.trim() ? '' : 'Last name is required.',
  phone: (value) => /^\+?[0-9][0-9 ()-]{5,18}[0-9]$/.test(value.trim())
    ? ''
    : 'Enter a valid phone number.',
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())
    ? ''
    : 'Enter a valid email address.',
}

function Form() {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setValues((currentValues) => ({ ...currentValues, [name]: value }))
    setStatus('')

    if (errors[name]) {
      setErrors((currentErrors) => ({ ...currentErrors, [name]: validators[name](value) }))
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = Object.fromEntries(
      Object.entries(values).map(([name, value]) => [name, validators[name](value)]),
    )
    setErrors(nextErrors)

    if (Object.values(nextErrors).every((error) => !error)) {
      setStatus('Your details are valid and ready to send.')
    }
  }

  const handleReset = () => {
    setValues(initialValues)
    setErrors({})
    setStatus('')
  }

  return (
    <form className="validation-form" noValidate onSubmit={handleSubmit} onReset={handleReset}>
      <Input label="First name" name="firstName" value={values.firstName} onChange={handleChange} error={errors.firstName} autoComplete="given-name" />
      <Input label="Last name" name="lastName" value={values.lastName} onChange={handleChange} error={errors.lastName} autoComplete="family-name" />
      <Input label="Phone" name="phone" value={values.phone} onChange={handleChange} error={errors.phone} autoComplete="tel" />
      <Input label="Email" name="email" value={values.email} onChange={handleChange} error={errors.email} autoComplete="email" />
      <div className="form-actions">
        <button className="submit-button" type="submit">Validate details</button>
        <button className="reset-button" type="reset">Clear</button>
      </div>
      <p className="form-status" role="status">{status}</p>
    </form>
  )
}

export default Form