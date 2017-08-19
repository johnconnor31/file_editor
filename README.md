# file_editor
A React App to simple online file editor

Create an interactive online file editor using React JS as core framework and websocket as a protocol for interacting. 

## This application should have following functionlity.
- User has option to create new files from frontend. Backend should create a DB/Local storage entry for this file (Maintain only meta info in DB, its upto your design).
- When ever user makes an update to file or creates a file, all the users connected or new user user connected should receive the update.
- Basically make it real time update by braodcasting the events.
- Make sure frontend looks appealing just like available online editors.

## Technology to use.
- Websocket should be the communication protocol.
- React JS should be used to develop web app.
- Use any backend stack. Using python with tornado webserver and websocket handler of tornado is bonus.
- Using event queue might be required for a baic architecute. Make sure to consider this unless to you find an alternative.

## How to submit your code?
- Fork this repo to your gitbub profile.
- After completing this task send a link to your updated repo.
- Do not give a pull request.
