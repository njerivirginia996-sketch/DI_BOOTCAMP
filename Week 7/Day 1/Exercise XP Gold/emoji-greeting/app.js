const express = require('express');

const app = express();
const router = express.Router();
const port = process.env.PORT || 3001;
const emojis = ['😀', '🎉', '🌟', '🎈', '👋'];
const emojiLabels = ['Smiling face', 'Party popper', 'Glowing star', 'Balloon', 'Waving hand'];

app.use(express.urlencoded({ extended: false, limit: '10kb' }));

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);
}

function renderPage(content) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#f5eee8">
    <title>Hello, Human</title>
    <style>
      :root { color-scheme: light; --paper: #f5eee8; --ink: #233a32; --muted: #6d7a71; --line: #d9d5c8; --white: #fffdf8; --coral: #e66a50; --green: #416f59; --lime: #e7ef9c; }
      * { box-sizing: border-box; }
      body { min-width: 320px; min-height: 100vh; margin: 0; color: var(--ink); background: radial-gradient(#d6cfc3 0.7px, transparent 0.7px), var(--paper); background-size: 18px 18px; font-family: 'Trebuchet MS', 'Segoe UI', sans-serif; }
      .shell { width: min(960px, calc(100% - 40px)); min-height: 100vh; margin: 0 auto; display: flex; flex-direction: column; }
      header { height: 76px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--line); }
      .brand { display: flex; align-items: center; gap: 10px; color: var(--ink); text-decoration: none; font-size: 13px; font-weight: 700; }
      .brand-mark { width: 34px; height: 34px; display: grid; place-items: center; border-radius: 8px; background: var(--ink); color: var(--lime); font-size: 18px; }
      .issue { color: var(--muted); font-family: 'Courier New', monospace; font-size: 10px; }
      main { flex: 1; display: grid; grid-template-columns: 1fr minmax(280px, 410px); align-items: center; gap: 60px; padding: 54px 0; }
      .intro { animation: arrive 450ms ease both; }
      .eyebrow { margin: 0 0 15px; color: var(--coral); font-family: 'Courier New', monospace; font-size: 10px; }
      h1 { max-width: 490px; margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: 58px; font-weight: 400; line-height: 1.02; }
      h1 span { color: var(--green); font-style: italic; }
      .intro-mark { width: 94px; height: 94px; margin-top: 33px; display: grid; place-items: center; border: 1px solid var(--ink); border-radius: 50%; background: var(--lime); font-size: 40px; transform: rotate(-9deg); }
      .form-panel { padding: 27px; border: 1px solid var(--line); border-radius: 6px; background: var(--white); box-shadow: 6px 6px 0 #233a3210; animation: arrive 550ms 80ms ease both; }
      .panel-kicker { margin: 0 0 7px; color: var(--muted); font-family: 'Courier New', monospace; font-size: 9px; }
      h2 { margin: 0 0 22px; font-size: 22px; font-weight: 600; }
      label.field-label, legend { display: block; margin-bottom: 8px; color: var(--ink); font-size: 12px; font-weight: 700; }
      input[type=text] { width: 100%; height: 46px; padding: 0 12px; border: 1px solid var(--line); border-radius: 4px; background: #fff; color: var(--ink); font: inherit; font-size: 14px; }
      input[type=text]:focus-visible, button:focus-visible, input[type=radio]:focus-visible + .emoji-tile { outline: 3px solid var(--coral); outline-offset: 2px; }
      fieldset { min-width: 0; margin: 21px 0 23px; padding: 0; border: 0; }
      .emoji-list { display: grid; grid-template-columns: repeat(5, 1fr); gap: 7px; }
      .emoji-choice { position: relative; cursor: pointer; }
      .emoji-choice input { position: absolute; width: 1px; height: 1px; opacity: 0; }
      .emoji-tile { min-height: 58px; display: grid; place-items: center; border: 1px solid var(--line); border-radius: 4px; background: white; font-size: 25px; transition: background 140ms ease, border-color 140ms ease, transform 140ms ease; }
      .emoji-choice:hover .emoji-tile { transform: translateY(-2px); border-color: var(--green); }
      .emoji-choice input:checked + .emoji-tile { border-color: var(--ink); background: var(--lime); }
      .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
      .error { margin: -10px 0 15px; color: #b64231; font-size: 12px; }
      .submit-button { width: 100%; min-height: 47px; display: flex; align-items: center; justify-content: space-between; padding: 0 15px; border: 0; border-radius: 4px; background: var(--ink); color: white; cursor: pointer; font: inherit; font-size: 12px; font-weight: 700; transition: background 150ms ease, transform 150ms ease; }
      .submit-button:hover { transform: translateY(-2px); background: var(--green); }
      .submit-button span { color: var(--lime); font-size: 18px; }
      .greeting { text-align: center; }
      .greeting-emoji { width: 120px; height: 120px; margin: 6px auto 24px; display: grid; place-items: center; border-radius: 50%; background: var(--lime); font-size: 60px; animation: pop-in 450ms ease both; }
      .greeting h2 { margin: 9px 0 13px; font-family: Georgia, 'Times New Roman', serif; font-size: 36px; font-weight: 400; line-height: 1.1; overflow-wrap: anywhere; }
      .greeting p { color: var(--muted); font-size: 13px; line-height: 1.6; }
      .back-link { display: inline-flex; align-items: center; gap: 9px; margin-top: 17px; color: var(--green); font-size: 12px; font-weight: 700; text-decoration-thickness: 1px; text-underline-offset: 4px; }
      footer { min-height: 48px; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--line); color: var(--muted); font-family: 'Courier New', monospace; font-size: 9px; }
      @keyframes arrive { from { opacity: 0; transform: translateY(9px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes pop-in { from { opacity: 0; transform: scale(.8) rotate(-14deg); } to { opacity: 1; transform: scale(1) rotate(0); } }
      @media (max-width: 700px) { .shell { width: min(520px, calc(100% - 32px)); } main { grid-template-columns: 1fr; gap: 27px; padding: 35px 0; } h1 { font-size: 43px; } .intro-mark { display: none; } .form-panel { padding: 22px 18px; } }
      @media (max-width: 360px) { .emoji-list { gap: 4px; } .emoji-tile { min-height: 52px; font-size: 22px; } h1 { font-size: 38px; } }
      @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; } }
    </style>
  </head>
  <body>
    <div class="shell">
      <header>
        <a class="brand" href="/" aria-label="Hello, Human home"><span class="brand-mark" aria-hidden="true">H</span><span>HELLO, HUMAN</span></a>
        <span class="issue">GREETINGS / 01</span>
      </header>
      ${content}
      <footer><span>MADE WITH A LITTLE JOY</span><span>EXPRESS / ROUTER</span></footer>
    </div>
  </body>
</html>`;
}

function renderForm({ name = '', selectedEmoji = emojis[0], error = '' } = {}) {
  const emojiOptions = emojis.map((emoji, index) => `
              <label class="emoji-choice">
                <input type="radio" name="emoji" value="${emoji}" ${emoji === selectedEmoji ? 'checked' : ''} required>
                <span class="emoji-tile" aria-hidden="true">${emoji}</span>
                <span class="sr-only">${emojiLabels[index]}</span>
              </label>`).join('');

  return renderPage(`<main>
      <section class="intro">
        <p class="eyebrow">A SMALL MOMENT OF NICE</p>
        <h1>Good things start with <span>hello.</span></h1>
        <div class="intro-mark" aria-hidden="true">✳</div>
      </section>
      <section class="form-panel" aria-labelledby="form-title">
        <p class="panel-kicker">YOUR GREETING / 001</p>
        <h2 id="form-title">Make it personal.</h2>
        <form action="/greet" method="post">
          <label class="field-label" for="name">Your name</label>
          <input id="name" name="name" type="text" value="${escapeHtml(name)}" maxlength="60" autocomplete="given-name" placeholder="Type your name" required>
          <fieldset>
            <legend>Choose your mood</legend>
            <div class="emoji-list">${emojiOptions}
            </div>
          </fieldset>
          ${error ? `<p class="error" role="alert">${escapeHtml(error)}</p>` : ''}
          <button class="submit-button" type="submit">MAKE MY GREETING <span aria-hidden="true">&#8594;</span></button>
        </form>
      </section>
    </main>`);
}

function renderGreeting(name, emoji) {
  return renderPage(`<main>
      <section class="intro">
        <p class="eyebrow">A NOTE FOR YOU</p>
        <h1>Well, this is <span>nice.</span></h1>
        <div class="intro-mark" aria-hidden="true">✳</div>
      </section>
      <section class="form-panel greeting" aria-live="polite">
        <div class="greeting-emoji" aria-hidden="true">${emoji}</div>
        <p class="panel-kicker">A LITTLE HELLO</p>
        <h2>Hey, ${escapeHtml(name)}!</h2>
        <p>Hope something good finds its way to you today.</p>
        <a class="back-link" href="/">MAKE ANOTHER GREETING <span aria-hidden="true">&#8594;</span></a>
      </section>
    </main>`);
}

router.get('/', (request, response) => {
  response.type('html').send(renderForm());
});

router.post('/greet', (request, response) => {
  const name = typeof request.body?.name === 'string' ? request.body.name.trim() : '';
  const emoji = request.body?.emoji;

  if (!name) {
    return response.status(400).type('html').send(renderForm({
      name,
      selectedEmoji: emojis.includes(emoji) ? emoji : emojis[0],
      error: 'Please enter your name before sending your greeting.',
    }));
  }
  if (name.length > 60) {
    return response.status(400).type('html').send(renderForm({
      name: name.slice(0, 60),
      selectedEmoji: emojis.includes(emoji) ? emoji : emojis[0],
      error: 'Your name must be 60 characters or fewer.',
    }));
  }
  if (!emojis.includes(emoji)) {
    return response.status(400).type('html').send(renderForm({
      name,
      error: 'Choose one of the available emojis.',
    }));
  }

  response.type('html').send(renderGreeting(name, emoji));
});

app.use(router);
app.use((request, response) => {
  response.status(404).type('html').send(renderPage('<main><section><p class="eyebrow">404 / NOT FOUND</p><h1>That page wandered off.</h1><a class="back-link" href="/">BACK HOME</a></section></main>'));
});
app.use((error, request, response, next) => {
  const status = error.status === 413 ? 413 : 400;
  response.status(status).type('html').send(renderForm({ error: status === 413 ? 'That form submission is too large.' : 'Please submit the form again.' }));
});

app.listen(port, () => {
  console.log(`Emoji greeting app listening on port ${port}`);
});