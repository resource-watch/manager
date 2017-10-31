import React from 'react';
import PropTypes from 'prop-types';
import renderHTML from 'react-render-html';

import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { getStaticData } from 'redactions/static_pages';
import { setUser } from 'redactions/user';
import { setRouter } from 'redactions/routes';

import { Link } from 'routes';
import Banner from 'components/app/common/Banner';
import CardStatic from 'components/app/common/CardStatic';
import Page from 'components/app/layout/Page';
import Layout from 'components/app/layout/Layout';

const cards = [
  {
    id: 'insights',
    title: 'Submit a story',
    intro: ['Tell a story with data. Share content with the world and inspire action.'],
    buttons: [
      {
        text: 'Submit a story',
        route: 'get_involved_detail',
        params: { id: 'submit-an-insight' },
        className: '-primary -alt'
      }
    ],
    className: 'insights'
  },
  {
    id: 'data',
    title: 'Contribute data',
    intro: ['Extend the reach and impact of your datasets. Upload for private or public use, and see how many are using it.'],
    buttons: [
      {
        text: 'Contribute data',
        route: 'get_involved_detail',
        params: { id: 'contribute-data' },
        className: '-primary -alt'
      }
    ],
    className: 'contribute'
  },
  {
    id: 'join',
    title: 'Join the community',
    intro: ['PReP is an open platform for everyone to explore data and stories about our planet.'],
    buttons: [
      {
        text: 'Join the community',
        route: 'get_involved_detail',
        params: { id: 'join-community' },
        className: '-primary -alt'
      }
    ],
    className: 'join'
  },
  {
    id: 'app',
    title: 'Develop your app',
    intro: ['Power your application with the Resource Watch API, or build on our open source code for your next project.'],
    buttons: [
      {
        text: 'Develop your app',
        route: 'get_involved_detail',
        params: { id: 'develop-app' },
        className: '-primary -alt'
      },
      {
        text: 'Apps gallery',
        route: 'get_involved_detail',
        params: { id: 'apps' },
        className: '-secondary -alt'
      }
    ],
    className: 'develop'
  }
];

class GetInvolved extends Page {
  static async getInitialProps({ asPath, pathname, query, req, store, isServer }) {
    const { user } = isServer ? req : store.getState();
    const url = { asPath, pathname, query };
    store.dispatch(setUser(user));
    store.dispatch(setRouter(url));
    await store.dispatch(getStaticData('get-involved'));
    return { isServer, user, url };
  }

  render() {
    const { data } = this.props;
    const styles = {};

    if (!data) return null;

    if (data && data.photo) {
      styles.backgroundImage = `url(${process.env.STATIC_SERVER_URL}${data.photo.cover})`;
    }

    const cardsStatic = cards.map(c =>
      (<div
        key={c.id}
        className="column small-12 medium-6"
      >
        <CardStatic
          className={`-alt ${c.className}`}
          background={c.background}
          clickable={false}
        >
          <div>
            <h2>{c.title}</h2>
            <p>{c.intro}</p>
          </div>
          <div className="buttons -align-left">
            {c.buttons.map(b => (
              <Link key={b.route + b.params.id} route={b.route} params={b.params}>
                <a className={`c-button ${b.className}`}>{b.text}</a>
              </Link>
            ))}
          </div>
        </CardStatic>
      </div>)
    );

    return (
      <Layout
        title="Get Involved"
        description="Get Involved description"
        url={this.props.url}
        user={this.props.user}
        className="l-static p-get-involved"
      >
        <section className="l-content">
          <header className="l-content-header">
            <div className="cover" style={styles}>
              <div className="row">
                <div className="column small-12">
                  <div className="content">
                    <h1>{data.title}</h1>
                    <p>{data.summary}</p>
                  </div>
                </div>
              </div>
            </div>
          </header>
          <div className="l-content-body">
            { data.content ? (<div className="l-container">
              <article>
                <div className="row align-center">
                  <div className="column small-12 medium-8">
                    {renderHTML(data.content || '')}
                  </div>
                </div>
              </article>
            </div> ) : null }
            <div className="l-container">
              <div className="row">
                {cardsStatic}
              </div>
            </div>
          </div>
        </section>

        <aside className="l-postcontent">
          <div className="l-container">
            <div className="row align-center">
              <div className="column small-12">
                <Banner className="-text-center" bgImage={'/static/images/backgrounds/partners-02@2x.jpg'}>
                  <p className="-claim">
                    See yourself as part <br />of this team?
                  </p>
                  <button className="c-button -primary -alt">
                    Get in touch
                  </button>
                </Banner>
              </div>
            </div>
          </div>
        </aside>

      </Layout>
    );
  }
}

GetInvolved.propTypes = {
  data: PropTypes.object,
  getStaticData: PropTypes.func
};

const mapStateToProps = state => ({
  data: state.staticPages['get-involved']
});

const mapDispatchToProps = dispatch => ({
  getStaticData: (slug, ref) => {
    dispatch(getStaticData(slug, ref));
  }
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(GetInvolved);
