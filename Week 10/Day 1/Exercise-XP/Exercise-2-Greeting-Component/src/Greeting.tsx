interface GreetingProps {
  name: string
  messageCount: number
}

function Greeting({ name, messageCount }: GreetingProps) {
  const messageLabel = messageCount === 1 ? 'message' : 'messages'

  return (
    <section className="greeting" aria-label="Greeting">
      <p className="greeting-eyebrow">Your inbox</p>
      <h1>Hello, {name}!</h1>
      <p>
        You have <strong>{messageCount}</strong> new {messageLabel}.
      </p>
    </section>
  )
}

export default Greeting