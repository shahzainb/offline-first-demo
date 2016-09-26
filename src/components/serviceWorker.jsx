import React from 'react';
import Snackbar from 'material-ui/Snackbar';

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
      navigator
        .serviceWorker
        .register('service-worker.js')
        .then(registration => {

          if (registration.installing) {
            this.setState({
              serviceWorker: registration.installing,
              state: 'installing',
            });
            console.log('installing');
          }
          else if (registration.waiting) {
            this.setState({
              serviceWorker: registration.waiting,
              state: 'waiting'
            });
            console.log('waiting');
          }
          else if (registration.active) {
            this.setState({
              serviceWorker: registration.active,
              state: 'active'
            });
            console.log('active');
          }

          if (this.state.serviceWorker) {
            console.log(`Service Worker is ${this.state.serviceWorker.state}`);
            this.state.serviceWorker.addEventListener('statechange', e => {
              this.setState({
                state: e.target.state,
                message: 'Content is now available offline!',
                open: true
              });
              console.log(e.target.state);
            });
          }
        })
        .catch((e) => {
          console.error('Error during service worker registration:', e);
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
