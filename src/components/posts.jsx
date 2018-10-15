import React from 'react';
import { Card, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import { blue600 } from 'material-ui/styles/colors';
import Paper from 'material-ui/Paper';
import Snackbar from 'material-ui/Snackbar';
import { propEq, findIndex } from 'ramda';
import { contentfulClient, pouch } from './../utils/db';
import placeholderImage from './../images/placeholder-1080x607.png';

const paperStyle = {
  padding: 10,
  marginTop: 10
};

export default class Posts extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.getEntry = this.getEntry.bind(this);
    this.addProducts = this.addProducts.bind(this);
    this.addPlp = this.addPlp.bind(this);
    this.updateContent = this.updateContent.bind(this);
    this.updateProducts = this.updateProducts.bind(this);
    this.updatePlp = this.updatePlp.bind(this);

    this.state = {
      posts: [],
      open: false,
      message: '',
      products: [],
      meta: {},
      isUpdating: false,
    };
  }

  componentDidMount() {
    const productsSyncToken = window.localStorage.getItem('productsSyncToken');
    const contentfulSyncToken = window.localStorage.getItem('contentfulSyncToken');

    window.addEventListener('online', this.updateContent);
    window.addEventListener('offline', this.updateContent);

    if (contentfulSyncToken) {
      console.log('I have plp sync token');
      this.updateContent();
    }
    else {
      contentfulClient.sync({
        initial: true,
        type: 'Entry',
        content_type: 'testPlpContent',
        include: 2
      })
        .then((response) => {
          console.log('fetching first instance of plp');
          console.log(response);
          const {title, description, products} = response.entries[0].fields;
          const meta = {
            title: title.en,
            description: description.en,
            productIDs: products.en.reduce((arr, product) => {
              arr.push(product.sys.id);
              return arr;
            }, [])
          };

          window.localStorage.setItem('contentfulSyncToken', response.nextSyncToken);
          this.setState({
            meta
          });

          this.addPlp(meta);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    if (productsSyncToken) {
      console.log('I have products token');
      this.updateContent();
    }
    else {
      contentfulClient.sync({
        content_type: 'testProducts',
        type: 'Entry',
        initial: true,
        include: 2
      })
        .then(response => {
          console.log('Im fetching products first time');
          console.log(response);
          window.localStorage.setItem('productsSyncToken', response.nextSyncToken);
          const products = response.entries.reduce((arr, product) => {
            product.fields.id = product.sys.id;
            arr.push(product.fields);
            return arr;
          }, []);

          this.addProducts(products);
        })
        .catch(err => {
          console.log(err);
        });
    }

    pouch.changes({
      since: 'now',
      live: true
    }).on('change', this.updateContent);
  }

  handleRequestClose() {
    this.setState({
      open: false
    });
  }

  updateContent() {
    if (navigator.onLine && !this.state.isUpdating) {
      this.setState({
        isUpdating: true
      }, () => {
        contentfulClient.sync({
          content_type: 'testProducts',
          nextSyncToken: localStorage.getItem('productsSyncToken')
        })
          .then(response => {
            window.localStorage.setItem('productsSyncToken', response.nextSyncToken);
            console.log('i went to sync products');
            if (response.entries.length > 0) {
              console.log('Product changed!');
              const products = response.entries.reduce((arr, product) => {
                product.fields.id = product.sys.id;
                arr.push(product.fields);
                return arr;
              }, []);
              this.setState({
                open: true,
                message: `Product content updated!`
              });
              this.updateProducts(products);
            }
          })
          .catch(err => {
            console.log(err);
          });

        contentfulClient.sync({
          content_type: 'testPlpContent',
          nextSyncToken: localStorage.getItem('contentfulSyncToken')
        })
          .then(response => {
            console.log(response);
            window.localStorage.setItem('contentfulSyncToken', response.nextSyncToken);
            console.log('i went to sync plp');
            if (response.entries.length > 0) {
              console.log('PLP changed!');
              const {title, description, products} = response.entries[0].fields;
              const meta = {
                title: title.en,
                description: description.en,
                productIDs: products.en.reduce((arr, product) => {
                  arr.push(product.sys.id);
                  return arr;
                }, [])
              };
              this.setState({
                meta,
                open: true,
                message: 'PLP Content Updated!'
              });
              this.updatePlp(meta);
            }
            pouch.allDocs({include_docs: true, descending: true}, (err, doc) => {
              const posts = [];
              let meta = {};

              doc.rows.forEach(product => {
                const post = product.doc;

                if (post.id) {
                  posts.push(post);
                }
                else {
                  meta = post;
                }

                this.setState({
                  posts,
                  meta,
                  isUpdating: false
                });
              });
            });
          })
          .catch(err => {
            console.log(err);
          });
      });

    }
  }

  getEntry(id) {
    return contentfulClient.getEntry(id);
  }

  addProducts(products) {
    console.log('Im adding products');
    console.log(products);
    products.forEach(product => {
      contentfulClient.getAsset(product.image.en.sys.id)
        .then(image => {
          product._id = product.id;
          product.image = {
            url: image.fields.file.url
          };
          pouch.put(product, (err, result) => {
            if (!err) {
              console.log('pouch added product');
            }
            if (err) {
              console.log(err);
            }
          });
        })
        .catch(err => console.log(err));
    });
  }

  addPlp(plpData) {
    console.log('Im adding plp');
    plpData._id = 'plpMetaData';
    pouch.put(plpData, (err, result) => {
      if (!err) {
        console.log('pouch added plp data');
      }
      if (err) {
        console.log(err);
      }
    });
  }

  updatePlp(plpData) {
    pouch.get('plpMetaData')
      .then(doc => {
        plpData._id = doc._id;
        plpData._rev = doc._rev;
        return pouch.put(plpData);
      })
      .then(res => {
        console.log('pouch added plp data');
      })
      .catch(err => console.log(err));
  }

  updateProducts(products) {
    products.forEach(product => {
      contentfulClient.getAsset(product.image.en.sys.id)
        .then(image => {
          console.log(product);
          console.log('in image');
          console.log(image);
          product.image = {
            url: image.fields.file.url
          };
          pouch.get(product.id)
            .then(doc => {
              console.log('getting that doc');
              console.log(doc);
              product._id = doc._id;
              product._rev = doc._rev;
              return pouch.put(product);
            })
            .then(() => {
              console.log('pouch added product');
            })
            .catch(err => {
              if (err.status === 404) {
                product._id = product.id;
                return pouch.put(product);
              }
            })
            .then(() => {
              console.log('pouch added new product');
            })
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    });
  }

  render() {

    let posts = (this.state.posts.length > 0) ? this.state.posts.map(post => {
      if (this.state.meta.productIDs.indexOf(post.id) > -1) {
        return (
          <Card key={post.id} style={paperStyle}>
            <CardMedia>
              <img src={(!this.props.isOffline) ? post.image.url : placeholderImage}/>
            </CardMedia>
            <CardTitle title={post.title.en} subtitle={post.subtitle.en}/>
            <CardText>
              {post.description.en}
            </CardText>
          </Card>
        )
      }
    }) : [];

    return (
      <div>
        <Paper style={paperStyle} zDepth={1} rounded={false}>
          <h1>{this.state.meta.title ? this.state.meta.title : 'Welcome to Demo'}</h1>
          <h3>{this.state.meta.description ? this.state.meta.description : 'This demo is built with Firebase, React and Material-UI'}</h3>
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
