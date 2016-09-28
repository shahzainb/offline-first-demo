# Offline-first demo

### What this is
Just a quick demo thrown together to demonstrate some functionalities
of Progressive Web Apps with the Offline-first pattern in mind.

At the moment it uses [Firebase](https://firebase.google.com/), 
[Material-UI](http://www.material-ui.com/#/) and 
[React](https://facebook.github.io/react/).

### To run

* You'll need to have [git](https://git-scm.com/) and [node](https://nodejs.org/en/) 
6+ installed in your system.
* You'll also need to create a project in Firebase and get the API
key. [Sign up for a free account](https://www.firebase.com/login/). 
Then go into project settings and find
the API key and paste it into the config.json in src/config.
To ensure that you don't accidentally commit your config.json to Github,
run:

```
git update-index --assume-unchanged src/config/config.json
```

* Fork and clone the project:

```
git clone THIS_REPO_URL
```

* Then install the dependencies:

```
npm install
```

* Run development server:

```
npm start
```

Open the web browser to `http://localhost:8888/`

### To build production package

```
npm run build
```

### Notes about sw-precache
[sw-precache](https://github.com/GoogleChrome/sw-precache) is a project 
created by some developers at Google to help adding 
[Service Workers](https://developers.google.com/web/fundamentals/primers/service-worker/?hl=en) 
to a web app to begin to make it a Progressive Web App.

With the sw-precache config, you specify what files you want to precache
and the generated service-worker.js file handles the whole lifecycle.
The only extra thing you as a dev need to do, is to handle registration
of the SW. If you have a look at service-worker.jsx in src/components,
you can see an example of this.

The generated service-worker.js file does not handle everything that a 
Service Worker is capable of doing however. You would need to import
your own scripts if you want to do more advanced things such as
Push Notifications, Background Syncing, caching of AJAX files, etc.

### To-do
* Refactor service-worker.jsx to not be a stateful component
* Add redux for state management
* Add PouchDB and switch between firebase or PouchDB
