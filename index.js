'use strict';

process.env.DEBUG = 'actions-on-google:*';
const App = require('actions-on-google').ApiAiApp;
var request = require('request');
var cheerio = require('cheerio');
var resSplit = ''; //splitting the lines from menu
var r = ''; //will hold the menu
var log = 0; //prevents menu repeating

var num1 = 565; //line of menu
var num2 = 30; //how many characters from menu line


const MEAL_ACTION = 'meal_request';
const MEAL_ARGUMENT = 'meal';

function getMenu(num1, num2){
  request('http://cs.flsouthern.edu/~croberson/menu.html', function(err, res, body){
    var $ = cheerio.load(body);
    var cont = $('#page-content .container div').text();
    var raw = cont.substr(num1); //string of menu items
    raw = raw.substr(0, num2); //refined string
    resSplit += raw.split('\n');
  });
  return resSplit.toString();
}
//r = getMenu(num1, num2); //loads menu, output will be empty without this


// [START FloridaSouthern]
exports.FloridaSouthern = (request, response) => {
  const app = new App({request, response});
  console.log('Request headers: ' + JSON.stringify(request.headers));
  console.log('Request body: ' + JSON.stringify(request.body));
  let meal = app.getArgument(MEAL_ARGUMENT);


  if (meal == 'breakfast' && log <= 0){
    num1 = 367;
    num2 = 22;
    r = getMenu(num1, num2); //loads menu, output will be empty without this
  
  }
  if (meal == 'lunch' && log <= 0){
    num1 = 398;
    num2 = 36;
    r = getMenu(num1, num2); //loads menu, output will be empty without this

  }
  if (meal == 'dinner' && log <= 0){
    num1 = 565; //line to grab from
    num2 = 30; //pulling food from above line
    r = getMenu(num1, num2); //loads menu, output will be empty without this

  }
  //r = getMenu(num1, num2); //loads menu, output will be empty without this

  //respond with meal
  function meal_request (app) {
    let meal = app.getArgument(MEAL_ARGUMENT);
     if (log <= 0){
      r = getMenu(num1, num2);
      log += 1;
    }
    app.tell('Today we are serving delicious ' + r + ' for ' + meal + '.');  
  }

  let actionMap = new Map();
  actionMap.set(MEAL_ACTION, meal_request);

  app.handleRequest(actionMap);
};
r = getMenu(); //resets the string
// [END FloridaSouthern]
