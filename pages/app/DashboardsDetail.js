import React from 'react';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { fetchDashboard } from 'components/dashboards/detail/dashboard-detail-actions';

// Components
import Page from 'components/app/layout/Page';
import Layout from 'components/app/layout/Layout';
import Title from 'components/ui/Title';
import Breadcrumbs from 'components/ui/Breadcrumbs';
import DashboardDetail from 'components/dashboards/detail/dashboard-detail';
import RelatedDashboards from 'components/dashboards/related-dashboards/related-dashboards';

class DashboardsDetail extends Page {
  static async getInitialProps(context) {
    const props = await super.getInitialProps(context);
    await context.store.dispatch(fetchDashboard({ id: props.url.query.slug }));

    return { ...props };
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

                <Title className="-primary -huge page-header-title -line -center" >
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

        <RelatedDashboards
          data={dashboardDetail.dashboard.dashboards}
        />
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
