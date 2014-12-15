var 
url          = require('url'),
http         = require('http'),
fs           = require('fs'),
minify       = require('minify'),
_            = require('underscore'),
mongo        = require('mongodb'),
events       = require('events'),
config       = require('config'),
qs           = require('querystring');
eventEmitter = new events.EventEmitter(),
MongoClient  = mongo.MongoClient;

var
db,
server,
result = '',
mongoConfig = config.get('mongo'),
mongoObjectId = mongo.ObjectID,
templateConfig = config.get('template');

MongoClient.connect('mongodb://' + mongoConfig.host + ':' + mongoConfig.port + '/' + mongoConfig.database, function(err, dbase) {
  if (err) throw err;
  console.log("Connected to Database");
  db = dbase;
  server = http.createServer(function (req, res) {

		res.setHeader('Access-Control-Allow-Origin', '*');
    	res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

		var parsedUrl = url.parse(req.url, true);
		var pathname = parsedUrl.pathname;
		var paths = _.filter(
			pathname.split('/'),
			function(data){ return data != ''; }
		);
			
		if (req.method == 'GET')
		{
			
			if (paths.length != 2)
			{
				res.end();
			}
			else
			{   
				perform(paths[1], paths[0], parsedUrl.query, res);
			}
		}
		else if (req.method == 'POST')
		{
			var jsonString = '';
            req.on('data', function (data) {
                jsonString += data;
            });
            req.on('end', function () {
				jsonString = qs.parse(jsonString);			    
				perform(paths[1], paths[0], JSON.parse(jsonString.model), res);
            });
		}
		else
		{
			res.end();
		}
		
	});
	server.listen(6600, '127.0.0.1');
});
perform = function (operation, collection, data, res)
{
	console.log(operation + ',' + collection + ',' + JSON.stringify(data));
	eventEmitter.emit(operation, collection, data, res);
};

eventEmitter.on('add', function (collection, data, res)
{
	var document = 
	{
		"category": data.category,
		"brand"   : data.brand,
		location  : {"address" :data.address,"locality": data.locality,"city" : data.city,	"state": data.state,"pincode" : data.pincode},
		offer     : {"type" : data.type,"tc" : data.tc,"amount": data.amount,"photo":'img/placeholder.png'},
		"active"  : 0
	};

	db.collection(collection).insert(document, function(err, records) {
		if (err) throw err;
		res.write(JSON.stringify(records));
		res.end('\n');
	});
});

eventEmitter.on('updateOffers',function (collection, data, res)
{
	var criteria = {_id : new mongoObjectId(data._id) };
	var updatedData = data;
	delete updatedData._id;

	db.collection(collection).update(criteria, updatedData, {multi : false}, function(err, count, objData) {
		var status = {error : false, message : 'Update Successful'};
		if (err)
		{
			status = {error : true, message : 'Update Failed'};
		}
		res.writeHead(200, {'Content-Type': 'application/json'});
		res.end(JSON.stringify(status));
	});	
});

eventEmitter.on('getNewlyAddedOffers',function (collection, data, res)
{
	console.log(data);

	var options = {'active' : 0};

	minify( templateConfig.path + 'newlyAddedOffer.html',function(err, template) {
		db.collection(collection).find(options, function(err, docs) {
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
	
});

eventEmitter.on('find',function (collection, data, res)
{
	console.log(data);

	var options = {'active' : 1};

	/*
	if (data.name == 'all' || data.name == '') data = '';
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
	*/

console.log(JSON.stringify(options));
	minify( templateConfig.path + 'productTemplate.html',function(err, template) {
		db.collection(collection).find(options, function(err, docs) {
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
});