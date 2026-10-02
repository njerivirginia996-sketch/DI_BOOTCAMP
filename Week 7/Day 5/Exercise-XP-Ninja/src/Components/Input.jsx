function Input({ label, name, value, onChange, error, autoComplete }) {
  const inputId = `contact-${name}`
  const errorId = `${inputId}-error`

  return (
    <div className="input-field">
      <label htmlFor={inputId}>{label}</label>
      <input
        className="input-control"
        id={inputId}
        name={name}
        type="text"
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
      />
      {error && <p className="field-error" id={errorId}>{error}</p>}
    </div>
  )
}

export default Input