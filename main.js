const fs = require('fs');
const parser = require('./ncgparser.js');

const data = fs.readFileSync("sample.ncg","utf-8");

console.log(data);

const res = parser.parse(data);

for (i in res) {
    console.log(res[i]);
    console.log("");
}