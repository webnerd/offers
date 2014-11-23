var 
url          = require('url'),
http         = require('http'),
fs           = require('fs'),
minify       = require('minify'),
_            = require('underscore'),
mongo        = require('mongodb'),
events       = require('events'),
config       = require('config'),
eventEmitter = new events.EventEmitter(),
MongoClient  = mongo.MongoClient;

var
db,
server,
result = '',
mongoConfig = config.get('mongo'),
templateConfig = config.get('template');

MongoClient.connect('mongodb://'+ mongoConfig.host+ ':' + mongoConfig.port + '/' + mongoConfig.database, function(err, dbase) {
  if (err) throw err;
  console.log("Connected to Database");
  db = dbase;
  server = http.createServer(function (req, res) {

		res.setHeader('Access-Control-Allow-Origin', '*');
    	res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

		var parsedUrl = url.parse(req.url, true);
		pathname = parsedUrl.pathname;
		var paths = _.filter(
			pathname.split('/'),
			function(data){ return data != ''; }
		);
	/*	_.each(paths,function(e, index, list){
			console.log(e);
		});
		*/
		if (paths.length != 2)
		{
			res.end();
		}
		else
		{   
			perform(paths[1], paths[0], parsedUrl.query, res);
		}
	});
	server.listen(6600, '127.0.0.1');
});
perform = function (operation, collection, data, res)
{
	console.log(operation + ',' + collection + ',' + JSON.stringify(data));
	//operation(collection, data);
	//eventEmitter.emit(operation, collection, data, res);
	if (operation == 'add')
	{
		addData(collection, data, res);
	}
	if (operation == 'find')
	{
		findData(collection, data, res);
	}
	if (operation == 'delete')
	{
		deleteData(collection, data, res);
	}
	if (operation == 'update')
	{
		updateData(collection, data, res);
	}
};
	
var findData = function (collection, data, res)
{
	console.log(data);
	if (data.name == 'all' || data.name == '') data = '';

	var options = {};

    if (data.hasOwnProperty('filterBrand'))
    {
        options = {'brands.name' : data.filterBrand};
        if (data.filterBrand == 'all' || data.filterBrand == '') options = '';
    }
    else if(data.hasOwnProperty('filterType'))
    {
    	options = {'name' : data.filterType};
    	if (data.filterType == 'all' || data.filterType == '') options = '';
    }
    else if(data.hasOwnProperty('filterDiscount'))
    {
    	options = {'brands.offer' : {$gte : data.filterDiscount * 10, $lte : (data.filterDiscount * 10) + 10}};
    	if (data.filterDiscount  == 'all' || data.filterDiscount  == '') options = '';
    }
	


	minify( templateConfig.path + 'productTemplate.html',function(err, template) {
		db.collection("product").find(options, function(err, docs) {
			docs.toArray(function(err, doc) {
				if(doc)
				{
					res.writeHead(200, {'Content-Type': 'application/json'});

					var responseData = {};
					responseData.data = doc;
					responseData.template = template;
					res.write(JSON.stringify(responseData));

					res.end('\n');
				}
				else
				{
					console.log(err);
					res.end();
				}
			});
		});
	});
	
	/*db.collection('product', function (err, collection)
	{
		if (err) console.log(err);
		var results = collection.find();
		results.toArray(function(err, docs) {
			if (err) console.log(err);
			//console.log("Doc from Array ");
			//console.dir(doc);
			result  = JSON.stringify(docs);
			//res.end(result);
		});
		console.log(result);
		res.end('{"data" :"' +  result + '", "template": "<div>listing</div>"}');
	});
	*/
	
	//var template = fs.readFileSync('./productTemplate.html', "utf8");
		
//	res.end(result);
}