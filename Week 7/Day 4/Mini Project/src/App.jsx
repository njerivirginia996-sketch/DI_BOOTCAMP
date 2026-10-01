import Header from './Header.jsx';
import Card from './Card.jsx';
import Contact from './Contact.jsx';

const features = [
  {
    id: 'about',
    icon: 'fa-building',
    title: 'About the Company',
    description:
      'We bring thoughtful people and practical ideas together to make work better. Our team partners with organizations from the first conversation through the details that make a lasting difference.',
  },
  {
    id: 'values',
    icon: 'fa-earth-americas',
    title: 'Our Values',
    description:
      'We lead with curiosity, act with care, and take responsibility for the work we put into the world. Good collaboration means listening closely, sharing credit, and keeping our promises.',
  },
  {
    id: 'mission',
    icon: 'fa-landmark',
    title: 'Our Mission',
    description:
      'Our mission is to help people turn ambitious ideas into useful, dependable outcomes. We make the complicated feel clear, and leave every project stronger than we found it.',
  },
];

function App() {
  return (
    <>
      <Header />
      <main>
        <div className="container feature-list">
          {features.map((feature, index) => (
            <Card key={feature.id} {...feature} alternate={index % 2 === 1} />
          ))}
        </div>
        <Contact />
      </main>
      <footer className="site-footer">
        <p className="mb-0">Copyright 2026 Company. Built with care.</p>
      </footer>
    </>
  );
}

export default App;