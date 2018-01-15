import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';
import { toastr } from 'react-redux-toastr';

// Redux
import { connect } from 'react-redux';

// Services
import UserService from 'services/UserService';
import WidgetService from 'services/WidgetService';

// Components
import Spinner from 'components/ui/Spinner';
import WidgetList from 'components/widgets/list/WidgetList';

class MyPREPWidgetsStarred extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      starredWidgets: false,
      starredWidgetsLoaded: null
    };

    // User service
    this.userService = new UserService({ apiURL: process.env.CONTROL_TOWER_URL });
    this.widgetService = new WidgetService(null, { apiURL: process.env.CONTROL_TOWER_URL });
  }

  componentDidMount() {
    this.loadWidgets();
  }

  loadWidgets() {
    this.setState({
      starredWidgets: false
    });
    this.userService.getFavouriteWidgets(this.props.user.token)
      .then((response) => {
        this.setState({
          starredWidgets: (response.data || []).map((elem) => {
            const favouriteId = elem.id;
            return Object.assign({}, elem.attributes.resource, { favouriteId });
          }).filter(f => f.attributes.application.includes(process.env.APPLICATIONS)),
          starredWidgetsLoaded: true
        });
      }).catch(err => { toastr.error('Error', err) });
  }

  @Autobind
  handleWidgetRemoved() {
    this.loadWidgets(this.props);
  }

  @Autobind
  handleWidgetUnfavourited() {
    this.loadWidgets(this.props);
  }

  render() {
    const { starredWidgets, starredWidgetsLoaded } = this.state;

    return (
      <div className="c-myprep-widgets-starred">
        <div className="row">
          <div className="column small-12">
            <Spinner
              isLoading={!starredWidgetsLoaded}
              className="-relative -light"
            />

            {starredWidgets &&
              <WidgetList
                widgets={starredWidgets}
                mode="grid"
                showEmbed
                showStar
                onWidgetUnfavourited={this.handleWidgetUnfavourited}
              />
            }

            {starredWidgets && starredWidgets.length === 0 &&
              <div className="no-widgets-div">
                You currently have no starred widgets
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}

MyPREPWidgetsStarred.propTypes = {
  // Store
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(MyPREPWidgetsStarred);
