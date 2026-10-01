import BootstrapCard from './BootstrapCard.jsx';

const celebrities = [
  {
    title: 'Bob Dylan',
    imageUrl: 'https://miro.medium.com/max/4800/1*_EDEWvWLREzlAvaQRfC_SQ.jpeg',
    buttonLabel: 'Go to Wikipedia',
    buttonUrl: 'https://en.wikipedia.org/wiki/Bob_Dylan',
    description:
      'Bob Dylan (born Robert Allen Zimmerman, May 24, 1941) is an American singer/songwriter, author, and artist who has been an influential figure in popular music and culture for more than five decades.',
  },
  {
    title: 'McCartney',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/d/d6/Paul_McCartney_in_October_2018.jpg',
    buttonLabel: 'Go to Wikipedia',
    buttonUrl: 'https://en.wikipedia.org/wiki/Paul_McCartney',
    description:
      'Sir James Paul McCartney CH MBE (born 18 June 1942) is an English singer, songwriter, musician, composer, and record and film producer who gained worldwide fame as co-lead vocalist and bassist for the Beatles.',
  },
];

function Exercise1() {
  return (
    <section aria-labelledby="exercise-one-heading" className="mb-5">
      <p className="text-uppercase fw-bold small text-secondary mb-2">Exercise 1</p>
      <h2 id="exercise-one-heading" className="h3 mb-3">Bootstrap cards</h2>
      <div className="celebrity-grid">
        {celebrities.map((celebrity) => (
          <BootstrapCard key={celebrity.title} {...celebrity} />
        ))}
      </div>
    </section>
  );
}

export default Exercise1;