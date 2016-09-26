import React from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import Toggle from 'material-ui/Toggle';

export default class Nav extends React.Component {
  constructor (props) {
    super(props);

    this.toggleMenu = this.toggleMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.onToggle = this.onToggle.bind(this);

    this.state = {
      open: false
    }
  }

  toggleMenu () {
    this.setState({
      open: !this.state.open
    })
  }

  closeMenu () {
    this.setState({
      open: false
    })
  }

  onToggle (event, toggleState) {
    this.props.toggleServiceWorker(toggleState);
  }

  render () {
    this.styles = {
      toggle: {
        margin: '16px',
        width: '160px'
      },
      appBarStyle: {
        backgroundColor: (this.props.isOffline) ? 'rgb(181, 181, 181)' : 'rgb(30, 136, 229)'
      }
    };

    return (
      <div>
        <AppBar
          title="Offline First Demo"
          onLeftIconButtonTouchTap={this.toggleMenu}
          style={this.styles.appBarStyle}
        />
        <Drawer
          docked={false}
          width={200}
          open={this.state.open}
          onRequestChange={(open) => this.setState({open})}
        >
          <Toggle
            label="Enable Offline Caching"
            toggled={this.props.isServiceWorkerEnabled}
            style={this.styles.toggle}
            onToggle={this.onToggle}
          />
        </Drawer>
      </div>
    )
  }
}
