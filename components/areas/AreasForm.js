import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';
import { Router } from 'routes';
import { toastr } from 'react-redux-toastr';

// Redux
import { connect } from 'react-redux';
import { toggleModal, setModalOptions } from 'redactions/modal';

// Components
import CustomSelect from 'components/ui/CustomSelect';
import Spinner from 'components/ui/Spinner';
import Field from 'components/form/Field';
import Input from 'components/form/Input';
import UploadAreaIntersectionModal from 'components/modal/UploadAreaIntersectionModal';

// Services
import AreasService from 'services/AreasService';
import UserService from 'services/UserService';

const FORM_ELEMENTS = {
  elements: {
  },
  validate() {
    const elements = this.elements;
    Object.keys(elements).forEach((k) => {
      elements[k].validate();
    });
  },
  isValid() {
    const elements = this.elements;
    const valid = Object.keys(elements)
      .map(k => elements[k].isValid())
      .filter(v => v !== null)
      .every(element => element);

    return valid;
  }
};

const AREAS = [
  {
    label: 'Custom area',
    value: 'custom',
    items: [
      {
        label: 'Upload new area',
        value: 'upload',
        as: 'Custom area'
      }
    ]
  }
];

class AreasForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      areaOptions: [],
      loadingAreaOptions: false,
      loading: false,
      name: '',
      geostore: null
    };

    // Services
    this.areasService = new AreasService({ apiURL: process.env.WRI_API_URL });
    this.userService = new UserService({ apiURL: process.env.WRI_API_URL });
  }

  componentDidMount() {
    this.loadAreas();
    if (this.props.id) {
      this.loadArea();
    }
  }

  @Autobind
  onSubmit(e) {
    e.preventDefault();

    const { name, geostore } = this.state;
    const { user, mode, id } = this.props;

    if (geostore) {
      this.setState({
        loading: true
      });

      if (mode === 'new') {
        this.userService.createNewArea(name, geostore, user.token)
          .then(() => {
            Router.pushRoute('admin_myprep', { tab: 'areas' });
            toastr.success('Success', 'Area successfully created!');
          })
          .catch(err => this.setState({ error: err, loading: false }));
      } else if (mode === 'edit') {
        this.userService.updateArea(id, name, user.token)
          .then(() => {
            Router.pushRoute('admin_myprep', { tab: 'areas' });
            toastr.success('Success', 'Area successfully updated!');
          })
          .catch(err => this.setState({ error: err, loading: false }));
      }
    } else {
      toastr.info('Data missing', 'Please select an area');
    }
  }

  @Autobind
  async onChangeSelectedArea(value) {
    return new Promise((resolve) => {
      if (value.value === 'upload') {
        this.props.toggleModal(true, {
          children: UploadAreaIntersectionModal,
          childrenProps: {
            onUploadArea: (id) => {
              this.setState({
                geostore: id
              });

              // We close the modal
              this.props.toggleModal(false, {});
              resolve(true);
            }
          },
          onCloseModal: () => resolve(false)
        });
      } else {
        this.setState({
          geostore: value.value
        });
        resolve(true);
      }
    });
  }

  @Autobind
  handleNameChange(value) {
    this.setState({
      name: value
    });
  }

  loadAreas() {
    this.setState({
      loadingAreaOptions: true
    });
    this.areasService.fetchCountries().then((response) => {
      this.setState({
        areaOptions: [...AREAS,
          ...response.map(elem => ({ value: elem.geostoreId, label: elem.name || '' }))],
        loadingAreaOptions: false
      });
    });
  }

  loadArea() {
    const { id, user } = this.props;
    this.userService.getArea(id, user.token).then((response) => {
      const area = response.data.attributes;
      this.setState({
        name: area.name,
        geostore: area.geostore
      });
    });
  }

  render() {
    const {
      areaOptions,
      loadingAreaOptions,
      loading,
      geostore,
      name
    } = this.state;
    const { mode } = this.props;

    return (
      <div className="c-areas-form">
        <Spinner loading={loading || loadingAreaOptions} className="-light" />
        <form className="c-form" onSubmit={this.onSubmit}>
          <fieldset className="c-field-container">
            <Field
              ref={(c) => { if (c) FORM_ELEMENTS.elements.name = c; }}
              onChange={this.handleNameChange}
              validations={['required']}
              properties={{
                name: 'name',
                label: 'Name',
                type: 'text',
                value: name,
                required: true
              }}
            >
              {Input}
            </Field>
          </fieldset>
          {mode === 'new' &&
            <div
              className="selectors-container"
            >
              <Spinner isLoading={loadingAreaOptions || loading} className="-light -small" />
              <CustomSelect
                placeholder="Select area"
                options={areaOptions}
                onValueChange={this.onChangeSelectedArea}
                allowNonLeafSelection={false}
                value={geostore}
                waitForChangeConfirmation
                disabled={mode === 'edit'}
              />
            </div>
          }
          <div className="buttons-div">
            <button onClick={() => Router.pushRoute('admin_myprep', { tab: 'areas' })} className="c-btn -app">
              Cancel
            </button>
            <button type="submit" className="c-btn -primary">
              Submit
            </button>
          </div>
        </form>
      </div>
    );
  }
}

AreasForm.propTypes = {
  mode: PropTypes.string.isRequired, // edit | new
  id: PropTypes.string, // area id for edit mode
  // Store
  user: PropTypes.object.isRequired,
  toggleModal: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  toggleModal: (open, opts) => { dispatch(toggleModal(open, opts)); },
  setModalOptions: (options) => { dispatch(setModalOptions(options)); }
});

export default connect(mapStateToProps, mapDispatchToProps)(AreasForm);
