import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { Router } from 'routes';

// components
import Icon from 'components/ui/Icon';
import Spinner from 'components/ui/Spinner';
import SearchInput from 'components/ui/SearchInput';
import WidgetList from 'components/widgets/list/WidgetList';
import Paginator from 'components/ui/Paginator';

// utils
import debounce from 'lodash/debounce';

class MyPREPWidgets extends PureComponent {
  static defaultProps = {
    mode: 'grid'
  }

  static propTypes = {
    mode: PropTypes.oneOf(['grid', 'list']),
    orderDirection: PropTypes.oneOf(['asc', 'desc']),
    loading: PropTypes.bool,
    widgets: PropTypes.array,
    subtab: PropTypes.string,
    pagination: PropTypes.object,
    filters: PropTypes.array,
    routes: PropTypes.object,
    setOrderDirection: PropTypes.func,
    setFilters: PropTypes.func,
    setPaginationPage: PropTypes.func,
    getWidgetsByTab: PropTypes.func
  }

  constructor(props) {
    super(props);

    const { mode } = props;

    this.state = { mode };
  }

  setListMode = () => { this.setState({ mode: 'list' }); }

  setGridMode = () => { this.setState({ mode: 'grid' }); }

  handleNewWidget = () => Router.pushRoute('admin_myprep_detail', { tab: 'widgets', id: 'new' });

  handleSearch = debounce((value) => {
    if (!value.length) {
      this.props.setFilters([]);
    } else {
      this.props.setFilters([{ key: 'name', value }]);
    }

    this.props.getWidgetsByTab(this.props.subtab);
    this.props.setPaginationPage(1);
  }, 300)

  handleOrderChange = () => {
    const { setOrderDirection } = this.props;
    const orderDirection = this.props.orderDirection === 'asc' ? 'desc' : 'asc';

    setOrderDirection(orderDirection);
  }

  handlePageChange = page => this.props.setPaginationPage(page);

  // TO-DO
  handleWidgetRemoved = () => {
    this.props.getWidgetsByTab(this.props.subtab);
  }

  /**
   * Event handler executed when the user
   * click the name and description of a widget
   * @param {object} widget Widget
   */
  handleWidgetClick = (widget) => {
    if (widget.userId === this.props.user.id) {
      Router.pushRoute('admin_myprep_detail', { tab: 'widgets', subtab: 'edit', id: widget.id });
    }
  }

  render() {
    const { mode } = this.state;
    const { widgets, loading, orderDirection, routes, pagination, filters } = this.props;
    const { page, total, limit } = pagination;
    const nameSearchValue = ((filters.find(filter => filter.key === 'name') || {}).value || '');

    const iconName = classnames({
      'icon-arrow-up': orderDirection === 'asc',
      'icon-arrow-down': orderDirection !== 'asc'
    });

    return (
      <div className="c-myprep-widgets-my c-my-prep">
        <SearchInput
          input={{
            placeholder: 'Search dataset',
            value: nameSearchValue
          }}
          link={{
            label: 'New widget',
            route: routes.detail,
            params: { tab: 'widgets', id: 'new' }
          }}
          onSearch={this.handleSearch}
          buttonClass="-secondary"
        />
        <div className="row">
          <div className="column small-12">
            <div className="list-actions">
              <div className="buttons-container">
                <button
                  className="last-modified-container"
                  onClick={this.handleOrderChange}
                >
                  <a>Last modified</a>
                  <Icon className="-small" name={iconName} />
                </button>
                <div className="mode-buttons">
                  <button
                    className={(mode === 'grid' ? '-active' : '')}
                    onClick={this.setGridMode}
                    title="Grid view"
                  >
                    <Icon name="icon-view-grid" />
                  </button>
                  <button
                    className={(mode === 'list' ? '-active' : '')}
                    onClick={this.setListMode}
                    title="List view"
                  >
                    <Icon name="icon-list-mode" />
                  </button>
                </div>
              </div>
            </div>
            {loading && <Spinner isLoading className="-fixed -light" />}
            {!!(widgets.length) &&
              <WidgetList
                isLoading={loading}
                widgets={widgets}
                mode={mode}
                onWidgetRemove={this.handleWidgetRemoved}
                showActions
                onWidgetClick={this.handleWidgetClick}
              />}
            {!!total && <Paginator
              options={{
                size: total,
                page,
                limit
              }}
              onChange={this.handlePageChange}
            />}
            {!(widgets.length) &&
              <div className="no-widgets-div">
                You currently have no widgets
              </div>}
          </div>
        </div>
      </div>
    );
  }
}

export default MyPREPWidgets;
