import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link } from 'routes';

// Components
import Title from 'components/ui/Title';
import DatasetsRelatedContent from 'components/datasets/common/DatasetsRelatedContent';
import Icon from 'components/ui/Icon';
import Tooltip from 'rc-tooltip/dist/rc-tooltip';
import CollectionsPanel from 'components/collections-panel';

// helpers
import { belongsToACollection } from 'components/collections-panel/collections-panel-helpers';

class DatasetsListCard extends PureComponent {
  static defaultProps = {
    routes: {
      index: '',
      detail: ''
    },
    dataset: {}
  };

  static propTypes = {
    dataset: PropTypes.object,
    routes: PropTypes.object,
    user: PropTypes.object.isRequired,
    onDatasetRemoved: PropTypes.func.isRequired
  };

  getDatasetName() {
    const { dataset } = this.props;
    const metadata = dataset.metadata[0];

    if (metadata && metadata.attributes.info && metadata.attributes.info.name) {
      return metadata.attributes.info.name;
    }

    return dataset.name;
  }

  canUserRemove = (user={}, dataset) => {
    if (!user.role) return;
    const userRole = user.role.toLowerCase();
    return (userRole === 'admin') || (userRole === 'manager' && user.id === dataset.userId);
  };

  handleDelete = () => {
    const { dataset } = this.props;
    this.props.onDatasetRemoved(dataset);
  }

  render() {
    const { dataset, routes, user } = this.props;
    const isInACollection = belongsToACollection(user, dataset);
    const starIconName = classnames({
      'icon-star-full': isInACollection,
      'icon-star-empty': !isInACollection
    });
    const isOwnerOrAdmin = (dataset.userId === user.id || user.role === 'ADMIN');

    return (
      <div className="c-card c-datasets-list-card">
        <div className="card-container">
          <header className="card-header">
            {isOwnerOrAdmin &&
              <Link
                route={routes.detail}
                params={{ tab: 'datasets', id: dataset.id }}
              >
                <a>
                  <Title className="-default">
                    {this.getDatasetName()}
                  </Title>
                </a>
              </Link>
            }

            {!isOwnerOrAdmin &&
              <Title className="-default">
                {this.getDatasetName()}
              </Title>
            }

            <div>{dataset.provider}</div>

            <Tooltip
              overlay={<CollectionsPanel
                resource={dataset}
                resourceType="dataset"
              />}
              overlayClassName="c-rc-tooltip"
              overlayStyle={{
                color: '#1a3e62'
              }}
              placement="bottom"
              trigger="click"
            >
              <button
                className="c-btn favourite-button"
                tabIndex={-1}
              >
                <Icon
                  name={starIconName}
                  className="-star -small"
                />
              </button>
            </Tooltip>
          </header>

          <div className="card-content">
            {dataset.status === 'saved' &&
              <DatasetsRelatedContent
                dataset={dataset}
                route={routes.detail}
              />
            }
            {dataset.status !== 'saved' &&
              dataset.status
            }
          </div>

          { this.canUserRemove(user, dataset) &&
            <div className="actions">
              <a
                role="button"
                className="c-button -tertiary -compressed"
                tabIndex={0}
                onClick={this.handleDelete}
              >
                Delete
              </a>
            </div>
          }
        </div>
      </div>
    );
  }
}

export default DatasetsListCard;
