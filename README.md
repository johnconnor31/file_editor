# file_editor
Simple online file editor built on ReactJS

Create an interactive online file editor - A small, custom version of [c9](https://c9.io/) - using React JS as core framework and websocket as a protocol for interaction.

## This application should have following functionlity.
- User has option to create new files from frontend. Backend should create a DB/Local storage entry for this file. (Maintain only meta info in DB, its upto your design).
- When ever user makes an update to file or creates a file, all the users connected or new user user connected should receive the update.
- Basically make it real time update by braodcasting the events.
- Make sure frontend looks appealing just like available online editors.

## Technology to use.
- Websocket should be the communication protocol.
- React JS should be used to develop web app.
- Use any backend stack. Using python with tornado webserver and websocket handler of tornado would be bonus.
- Using event queue (RabbitMQ) might be required for a baic architecture. Make sure to consider this unless you find a better alternative.

## How to submit your code?
- Fork this repo to your gitbub profile.
- After completing this task send a link to your updated repo.
- Do not give a pull request.



Solution IMPLEMENTATION:

  Frontend is implemented with React and Material UI for Css. 
  Backend is implemented with expressJs and websockets.
  Files are stored in the local file system and no db is necessary.
  The creation and updation functionality are implemented as of now and it is made sure that the updations reflect in every tab.
  Deletion implementation is in progress.
