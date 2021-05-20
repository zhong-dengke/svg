const CSVToJSON = (data, delimiter = ',') => {
  const titles = data.slice(0, data.indexOf('\n')).split(delimiter);
  return data
    .slice(data.indexOf('\n') + 1)
    .split('\n')
    .map(v => {
      const values = v.split(delimiter);
      return titles.reduce(
        (obj, title, index) => ((obj[title] = values[index]), obj),
        {}
      );
    });
};
const JSONToFile = (obj, filename) =>
  fs.writeFileSync(`${filename}.json`, JSON.stringify(obj, null, 2));
const fs = require('fs');
const path = require('path');
JSONToFile(CSVToJSON(fs.readFileSync('a.csv','utf-8')))