import React, { createElement } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import * as actions from './widget-block-actions';
import reducers from './widget-block-reducers';
import initialState from './widget-block-default-state';

import WidgetBlockComponent from './widget-block-component';

// Mandatory
export {
  actions, reducers, initialState
};

class WidgetBlock extends React.Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,

    // Redux
    setWidgetLoading: PropTypes.func.isRequired,
    setWidgetModal: PropTypes.func.isRequired,
    removeWidget: PropTypes.func.isRequired,
    setLayers: PropTypes.func.isRequired,
    toggleFavourite: PropTypes.func.isRequired
  };

  async componentWillMount() {
    if (this.props.item.content.widgetId) {
      await this.triggerFetch(this.props);
      this.setFavourite(this.props);
    }
  }

  async componentWillReceiveProps(nextProps) {
    if (nextProps.item.content.widgetId !== this.props.item.content.widgetId) {
      await this.triggerFetch(nextProps);
      this.setFavourite(nextProps);
    }
  }

  componentWillUnmount() {
    const { item } = this.props;
    // Reset widget
    this.props.removeWidget({
      id: `${item.content.widgetId}/${item.id}`
    });
  }

  /**
   * HELPERS
   * - triggerFetch
   * - setFavourite
  */
  setFavourite = (props) => {
    const { item, user } = props;

    const favourite = user.favourites && user.favourites.find(f =>
      f.attributes.resourceId === item.content.widgetId
    );

    props.setFavourite({
      id: `${item.content.widgetId}/${item.id}`,
      value: favourite || {}
    });
  }

  triggerFetch = props => props.fetchWidget({
    id: props.item.content.widgetId,
    itemId: props.item.id
  })

  render() {
    return createElement(WidgetBlockComponent, {
      onToggleModal: (modal) => {
        const { item } = this.props;

        this.props.setWidgetModal({
          id: `${item.content.widgetId}/${item.id}`,
          value: modal
        });
      },
      onToggleLoading: (loading) => {
        const { item } = this.props;

        this.props.setWidgetLoading({
          id: `${item.content.widgetId}/${item.id}`,
          value: loading
        });
      },
      onToggleFavourite: (favourite, widget) => {
        const { item } = this.props;

        this.props.toggleFavourite({
          id: `${item.content.widgetId}/${item.id}`,
          favourite,
          widget
        });
      },
      onToggleLayerGroupVisibility: (layerGroup) => {
        const { data, item } = this.props;
        const layers = [...data[`${item.content.widgetId}/${item.id}`].layers];

        const layerGroups = layers.map((l) => {
          if (l.dataset !== layerGroup.dataset) return l;
          return Object.assign({}, l, { visible: !layerGroup.visible });
        });

        this.props.setLayers({
          id: `${item.content.widgetId}/${item.id}`,
          value: layerGroups
        });
      },
      ...this.props
    });
  }
}
export default connect(
  state => ({
    data: state.widgetBlock,
    user: state.user
  }),
  actions
)(WidgetBlock);
