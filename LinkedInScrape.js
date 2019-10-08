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

function main() {

    var names = [];
    var titles = [];

    // CSS classes defined here because they may change in the future.
    var nextButtonClass = "artdeco-pagination__button artdeco-pagination__button--next";
    var nameClass = "actor-name";
    var titleClass = "subline-level-1";

    // Stops at 10 pages by default or whenever it can't hit the next button
    var stopAtPage = 10;

    // Set this to true if you want to print the names\titles to console while the script runs
    var printDuringRun = true;

    // Setting zoom to 30% so 10 results fit on one page. This may only work in Chrome
    document.body.style.zoom = "30%"

    async function load() {
        for (let currentPage = 0; currentPage < stopAtPage; currentPage++) {

            if (currentPage != 0)
              await sleep(2000);

            // grab names and titles
            namesChunk = getInnerText(document.getElementsByClassName(nameClass));
            titlesChunk = getInnerText(document.getElementsByClassName(titleClass));

            // add to the existing array for each page
            names = names.concat(namesChunk);
            titles = titles.concat(titlesChunk);

            if (printDuringRun) {
                console.log(namesChunk.join(", "));
                console.log(titlesChunk.join(", "));
            }
                
            // wait two seconds before proceeding, no need to sleep on first page        
            if (currentPage != 0)
              await sleep(2000);

            // if the next button is disabled or an error happens trying to go to next page, stop and output to csv
            try {
                nextDisabled = document.getElementsByClassName(nextButtonClass)[0].hasAttribute("disabled");
                if (!nextDisabled) {
                    document.getElementsByClassName(nextButtonClass)[0].click();
                } else {
                    csvOutput(names, titles);
                    break;
                }
            } catch (e) {
                csvOutput(names, titles);
                break;
            }
        }
        csvOutput(names, titles);
    }
    load();

}

function getInnerText(elements) {
    text = [];
    for (i = 0; i < elements.length; i++) {
        text.push(elements[i].innerText);
    }
    return text;
}

function sleep(time) {
    return new Promise((resolve)=>setTimeout(resolve, time));
}

// All the code below is for outputting to CSV
function jsonToCsv(json, fileName) {
    console.log(json, fileName);
    var fields = Object.keys(json[0]);
    var replacer = function (key, value) { return value === null ? '' : value }
    var csv = json.map(function (row) {
      return fields.map(function (fieldName) {
        return JSON.stringify(row[fieldName], replacer)
      }).join(',')
    })
    csv.unshift(fields.join(',')) // add header column

    var csvContent = "";

    csv.forEach(function (row, index) {
      csvContent += row + "\n";
    });

    downloadString(csvContent, "csv", "output");
}

function csvOutput(names, titles) {

  console.log("csv output", names, titles);

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

function downloadString(text, fileType, fileName) {
  var blob = new Blob([text], { type: fileType });

  var a = document.createElement('a');
  a.download = fileName;
  a.href = URL.createObjectURL(blob);
  a.dataset.downloadurl = [fileType, a.download, a.href].join(',');
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function() { URL.revokeObjectURL(a.href); }, 1500);
}


main();
