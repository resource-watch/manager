import React from 'react';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { setUser } from 'redactions/user';
import { setRouter } from 'redactions/routes';
import { fetchDashboard } from 'components/dashboards/detail/dashboard-detail-actions';

// Components
import Page from 'components/admin/layout/Page';
import Layout from 'components/layout/Layout';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import DashboardDetail from 'components/dashboards/detail/dashboard-detail';

class DashboardsDetail extends Page {
  static async getInitialProps({ asPath, pathname, query, req, store, isServer }) {
    const { user } = isServer ? req : store.getState();
    const url = { asPath, pathname, query };
    await store.dispatch(setUser(user));
    store.dispatch(setRouter(url));

    await store.dispatch(fetchDashboard({ id: url.query.slug }));

    return { isServer, user, url };
  }

  componentDidMount() {
    this.props.fetchDashboard({ id: this.props.url.query.slug });
  }

  render() {
    const { dashboardDetail } = this.props;

    return (
      <Layout
        title={dashboardDetail.dashboard.title}
        description={dashboardDetail.dashboard.summary}
        url={this.props.url}
        user={this.props.user}
        pageHeader
        className="page-dashboards c-page-dashboards"
      >
        <header className="l-page-header">
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                <div className="page-header-content">

                  <Breadcrumbs
                    className="-theme-app"
                    items={[
                      { name: 'Home', href: '/' },
                      { name: 'Dashboards', href: '/dashboards' },
                      { name: dashboardDetail.dashboard.title }
                    ]}
                  />

                  <h1>{dashboardDetail.dashboard.title}</h1>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="l-section">
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                <DashboardDetail />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

const mapStateToProps = state => ({
  dashboardDetail: state.dashboardDetail
});

const mapDispatchToProps = {
  fetchDashboard
};

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(DashboardsDetail);
