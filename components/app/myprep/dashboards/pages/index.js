import React from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';

// Components
import DashboardsList from 'components/dashboards/list/DashboardsList';

function DashboardsIndex(props) {
  const { user } = props;

  return (
    <div className="c-dashboards-index">
      <DashboardsList
        getDashboardsFilters={{
          published: 'all',
          user: user.id
        }}
        routes={{
          index: 'admin_myprep',
          detail: 'admin_myprep_detail'
        }}
      />
    </div>
  );
}

DashboardsIndex.propTypes = {
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(DashboardsIndex);
