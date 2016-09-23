import React from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

export default class Nav extends React.Component {
  constructor () {
    super();

    this.toggleMenu = this.toggleMenu.bind(this);
    this.closeMenu = this.closeMenu.bind(this);

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

  render () {
    return (
      <div>
        <AppBar
          title="Offline First Demo"
          onLeftIconButtonTouchTap={this.toggleMenu}
          iconElementRight={
            <div>{(navigator.onLine) ? 'Online': 'Offline'}</div>
          }
        />
        <Drawer
          docked={false}
          width={200}
          open={this.state.open}
          onRequestChange={(open) => this.setState({open})}
        >
          <MenuItem onTouchTap={this.closeMenu}>Upload Document</MenuItem>
        </Drawer>
      </div>
    )
  }
}
