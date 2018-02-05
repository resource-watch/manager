import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { bindActionCreators } from 'redux';
import { getWidget, toggleLayerGroupVisibility, checkIfFavorited, setIfFavorited } from 'redactions/widget';
import { setEmbed } from 'redactions/common';

// Components
import Page from 'components/app/layout/Page';
import EmbedLayout from 'components/app/layout/EmbedLayout';
import Spinner from 'components/ui/Spinner';
import Map from 'components/widgets/editor/map/Map';
import Legend from 'components/widgets/editor/ui/Legend';
import Icon from 'components/ui/Icon';

// Utils
import LayerManager from 'components/widgets/editor/helpers/LayerManager';

class EmbedMap extends Page {
  static propTypes = {
    widget: PropTypes.object,
    isLoading: PropTypes.bool,
    getWidget: PropTypes.func,
    toggleLayerGroupVisibility: PropTypes.func,
    loading: PropTypes.bool,
    layerGroups: PropTypes.array,
    error: PropTypes.string,
    zoom: PropTypes.number,
    latLng: PropTypes.object
  }

  static defaultProps = {
    widget: {}
  }

  static async getInitialProps(context) {
    const props = await super.getInitialProps(context);
    const { store, isServer, req } = context;

    store.dispatch(setEmbed(true));

    return {
      ...props,
      referer: isServer ? req.headers.referer : location.href
    };
  }

  isLoadedExternally() {
    return !/localhost|staging.resourcewatch.org/.test(this.props.referer);
  }

  constructor(props) {
    super(props);
    this.state = {
      modalOpened: false
    };
  }

  componentDidMount() {
    this.props.getWidget(this.props.url.query.id);

  }

  getModal() {
    const { widget } = this.props;
    return (
      <div className="widget-modal">
        { !widget.attributes.description &&
          <p>No additional information is available</p>
        }

        { widget.attributes.description && (
          <div>
            <h4>Description</h4>
            <p>{widget.attributes.description}</p>
          </div>
        ) }
      </div>
    );
  }

  render() {
    const { widget, loading, layerGroups, error, zoom, latLng, user } = this.props;
    const { modalOpened } = this.state;

    if (loading) {
      return (
        <EmbedLayout
          title={'Loading widget...'}
          description={''}
        >
          <div className="c-embed-widget">
            <Spinner isLoading={loading} className="-light" />
          </div>
        </EmbedLayout>
      );
    }

    if (error) {
      return (
        <EmbedLayout
          title={'Resource Watch'}
          description={''}
        >
          <div className="c-embed-widget">
            <div className="widget-title">
              <h4>–</h4>
            </div>

            <div className="widget-content">
              <p>{'Sorry, the widget couldn\'t be loaded'}</p>
            </div>

            { this.isLoadedExternally() && (
              <div className="widget-footer">
                <a href="/" target="_blank" rel="noopener noreferrer">
                  <img
                    className="embed-logo"
                    src={'/static/images/logo-embed.png'}
                    alt="Resource Watch"
                  />
                </a>
              </div>
            ) }
          </div>
        </EmbedLayout>
      );
    }

    return (
      <EmbedLayout
        title={`${widget.attributes.name}`}
        description={`${widget.attributes.description || ''}`}
      >
        <div className="c-embed-widget">
          <div className="widget-title">
            <a href={`/data/explore/${widget.attributes.dataset}`} target="_blank" rel="noopener noreferrer">
              <h4>{widget.attributes.name}</h4>
            </a>
            <div className="buttons">
              <button
                aria-label={`${modalOpened ? 'Close' : 'Open'} information modal`}
                onClick={() => this.setState({ modalOpened: !modalOpened })}
              >
                <Icon name={`icon-${modalOpened ? 'cross' : 'info'}`} className="c-icon -small" />
              </button>
            </div>
          </div>

          <div className={classnames('widget-content', { '-external': this.isLoadedExternally() })}>
            <Map
              LayerManager={LayerManager}
              mapConfig={{ zoom, latLng }}
              layerGroups={layerGroups}
            />

            <Legend
              layerGroups={layerGroups}
              className={{ color: '-dark' }}
              toggleLayerGroupVisibility={
                layerGroup => this.props.toggleLayerGroupVisibility(layerGroup)
              }
              setLayerGroupsOrder={() => {}}
              setLayerGroupActiveLayer={() => {}}
              interactionDisabled
              expanded={false}
            />

            { modalOpened && this.getModal() }
          </div>
          { this.isLoadedExternally() && (
            <div className="widget-footer">
              Powered by
              <a href="/" target="_blank" rel="noopener noreferrer">
                <img
                  className="embed-logo"
                  src={'/static/images/logo-embed.png'}
                  alt="Resource Watch"
                />
              </a>
            </div>
          ) }
        </div>
      </EmbedLayout>
    );
  }
}

const mapStateToProps = state => ({
  widget: state.widget.data,
  loading: state.widget.loading,
  error: state.widget.error,
  layerGroups: state.widget.layerGroups,
  zoom: state.widget.zoom,
  latLng: state.widget.latLng
});

const mapDispatchToProps = dispatch => ({
  getWidget: bindActionCreators(getWidget, dispatch),
  toggleLayerGroupVisibility: bindActionCreators(toggleLayerGroupVisibility, dispatch)
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(EmbedMap);
