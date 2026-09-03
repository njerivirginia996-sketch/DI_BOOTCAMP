document.addEventListener('DOMContentLoaded', () => {
  const article = document.querySelector('article');
  if (!article) return;

  // 1. Using a DOM property, retrieve the h1 and console.log it.
  const h1Element = article.querySelector('h1');
  console.log(h1Element);

  // 2. Remove the last paragraph in the article tag.
  const paragraphs = article.querySelectorAll('p');
  const lastParagraph = paragraphs[paragraphs.length - 1];
  if (lastParagraph) {
    lastParagraph.remove();
  }

  // 3. Change h2 background color to red when clicked.
  const h2Element = article.querySelector('h2');
  if (h2Element) {
    h2Element.addEventListener('click', () => {
      h2Element.style.backgroundColor = 'red';
    });
  }

  // 4. Hide h3 when clicked.
  const h3Element = article.querySelector('h3');
  if (h3Element) {
    h3Element.addEventListener('click', () => {
      h3Element.style.display = 'none';
    });
  }

  // 5. Add a button to make all paragraphs bold.
  const boldButton = document.getElementById('boldBtn');
  if (boldButton) {
    boldButton.addEventListener('click', () => {
      article.querySelectorAll('p').forEach((p) => {
        p.style.fontWeight = 'bold';
      });
    });
  }

  // BONUS 6: Random font size on h1 hover.
  if (h1Element) {
    h1Element.addEventListener('mouseover', () => {
      const randomSize = Math.floor(Math.random() * 101);
      h1Element.style.fontSize = `${randomSize}px`;
    });
  }

  // BONUS 7: Fade out second paragraph on hover.
  if (paragraphs[1]) {
    paragraphs[1].addEventListener('mouseover', () => {
      paragraphs[1].classList.add('fade-out');
    });
    paragraphs[1].addEventListener('mouseout', () => {
      paragraphs[1].classList.remove('fade-out');
    });
  }
});
