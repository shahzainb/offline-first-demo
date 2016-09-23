import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {blue600} from 'material-ui/styles/colors';
import Paper from 'material-ui/Paper';
import {propEq, findIndex} from 'ramda';
import db from './../utils/db';

const paperStyle = {
  padding: 10,
  marginTop: 10
};

export default class Posts extends React.Component {
  constructor (props, context) {
    super(props, context);

    this.state = {
      isLoading: true,
      isOffline: false,
      posts: []
    }
  }

  componentDidMount () {
    const postsRef = db.database().ref('posts');
    window.addEventListener('online', e => {
      console.log('online!');
      this.setState({
        isOffline: false
      })
    });

    window.addEventListener('offline', e => {
      console.log('offline!');
      this.setState({
        isOffline: true
      })
    });

    postsRef
      .on('child_added', (data) => {
        let posts = this.state.posts;
        const post = data.val();
        console.log(post);

        posts.push(post);

        this.setState({
          posts
        });
      });

     postsRef
      .on('child_changed', (data) => {
        let posts = this.state.posts;
        const post = data.val();
        console.log(post);
        posts[findIndex(propEq('uid', post.uid))(posts)] = post;

        this.setState({
          posts
        });
      });

    postsRef
      .on('child_removed', (data) => {
        let posts = this.state.posts;
        const post = data.val();
        console.log(post);
        posts.splice(findIndex(propEq('uid', post.uid))(posts), 1);

        this.setState({
          posts
        });
      });
  }

  render () {

    let posts = (this.state.posts.length > 0) ? this.state.posts.map(post => {
      return (<Card key={post.uid} style={paperStyle}>
        <CardMedia>
          <img src={(!this.state.isOffline) ? post.imgUrl : 'images/placeholder-1080x607.png'} />
        </CardMedia>
        <CardTitle title={post.title} subtitle={post.summary} />
        <CardText>
          {post.body}
        </CardText>
      </Card>)
    }) : [];

    return (
      <div>
        <Paper style={paperStyle} zDepth={1} rounded={false}>
          <h1>Welcome to Demo</h1>
          <h2>This demo is built with Firebase, React and Material-UI</h2>
        </Paper>
        {posts}
      </div>
    );
  }
}
