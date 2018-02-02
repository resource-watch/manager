import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';

// Redux
import { connect } from 'react-redux';

import { getDashboards, setFilters } from 'redactions/admin/dashboards';

// Selectors
import getFilteredDashboards from 'selectors/admin/dashboards';

// Components
import Spinner from 'components/ui/Spinner';
import CustomTable from 'components/ui/customtable/CustomTable';
import SearchInput from 'components/ui/SearchInput';

// Table components
import EditAction from './actions/EditAction';
import DuplicateAction from './actions/DuplicateAction';
import DeleteAction from './actions/DeleteAction';

// TDs
import NameTD from './td/NameTD';
import PublishedTD from './td/PublishedTD';
import PreviewTD from './td/PreviewTD';

class DashboardsTable extends React.Component {
  componentDidMount() {
    this.props.setFilters([]);
    this.props.getDashboards({
      filters: {
        published: 'all'
      }
    });
  }

  /**
   * Event handler executed when the user search for a dataset
   * @param {string} { value } Search keywords
   */
  @Autobind
  onSearch(value) {
    if (!value.length) {
      this.props.setFilters([]);
    } else {
      this.props.setFilters([{ key: 'name', value }]);
    }
  }

  /**
   * HELPERS
   * - getDashboards
   * - getFilteredDashboards
  */
  getDashboards() {
    return this.props.dashboards;
  }

  getFilteredDashboards() {
    return this.props.filteredDashboards;
  }

  render() {
    return (
      <div className="c-dashboards-table">
        <Spinner className="-light" isLoading={this.props.loading} />

        {this.props.error && (
          <p>Error: {this.props.error}</p>
        )}

        <SearchInput
          input={{
            placeholder: 'Search dashboard'
          }}
          link={{
            label: 'New dashboard',
            route: 'admin_dashboards_detail',
            params: { tab: 'dashboards', id: 'new' }
          }}
          onSearch={this.onSearch}
        />

        {!this.props.error && (
          <CustomTable
            columns={[
              { label: 'Name', value: 'title', td: NameTD },
              { label: 'Preview', value: 'slug', td: PreviewTD },
              { label: 'Published', value: 'published', td: PublishedTD }
            ]}
            actions={{
              show: true,
              list: [
                { name: 'Edit', route: 'admin_dashboards_detail', params: { tab: 'dashboards', subtab: 'edit', id: '{{id}}' }, show: true, component: EditAction },
                { name: 'Duplicate', route: 'admin_dashboards_detail', params: { tab: 'dashboards', subtab: 'edit', id: 'new', duplicateId: '{{duplicateId}}' }, show: true, component: DuplicateAction },
                { name: 'Remove', route: 'admin_dashboards_detail', params: { tab: 'dashboards', subtab: 'remove', id: '{{id}}' }, component: DeleteAction, componentProps: { authorization: this.props.authorization } }
              ]
            }}
            sort={{
              field: 'name',
              value: 1
            }}
            filters={false}
            data={this.getFilteredDashboards()}
            pageSize={20}
            onRowDelete={() => this.props.getDashboards({
              filters: {
                published: 'all'
              }
            })}
            pagination={{
              enabled: true,
              pageSize: 20,
              page: 0
            }}
          />
        )}
      </div>
    );
  }
}

DashboardsTable.defaultProps = {
  columns: [],
  actions: {},
  // Store
  dashboards: [],
  filteredDashboards: []
};

DashboardsTable.propTypes = {
  authorization: PropTypes.string,
  // Store
  loading: PropTypes.bool.isRequired,
  dashboards: PropTypes.array.isRequired,
  filteredDashboards: PropTypes.array.isRequired,
  error: PropTypes.string,

  // Actions
  getDashboards: PropTypes.func.isRequired,
  setFilters: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {
    loading: state.dashboards.loading,
    dashboards: state.dashboards.list,
    filteredDashboards: getFilteredDashboards(state),
    error: state.dashboards.error
  };
};
const mapDispatchToProps = {
  getDashboards,
  setFilters
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardsTable);
