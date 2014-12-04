@echo off
TITLE mongodb
start mongod --journal
TITLE mall.js
start nodemon "F:\Technical\xampp\htdocs\demo\offers\nodeJs\mall.js"