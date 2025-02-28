import React from 'react'
import { Link } from 'react-router-dom'

function Nav() {
    return (
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li>
            <Link to="/partenaire">Partenaire</Link>
            <ul>
              <li><Link to="/partenaire/morale">Morale</Link></li>
              <li><Link to="/partenaire/physique">Physique</Link></li>
            </ul>
          </li>
          <li><Link to="/camion">Camion</Link></li>
        </ul>
      </nav>
    );
  }

  export default Nav