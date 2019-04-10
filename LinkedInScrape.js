var pageLimitManual = null;

var pageLimitSelector = '.search-results__total';
var nameClassSelector = '.actor-name';
var titleClassSelector = 'p.subline-level-1';
//modify the ember# to meet the buttom ember value
var nextButtonClassSelector = '#ember3190';
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
  if ($(pageLimitSelector)[0] == null){
    return 2;
  } else {
    var pageLimitString =  $(pageLimitSelector)[0].innerText.split(' ')[1];
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

    var blobdata = new Blob([csvContent],{type : 'text/csv'});
    var link = document.createElement("a");
    link.setAttribute("href", window.URL.createObjectURL(blobdata));  
    link.setAttribute("download", "output.csv");
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
