import React from 'react';
import PropTypes from 'prop-types';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// Components
import Page from 'components/app/layout/Page';
import Layout from 'components/layout/Layout';
import Tabs from 'components/ui/Tabs';
import Title from 'components/ui/Title';

// My RW
import ProfilesTab from 'components/app/myprep/profiles/ProfilesTab';
import DatasetsTab from 'components/app/myprep/datasets/DatasetsTab';
import DashboardsTab from 'components/app/myprep/dashboards/DashboardsTab';
import WidgetsTab from 'components/app/myprep/widgets/WidgetsTab';
import AreasTab from 'components/app/myprep/areas/AreasTab';

// Contants
const MYPREP_TABS = [{
  label: 'Profile',
  value: 'profile',
  route: 'myprep',
  params: { tab: 'profile' }
}, {
  label: 'Datasets',
  value: 'datasets',
  route: 'myprep',
  params: { tab: 'datasets' }
}, {
  label: 'Dashboards',
  value: 'dashboards',
  route: 'myprep',
  params: { tab: 'dashboards' }
}, {
  label: 'Widgets',
  value: 'widgets',
  route: 'myprep',
  params: { tab: 'widgets' }
},
{
  label: 'Areas of interest',
  value: 'areas',
  route: 'myprep',
  params: { tab: 'areas' }
}];

class MyPREP extends Page {
  constructor(props) {
    super(props);

    const { url } = props;

    this.state = {
      tab: url.query.tab || 'profile',
      subtab: url.query.subtab
    };
  }

  componentWillReceiveProps(nextProps) {
    const { url } = nextProps;

    this.setState({
      tab: url.query.tab || 'profile',
      subtab: url.query.subtab
    });
  }

  render() {
    const { url, user } = this.props;
    const { tab, subtab } = this.state;
    const userName = user && user.name ? ` ${user.name.split(' ')[0]}` : '';
    const title = `Hi${userName}!`;

    return (
      <Layout
        title="My Resource Watch Edit Profile"
        description="My Resource Watch Edit Profile description"
        url={url}
        user={user}
        pageHeader
      >
        <div className="c-page-header">
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                <div className="page-header-content -with-tabs">
                  <Title className="-primary -huge page-header-title" >
                    {title}
                  </Title>
                  <Tabs
                    options={MYPREP_TABS}
                    defaultSelected={tab}
                    selected={tab}
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
        <div className="c-page-section">
          <div className="l-container">
            <div className="row">
              <div className="column small-12">
                {tab === 'profile' &&
                  <ProfilesTab tab={tab} subtab={subtab} />
                }

                {tab === 'datasets' &&
                  <DatasetsTab tab={tab} subtab={subtab} />
                }

                {tab === 'dashboards' &&
                  <DashboardsTab tab={tab} subtab={subtab} />
                }

                {tab === 'areas' &&
                  <AreasTab tag={tab} subtab={subtab} />
                }

                {tab === 'widgets' &&
                  <WidgetsTab tab={tab} subtab={subtab} />
                }
              </div>
            </div>
          </div>
        </div>

      </Layout>
    );
  }
}

MyPREP.defaultProps = {
};

MyPREP.propTypes = {
  url: PropTypes.object,
  user: PropTypes.object
};

export default withRedux(initStore, null, null)(MyPREP);
