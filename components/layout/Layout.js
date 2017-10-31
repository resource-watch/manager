import React from 'react';
import PropTypes from 'prop-types';
import Progress from 'react-progress-2';

import { Router } from 'routes';

// Redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleModal, setModalOptions } from 'redactions/modal';
import { toggleTooltip } from 'redactions/tooltip';
import { setUser } from 'redactions/user';
import { updateIsLoading } from 'redactions/page';

// Components
import Header from 'components/layout/Header';
import Footer from 'components/layout/Footer';
import Head from 'components/admin/layout/head';
import Icons from 'components/admin/layout/icons';
import Modal from 'components/ui/Modal';
import Tooltip from 'components/ui/Tooltip';
import Dock from 'components/ui/Dock';
import Toastr from 'react-redux-toastr';

class Layout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalOpen: false
    };
  }

  componentDidMount() {
    this.props.setUser(this.props.user);

    Router.onRouteChangeStart = () => {
      if (Progress && Progress.Component.instance) Progress.show();
      this.props.toggleTooltip(false);
      this.props.updateIsLoading(true);
    };
    Router.onRouteChangeComplete = () => {
      this.props.updateIsLoading(false);
      if (Progress && Progress.Component.instance) Progress.hideAll();
    };
  }

  componentWillReceiveProps(newProps) {
    if (this.state.modalOpen !== newProps.modal.open) {
      this.setState({ modalOpen: newProps.modal.open });
    }
  }

  render() {
    const { title, description, url, user, modal } = this.props;
    return (
      <div className="l-page">
        <Head
          title={title}
          description={description}
        />

        <Icons />

        <Progress.Component />

        <Header url={url} user={user} />

        <div className="container">
          { this.props.children }
        </div>

        <Footer />

        <Tooltip />

        <Modal
          open={this.state.modalOpen}
          options={modal.options}
          loading={modal.loading}
          toggleModal={this.props.toggleModal}
          setModalOptions={this.props.setModalOptions}
        />

        <Dock />

        <Toastr
          preventDuplicates
          transitionIn="fadeIn"
          transitionOut="fadeOut"
        />
      </div>
    );
  }
}

Layout.propTypes = {
  user: PropTypes.object.isRequired,
  url: PropTypes.object.isRequired,
  children: PropTypes.any.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,

  // Store
  setUser: PropTypes.func.isRequired,

  modal: PropTypes.object,
  toggleModal: PropTypes.func,
  setModalOptions: PropTypes.func,
  toggleTooltip: PropTypes.func,
  updateIsLoading: PropTypes.func
};

const mapStateToProps = state => ({
  modal: state.modal
});


const mapDispatchToProps = dispatch => ({
  toggleTooltip: () => dispatch(toggleTooltip()),
  toggleModal: open => dispatch(toggleModal(open, {}, true)),
  setModalOptions: options => dispatch(setModalOptions(options)),
  setUser: (user) => {
    dispatch(setUser(user));
  },
  updateIsLoading: bindActionCreators(isLoading => updateIsLoading(isLoading), dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
