/*
---PLEASE NOTE: THIS IS FOR EDUCATIONAL PURPOSES ONLY---
Script to scrape linkedin contacts for a certain company or search
Authors - Erkin Djindjiev (@SeaErkin)
          Ryan Bradbury (@rj4yb3)
          
Instructions - 
          1) navigate the first page of contacts
          2) open your web browser developer tools 
          3) modify the pageLimit variable to fit the # of pages you'd like to scrape
          4) paste script into console and run
          5) open csv file and enjoy
*/

//FIX MEEEEEEE - set this value to the button ID #
var nextButtonClassSelector = '#ember3190';

// If you want you can set the pages manually, otherwise it will page through all results.
var pageLimitManual = null;

var pageLimitSelector = 'span.search-results__total.search-results__total';
var nameClassSelector = '.actor-name';
var titleClassSelector = 'p.subline-level-1';
var resultsPerPage = 10;

var pageLimit = pageLimitManual || getPageLimit();

var names = [];
var titles = [];

var i = 0;
window.scrollTo(0, document.body.scrollHeight);

getNextPageLoop();

// functions
function scrollFunction() {
  var namesInner = $(nameClassSelector);
  var titlesInner = $(titleClassSelector);
  for (var i = 0; i < namesInner.length; i++) {
    names.push(namesInner[i].innerText);
    titles.push(titlesInner[i].innerText);
  }
  $(nextButtonClassSelector).click();
  window.scrollTo(0, document.body.scrollHeight);
}

function getPageLimit() {
  var pageLimitString =  $(pageLimitSelector)[0].innerText.split(' ')[0];
  return Math.ceil(parseInt(pageLimitString)/resultsPerPage);
}

function jsonToCsv(json, fileName) {
    var fields = Object.keys(json[0]);
    var replacer = function (key, value) { return value === null ? '' : value }
    var csv = json.map(function (row) {
      return fields.map(function (fieldName) {
        return JSON.stringify(row[fieldName], replacer)
      }).join(',')
    })
    csv.unshift(fields.join(',')) // add header column

    var csvContent = "data:text/csv;charset=utf-8,";

    csv.forEach(function (row, index) {
      csvContent += row + "\n";
    });

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
}

function getNextPageLoop() {  
   setTimeout(function () {
    window.scrollTo(0, document.body.scrollHeight);
    scrollFunction();
    i++;                 
    if (i < pageLimit) {   
      console.log('Page ' + i + ' of ' + pageLimit);
      getNextPageLoop(); 
    } else {
      console.log('Page ' + i + ' of ' + pageLimit);
      afterLoop(names, titles);
    }
   }, 5000)
}

function afterLoop() {
  var people = [];

  for (var index = 0; index < names.length; index++) {
     var person = {
       "Name": names[index],
       "Title": titles[index],
     };
     people.push(person);
  }

  // remove duplicates
  var unique = new Set();
  people.forEach(p => {
    unique.add(JSON.stringify(p));
  });

  var output = Array.from(unique).map(p => JSON.parse(p));

  jsonToCsv(output, 'output.csv');
  return;
}
