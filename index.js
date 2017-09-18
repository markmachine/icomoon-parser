const fs = require('fs');
let FILE_IN, FILE_OUT = "formatted-output.js";

if (process.argv.length > 2) {
  FILE_IN = process.argv[2];
  FILE_OUT = process.argv[3] || FILE_OUT;
}

console.log("---");

const parseSVG = (d) => {
    return new Promise((resolve, reject) => {

        if (d) {
            const sets = {};
            d.forEach((elem) => {
                if (elem.icon.paths && elem.properties.name) {
                    sets[elem.properties.name] = elem.icon.paths.join(' ');
                }
            });
            resolve(sets);
        } else {
            reject("Import data is not formatted properly and cannot be parsed.")
        }

    });
};

if (FILE_IN) {
  fs.readFile(FILE_IN, 'utf8', function (err, data) {
    if (err) throw err;
    const obj = JSON.parse(data);

    parseSVG(obj.icons)
    .then((icons) => {
      console.log(`Data Parsed, %s icons found!`, Object.keys(icons).length);
      fs.writeFile(FILE_OUT, 'export default ' +  JSON.stringify(icons, null, 4), (error) => {
          if (error) {
              console.log("A problem occured writing the output file!")
          }
      });
    })
    .catch((err) => {
      console.log(new Error(err));
    })
  });
} else {
  console.log("You must provide an input filename.");
};
  