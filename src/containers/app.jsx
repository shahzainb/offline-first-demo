import styles from '../styles/index.scss';
import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Nav from '../components/nav';
import {blue600} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Posts from '../components/posts';
import ServiceWorker from '../components/serviceWorker';
import Snackbar from 'material-ui/Snackbar';

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: blue600,
  },
});

export default class App extends React.Component {
  constructor (props, context) {
    super(props, context);

    this.toggleServiceWorker = this.toggleServiceWorker.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);

    this.state = {
      isOffline: !navigator.onLine,
      isServiceWorkerEnabled: true,
      open: false,
      message: ''
    }
  }

  componentDidMount () {
    window.addEventListener('online', () => {
      console.log('online!');
      this.setState({
        isOffline: false
      })
    });

    window.addEventListener('offline', () => {
      console.log('offline!');
      this.setState({
        isOffline: true,
        open: true,
        message: `You're now offline! Don't worry you can still read the articles.`
      })
    });
  }

  toggleServiceWorker (toggleState) {
    console.log('Is service worker enabled? ', toggleState);
    this.setState({
      isServiceWorkerEnabled: toggleState
    });
    localStorage.setItem('isServiceWorkerEnabled', toggleState);
  }

  handleRequestClose () {
    this.setState({
      open: false
    });
  }

  render () {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <Nav
            isOffline={this.state.isOffline}
            isServiceWorkerEnabled={this.state.isServiceWorkerEnabled}
            toggleServiceWorker={this.toggleServiceWorker}
          />
          <Posts isOffline={this.state.isOffline} />
          <ServiceWorker
            isServiceWorkerEnabled={this.state.isServiceWorkerEnabled}
          />
          <Snackbar
            open={this.state.open}
            message={this.state.message}
            autoHideDuration={2000}
            onRequestClose={this.handleRequestClose}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}
