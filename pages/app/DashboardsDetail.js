import React from 'react';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { setUser } from 'redactions/user';
import { setRouter } from 'redactions/routes';
import { fetchDashboard } from 'components/dashboards/detail/dashboard-detail-actions';

// Components
import Page from 'components/app/layout/Page';
import Layout from 'components/app/layout/Layout';
import Title from 'components/ui/Title';
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

  getStyle = () => {
    const { dashboardDetail } = this.props;

    if (dashboardDetail.dashboard.image && dashboardDetail.dashboard.image !== '/images/original/missing.png') {
      return {
        backgroundImage: `url(${dashboardDetail.dashboard.image})`
      };
    }

    return {
      backgroundImage: 'url(/static/images/dashboards/bg-dashboard.png)'
    };
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
        className="page-dashboards c-page-dashboards"
      >
        <div
          className="c-page-header -app"
          style={this.getStyle()}
        >
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                <Breadcrumbs
                  className="-theme-app"
                  items={[
                    { name: 'Home', href: '/' },
                    { name: 'Dashboards', href: '/dashboards' },
                    { name: dashboardDetail.dashboard.title }
                  ]}
                />

                <Title className="-primary -huge page-header-title -line" >
                  {dashboardDetail.dashboard.title}
                </Title>

              </div>
            </div>

            {dashboardDetail.dashboard.partner &&
              <div className="row">
                <div className="column small-12">
                  <div className="page-header-partner">
                    <img
                      src={dashboardDetail.dashboard.partner.white_logo}
                      alt={dashboardDetail.dashboard.partner.title}
                    />
                    <p>{dashboardDetail.dashboard.partner.contact_name}</p>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>

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
