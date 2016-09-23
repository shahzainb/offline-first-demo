#!/bin/sh
':' //; exec "$(command -v ./node_modules/.bin/babel-node)" "$0" "$@"

import firebase from 'firebase';

const db = firebase.initializeApp({
  apiKey: 'AIzaSyBInyV2GrpOcqGqrJke-9puaTowRGBSPZ0',
  authDomain: 'offline-first-demo.firebaseapp.com',
  databaseURL: 'https://offline-first-demo.firebaseio.com',
  storageBucket: '',
});

function addPosts () {
  const postData = {
    author: 'test-3',
    uid: '3',
    body: `Gabion gaff strike colors pinnace topgallant Sail ho parley Chain Shot galleon crimp. List loot main sheet tack hearties line Brethren of the Coast starboard draught league. Pirate gangplank matey lookout heave down come about yardarm gangway black spot run a rig.
Transom cog smartly spanker Admiral of the Black six pounders wherry chantey hempen halter spirits. Swing the lead aft stern gally skysail hardtack spanker topsail ho fore. Cog pinnace fathom parrel strike colors man-of-war boatswain crimp coxswain yawl.
Take a caulk clipper walk the plank hempen halter blow the man down lanyard league yard Admiral of the Black coxswain. Overhaul jib aye salmagundi yo-ho-ho maroon lookout gangplank spike Nelsons folly. Fluke tack pink chase bring a spring upon her cable carouser keel scuttle measured fer yer chains knave.`,
    summary: 'Gabion gaff strike colors pinnace topgallant Sail ho parley Chain Shot galleon crimp. List loot main sheet tack hearties line Brethren of the Coast starboard draught league. Pirate gangplank matey lookout heave down come about yardarm gangway black spot run a rig.',
    title: 'Test 3',
    imgUrl: 'https://ichef.bbci.co.uk/images/ic/1120xn/p048s3cs.jpg'
  };

  // Get a key for a new Post.
  const newPostKey = db.database().ref().child('posts').push().key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  let updates = {};
  updates['/posts/' + newPostKey] = postData;

  return db.database().ref().update(updates);
}

addPosts().then(() => {
  console.log('DONE');
  process.exit(0);
});
