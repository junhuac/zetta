var level = require('level');

function propertiesMatch(query, data){
  for(var k in query){
    if(query[k] !== data[k]) {
      return false;
    }
  }
  return true;
}

var Registry = module.exports = function(db){
  this.db = db || level('./.registry');
};

Registry.prototype.find = function(query, cb) {
  var results = [];

  this.db.createReadStream()
    .on('data', function (data) {
      var obj = JSON.parse(data.value);
      if(propertiesMatch(query, obj)) {
	results.push(obj);
      }
    })
    .on('error', cb)
    .on('end', function () {
      cb(null, results);
    });
};


Registry.prototype.get = function(id, cb) {
  this.db.get(id, cb);
};

Registry.prototype.save = function(machine, cb) {

  var json = machine.properties;
  json.id = machine.id; // add id to properties
  
  this.db.put(machine.id, JSON.stringify(json), cb);
};
