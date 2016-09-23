import styles from './styles/index.scss';
import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Nav from './components/nav';
import {blue600} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Posts from './components/posts';
import ServiceWorker from './components/serviceWorker';

// import ServiceWorker from './utils/serviceWorker';
//
// ServiceWorker.init();

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: blue600,
  },
});

export default class App extends React.Component {
  constructor (props, context) {
    super(props, context);
  }

  render () {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <Nav />
          <Posts />
          <ServiceWorker />
        </div>
      </MuiThemeProvider>
    );
  }
}
