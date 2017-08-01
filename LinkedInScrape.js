var nameClassSelector = '.actor-name';
var titleClassSelector = 'p.subline-level-1';
var nextButtonClassSelector = '.next-text';
var pageLimit = 2;

var names = [];
var titles = [];

function scrollFunction() {
  var namesInner = $(nameClassSelector);
  var titlesInner = $(titleClassSelector);
  for (var i = 0; i < namesInner.length; i++) {
    names.push(namesInner[i].innerText);
    titles.push(titlesInner[i].innerText);
  }

  console.log('clicking');
  $(nextButtonClassSelector).click();
  window.scrollTo(0, document.body.scrollHeight);
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

var i = 0;
window.scrollTo(0, document.body.scrollHeight);

//function myLoop (names, titles) {       
function myLoop() {  
   setTimeout(function () {
    window.scrollTo(0, document.body.scrollHeight);
    scrollFunction();
    i++;                 
    if (i < pageLimit) {        
       myLoop(); 
    } else {
      afterLoop(names, titles);
    }
   }, 5000)
}

myLoop(names, titles);

function afterLoop() {
  var output = [];
  for (var index = 0; index < names.length; index++) {
     var person = {
       "Name": names[index],
       "Title": titles[index],
     };
     output.push(person);
  }

  jsonToCsv(output, 'output.csv');
  return;
}