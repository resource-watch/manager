import React from 'react';
import { Link } from 'routes';

function SecondaryNav() {
  return (
    <nav className="c-nav -secondary">
      <ul>
        <li>
          <Link to="/partners">Partners</Link>
        </li>
        <li>
          <Link to="/contact">Contact</Link>
        </li>
        <li>
          <Link to="/faqs">FAQS</Link>
        </li>
      </ul>
    </nav>
  );
}

export default SecondaryNav;
