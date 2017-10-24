import React from 'react';
import PropTypes from 'prop-types';
import renderHTML from 'react-render-html';
import { Link } from 'routes';

// components
import Banner from 'components/app/common/Banner';

export default function DevelopYourApp({ content }) {
  return (
    <section className="l-content">
      <article className="l-content-body">
        <div className="l-container">
          <div className="row align-center">
            <div className="column small-12 medium-8">
              { renderHTML(content) }
            </div>
            <div className="column small-12">
              <div className="buttons -align-center ">
                <Link
                  route="get_involved"
                >
                  <a className="c-button -primary">Contact us</a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}

DevelopYourApp.propTypes = {
  content: PropTypes.string
};

DevelopYourApp.defaultProps = {
  content: ''
};

