import { useEffect, useRef, useState } from 'react'

export default function App() {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return <main className="page"><a className="back-link" href="../">← All Exercises</a><p className="eyebrow">EXERCISE 05 / useRef</p><h1>Focus the input</h1><p className="lede">Use a typed DOM ref to focus an input on mount and on demand.</p><section className="panel"><p className="note">This input focuses automatically when the component mounts.</p><label>YOUR NOTE<input onBlur={() => setFocused(false)} onFocus={() => setFocused(true)} placeholder="Start typing here…" ref={inputRef} /></label><div className="actions"><button onClick={() => inputRef.current?.focus()} type="button">Focus the input <span>↗</span></button><span className={`indicator${focused ? ' active' : ''}`}><i />{focused ? 'INPUT FOCUSED' : 'INPUT NOT FOCUSED'}</span></div></section></main>
}