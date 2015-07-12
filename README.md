offers
======

Offers around you

//Bhavik
Important commands used in installation.

use -g flag while installing node modules and then link Global modules to local devl with the following commands

npm install module_name -g

npm link module_name

This will create a node_module folder in your project directory and then create symbolic links to the global module location 


npm install minify -g
npm link minify

npm install underscore -g
npm link underscore

npm install mongodb -g
npm link mongodb

npm install config -g
npm link config

To run mongo
mongod --dbpath "pathTo/data/db"


Run this command to add Geolocation plugin to the existing project.

cordova plugin add cordova-plugin-geolocation


API is based on the W3C Geolocation API Specification. Some devices (Android, BlackBerry, Bada, Windows Phone 7,
webOS and Tizen, to be specific) already provide an implementation of this spec. For those devices, the built-in
support is used instead of replacing it with Cordova's implementation. For devices that don't have geolocation support, 
the Cordova implementation adheres to the W3C specification.