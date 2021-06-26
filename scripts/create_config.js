
const fs = require('fs');
const path = require('path')

module.exports = function(data,network){
  const dirname = path.join(__dirname,"/../config");
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname);
  }

  let file

  try{
    file = require("../config/config.json")
  }catch(e){
    file = {}
  }

  file[network] = data

  fs.writeFileSync(`${dirname}/config.json`, JSON.stringify(file));
}