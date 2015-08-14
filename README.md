# readjudication
Test application that I have developed to see the differences in development between AngularJS and ReactJS. Very simple application using NodeJS (Express) + MongoDB on the backend serving a very simple REST service for search, and two front ends implementations: ReactJS and AngularJS, both using Bootstrap.

This is my first project using ReacjJS, AngularJS, NodeJS, MongoDB and Bootstrap, so please forgive all the mistakes that it might have, I am a noob on all this...

To start the application:
  1 - Start MongoDB on the /data folder using the following command:
    <path_to_your_mongodb_installation>/bin> mongod --dbpath <path_to_your_git_folder>/readjudication/data
    
  1.1 - if you want to know what kind of data to put into MongoDB, check the readjudication/public/data.json file
    
  2 - Start NodeJS
    <path_to_your_git_folder>/readjudication> npm start
    
  3 - Access the following URLs:
    http://localhost:3000/merchantlist -> list of merchants on the database
    http://localhost:3000/startReadjudicationAngular.html -> front end on AngularJS
    http://localhost:3000/startReadjudicationReact.html -> Front end on ReactJS
