/*
---PLEASE NOTE: THIS IS FOR EDUCATIONAL PURPOSES ONLY---

Script to scrape Data.com contacts for a certain company or search

Authors - Erkin Djindjiev (@SeaErkin)
          Ryan Bradbury (@rj4yb3)
          
Instructions - **UPDATE** 
          1) navigate the first page of contacts
          2) open your web browser developer tools 
          3) paste script into console and run
          4) open csv file and enjoy
*/

// If you want you can set the pages manually, otherwise it will page through all results.
var pageLimitManual = null;

var pageLimitSelector = $$('#totalRecords');
var nextButtonClassSelector = $$('#next');
var resultsPerPageSelector = $$('#pageSize');

var resultsPerPage = resultsPerPageSelector[0].value;

var pageLimit = pageLimitManual || getPageLimit();

var names = [];
var titles = [];

var i = 0;

getNextPageLoop();

// functions
function scrollFunction() {

  var nameClassSelector = jQuery('td.td-name.break-word.name');
  var titleClassSelector = jQuery('td.td-title.break-word.title');

  var namesInner = nameClassSelector;
  var titlesInner = titleClassSelector;
  for (var i = 0; i < namesInner.length; i++) {
    names.push(namesInner[i].innerText);
    titles.push(titlesInner[i].innerText);
  }

  var dog = 1;

  nextButtonClassSelector[0].click();
}

function getPageLimit() {
  var dog = 1;
  if (pageLimitSelector[0] == null){
    return 2;
  } else {
    var pageLimitString =  pageLimitSelector[0].innerText;
    return Math.ceil(parseInt(pageLimitString)/resultsPerPage);
  }
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
  
  var dog = 1;

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
