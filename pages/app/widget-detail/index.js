/* eslint max-len: 0 */
import React from 'react';
import PropTypes from 'prop-types';

// Components
import Page from 'components/app/layout/Page';
// import Error from 'pages/_error';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import * as actions from 'pages/app/widget-detail/widget-detail-actions';
import WidgetDetail from 'pages/app/widget-detail/widget-detail';

class WidgetDetailPage extends Page {
  static propTypes = {
    user: PropTypes.object,
    widgetDetail: PropTypes.object
  };

  static async getInitialProps(context) {
    const props = await super.getInitialProps(context);
    const { store } = context;

    // Fetch widget
    await store.dispatch(actions.fetchWidget({ id: props.url.query.id }));

    return { ...props };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.url.query.id !== nextProps.url.query.id) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    const {
      widgetDetail,
      url
    } = this.props;

    const { data: widget } = widgetDetail;
    // if (widget && !widget.published) return <Error status={404} />;

    return <WidgetDetail url={url} />;
  }
}

export default withRedux(
  initStore,
  state => ({
    // Store
    widgetDetail: state.widgetDetail
  }),
  actions
)(WidgetDetailPage);
