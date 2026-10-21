import { useState, type FormEvent } from 'react'

export type FieldErrors<T> = Partial<Record<keyof T, string>>
export type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

export function useForm<T extends Record<string, string>>(
  initialValues: T,
  validate: (values: T) => FieldErrors<T>,
  onSubmit: (values: T) => Promise<void>,
) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<FieldErrors<T>>({})
  const [status, setStatus] = useState<FormStatus>('idle')
  const [submitError, setSubmitError] = useState('')

  function setFieldValue<K extends keyof T>(field: K, value: T[K]) {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setSubmitError('')
    setStatus('idle')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    setSubmitError('')
    if (Object.values(nextErrors).some(Boolean)) return

    setStatus('submitting')
    try {
      await onSubmit(values)
      setStatus('success')
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  return { values, errors, status, submitError, setFieldValue, handleSubmit }
}
