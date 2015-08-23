@echo off
TITLE mongodb
start mongod --dbpath "M:\mongodb-win32-i386-2.6.5\data\db"
TITLE mall.js
start nodemon "T:\\offersBhavik\\nodeJs\\mall.js"