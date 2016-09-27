import React from 'react';
import {Card, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {blue600} from 'material-ui/styles/colors';
import Paper from 'material-ui/Paper';
import Snackbar from 'material-ui/Snackbar';
import {propEq, findIndex} from 'ramda';
import db from './../utils/db';

const paperStyle = {
  padding: 10,
  marginTop: 10
};

export default class Posts extends React.Component {
  constructor (props, context) {
    super(props, context);

    this.handleRequestClose = this.handleRequestClose.bind(this);

    this.state = {
      posts: [],
      open: false,
      message: '',
    }
  }

  componentDidMount () {
    const postsRef = db.database().ref('posts');

    postsRef
      .on('child_added', data => {
        let posts = this.state.posts;
        const post = data.val();
        console.log(post);

        posts.push(post);

        if (posts.length > 2) {
          this.setState({
            open: true,
            message: `New Article: "${post.title}"`
          });
        }

        this.setState({
          posts
        });
      });

     postsRef
      .on('child_changed', data => {
        let posts = this.state.posts;
        const post = data.val();
        console.log(post);
        posts[findIndex(propEq('uid', post.uid))(posts)] = post;

        this.setState({
          posts,
          open: true,
          message: `Updated: "${post.title}"`
        });
      });

    postsRef
      .on('child_removed', (data) => {
        let posts = this.state.posts;
        const post = data.val();
        console.log(post);
        posts.splice(findIndex(propEq('uid', post.uid))(posts), 1);

        this.setState({
          posts,
          open: true,
          message: `Article deleted: "${post.title}"`
        });
      });
  }

  handleRequestClose () {
    this.setState({
      open: false
    });
  }

  render () {

    let posts = (this.state.posts.length > 0) ? this.state.posts.map(post => {
      return (
        <Card key={post.uid} style={paperStyle}>
          <CardMedia>
            <img src={(!this.props.isOffline) ? post.imgUrl : 'images/placeholder-1080x607.png'} />
          </CardMedia>
          <CardTitle title={post.title} subtitle={post.summary} />
          <CardText>
            {post.body}
          </CardText>
        </Card>
      )
    }) : [];

    return (
      <div>
        <Paper style={paperStyle} zDepth={1} rounded={false}>
          <h1>Welcome to Demo</h1>
          <h2>This demo is built with Firebase, React and Material-UI</h2>
        </Paper>
        {posts}
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
