import React from 'react';
import PropTypes from 'prop-types';

import debounce from 'lodash/debounce';

// Components
import HeaderUser from 'components/app/layout/header/HeaderUser';


export default class MainNav extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      myprepActive: false
    };

    this.listeners = {};

    // BINDINGS
    this.toggleDropdown = debounce(this.toggleDropdown.bind(this), 50);
  }

  // This function is debounced. If you don't do that insane things will happen
  toggleDropdown(specificDropdown, to) {
    this.setState({
      ...{ myprepActive: false },
      [specificDropdown]: to
    });
  }

  render() {
    return (
      <nav className="c-nav -main">
        <ul>
          <li><a href="/about">About</a></li>
          <li><a href="/explore">Explore</a></li>
          <li><a href="/dashboards">Dashboards</a></li>
          <li><a href="/stories">Stories</a></li>
          <li><a href="/resources">Resources</a></li>
          <li>
            <HeaderUser
              user={this.props.user}
              active={this.state.myprepActive}
              onMouseEnter={() => this.toggleDropdown('myprepActive', true)}
              onMouseLeave={() => this.toggleDropdown('myprepActive', false)}
            />
          </li>
        </ul>
      </nav>
    );
  }
}


MainNav.propTypes = {
  user: PropTypes.object
};
