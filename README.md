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
