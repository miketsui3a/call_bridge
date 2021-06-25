
const fs = require('fs');
const path = require('path')

module.exports = function(data,network){
  const dirname = path.join(__dirname,"/../config");
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname);
  }
  fs.writeFileSync(`${dirname}/${network}.json`, JSON.stringify(data));
}