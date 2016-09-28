import React from 'react';
import Snackbar from 'material-ui/Snackbar';
import runtime from 'serviceworker-webpack-plugin/lib/runtime';
import registerEvents from 'serviceworker-webpack-plugin/lib/browser/registerEvents';

export default class ServiceWorker extends React.Component {
  constructor () {
    super();

    this.handleRequestClose = this.handleRequestClose.bind(this);

    this.state = {
      serviceWorker: {},
      state: '',
      open: false,
      message: ''
    }
  }

  componentDidMount () {
    if ('serviceWorker' in navigator && this.props.isServiceWorkerEnabled) {

      const registration = runtime.register();

      registerEvents(registration, {
        onInstalled: () => {
          this.setState({
            state: 'installed',
            message: 'Content is now available offline!',
            serviceWorker: registration.active,
            open: true
          });
          console.log('installed');
        },
        onUpdateReady: () => {
          this.setState({
            state: 'updateReady',
            message: 'Content is ready to update!',
            open: true
          });
          console.log('updateReady');
        },
        onUpdating: () => {
          this.setState({
            state: 'updating',
            message: 'Content is updating!',
            open: true
          });
          console.log('updating');
        },
        onUpdateFailed: () => {
          this.setState({
            state: 'updateFailed',
            message: 'Content failed to update!',
            open: true
          });
          console.log('updateFailed');
        },
        onUpdated: () => {
          this.setState({
            state: 'updated',
            message: 'Updated content is now available offline!',
            open: true
          });
          console.log('updated');
        },
      });
    }
  }

  handleRequestClose () {
    this.setState({
      open: false
    });
  }

  render () {

    if (this.state.serviceWorker && !this.props.isServiceWorkerEnabled) {
      console.log('Deleting all Cache');
      this.state.serviceWorker.postMessage({command: 'delete_all'});
    }

    return (
      <div>
        <Snackbar
          open={this.state.open}
          message={this.state.message}
          autoHideDuration={2000}
          onRequestClose={this.handleRequestClose}
        />
      </div>
    );
  }
}
