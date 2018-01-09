import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'routes';
import { toastr } from 'react-redux-toastr';

// Redux
import { connect } from 'react-redux';

// Services
import UserService from 'services/UserService';
import DatasetService from 'services/DatasetService';

// Components
import Spinner from 'components/ui/Spinner';
import AreaCard from 'components/areas/AreaCard';

class AreasList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      areas: [],
      areasLoaded: false,
      subscriptionsLoaded: false,
      subscriptionsToAReas: null,
      areasMerged: false
    };

    this.userService = new UserService({ apiURL: process.env.WRI_API_URL });

    // ------------------- Bindings -----------------------
    this.handleAreaRemoved = this.handleAreaRemoved.bind(this);
    // ----------------------------------------------------
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    this.loadAreas();
    this.loadSubscriptions();
  }

  loadSubscriptions() {
    this.setState({
      loading: true,
      subscriptionsLoaded: false
    });
    this.userService.getSubscriptions(this.props.user.token)
      .then((data) => {
        const subscriptionsToAReas = data.filter((subscription) => {
          const areaValue = subscription.attributes.params.area;
          return areaValue;
        });
        this.setState({
          subscriptionsToAReas,
          subscriptionsLoaded: true
        });
        if (this.state.areasLoaded) {
          this.mergeSubscriptionsIntoAreas();
        }
      })
      .catch((err) => {
        toastr.error('Error loading subscriptions');
        console.error(err);
        this.setState({ loading: false });
      });
  }

  loadAreas() {
    this.setState({
      loading: true,
      areasLoaded: false
    });
    this.userService.getUserAreas(this.props.user.token)
      .then((data) => {
        this.setState({
          loading: false,
          areas: data,
          areasLoaded: true
        });
        if (this.state.subscriptionsLoaded) {
          this.mergeSubscriptionsIntoAreas();
        }
      })
      .catch((err) => {
        toastr.error('Error', err);
        this.setState({ loading: false });
      });
  }

  mergeSubscriptionsIntoAreas() {
    const { areas, subscriptionsToAReas } = this.state;

    // Get datasets used in subscriptions
    const datasetsSet = new Set();
    subscriptionsToAReas.forEach(subscription =>
      subscription.attributes.datasets.forEach(dataset => datasetsSet.add(dataset)));
    // Fetch data for the datasets needed

    DatasetService.getDatasets([...datasetsSet], this.props.locale, 'metadata')
      .then((data) => {
        const datasetsWithLabels = data.map(elem => ({
          id: elem.id,
          label: elem.attributes.metadata && elem.attributes.metadata[0] &&
            elem.attributes.metadata[0].attributes.info &&
            elem.attributes.metadata[0].attributes.info.name ?
            elem.attributes.metadata[0].attributes.info.name :
            elem.attributes.name
        }));
        // Merge datasets with labels inside of subscriptions
        subscriptionsToAReas.forEach((subscription) => {
          subscription.attributes.datasets = subscription.attributes.datasets
            .map(val => datasetsWithLabels.find(elem => elem.id === val));
        });

        // Load datasets info
        subscriptionsToAReas.forEach((subscription) => {
          const tempArea = areas.find(val => val.id === subscription.attributes.params.area);
          if (tempArea) {
            tempArea.subscription = subscription;
          }
        });
        this.setState({ areas, areasMerged: true });
      });
  }

  handleAreaRemoved() {
    this.loadData();
  }

  render() {
    const { loading, areas, areasMerged } = this.state;
    const { user } = this.props;

    return (
      <div className="c-areas-list">
        <div className="l-container">
          <Spinner isLoading={loading || !areasMerged} className="-small -light" />
          <div className="actions-div">
            <Link route="admin_myprep_detail" params={{ id: 'new', tab: 'areas' }}>
              <a className="c-button -primary">
                New
              </a>
            </Link>
          </div>
          <div className="row">
            {areasMerged && areas.map(val =>
              (
                <div key={val.id} className="column small-12 medium-6">
                  <div
                    className="card-container"
                  >
                    <AreaCard
                      token={user.token}
                      area={val}
                      onAreaRemoved={this.handleAreaRemoved}
                      onChange={() => this.loadData()}
                    />
                  </div>
                </div>
              )
            )}
            {areasMerged && areas.length === 0 &&
              <div className="no-areas-container">
                <p>You have not created any areas yet</p>
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}

AreasList.propTypes = {
  user: PropTypes.object.isRequired,
  locale: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  user: state.user,
  locale: state.common.locale
});

export default connect(mapStateToProps, null)(AreasList);
