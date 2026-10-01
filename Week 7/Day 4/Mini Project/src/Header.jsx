const navigation = [
  ['About', '#about'],
  ['Values', '#values'],
  ['Mission', '#mission'],
  ['Contact', '#contact'],
];

function Header() {
  return (
    <header className="site-header" id="top">
      <nav className="navbar container header-inner" aria-label="Main navigation">
        <a className="navbar-brand company-brand" href="#top">
          <span className="brand-name">Company</span>
          <span className="brand-tagline">The specialists in something.</span>
        </a>
        <div className="header-links">
          {navigation.map(([label, href]) => (
            <a className="header-link" href={href} key={href}>{label}</a>
          ))}
        </div>
      </nav>
    </header>
  );
}

export default Header;