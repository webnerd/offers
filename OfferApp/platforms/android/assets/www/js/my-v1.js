(function ($) {

    //demo data
   /* var contacts = [
        { name: "Contact 1", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "family" },
        { name: "Contact 2", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "family" },
        { name: "Contact 3", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "friend" },
        { name: "Contact 4", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "colleague" },
        { name: "Contact 5", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "family" },
        { name: "Contact 6", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "colleague" },
        { name: "Contact 7", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "friend" },
        { name: "Contact 8", address: "1, a street, a town, a city, AB12 3CD", tel: "0123456789", email: "anemail@me.com", type: "family" }
    ];
	*/
	// MOdel: Single contact
	var Contact = Backbone.Model.extend({
		defaults: {
			photo: "img/placeholder.png",
		},
	});
	
	 //define directory collection
    var Directory = Backbone.Collection.extend({
        model: Contact
    });

	// Collection : Group of model/conact
	var ServerData = Backbone.Collection.extend({

       url : 'http://127.0.0.1:6600/product/find',

       reset : function (model, options) {
				console.log("Inside event");
				console.log(model);
	   },
		//Parse the response
		parse: function (response) {
			
			console.log("Inside Parse");
			
			//keys
			var template = response.template;
			
			//values
			var values = response.data;
			
			//Parse the response and construct models			
			for (var i = 0, length = values.length; i < length; i++) {
				
				var currentValues = values[i];
				var productObject = {};
				
				productObject = values[i];
				productObject['template'] = template;

				this.models.push(productObject);	
			}
			
			console.log(this.models);
			//return models
			return this.models;
		}

	});
	
	// 1:1 view
	var ContactView = Backbone.View.extend({
		tagName: "div",
		className: "contact-container",
		//template: $("#contactTemplate").html(),
		
		render: function(){
		console.log('ContactView:render');
			var tmpl = _.template(this.model.get('template'));
			//var tmpl = _.template(this.template);
			
			$(this.el).html(tmpl(this.model.toJSON()));
			return this;
		},
	});
	
 	
	var DirectoryView = Backbone.View.extend({
	
		el: $("#contacts"),
		
		initialize: function(){
			console.log('initialize');

			var sd = new ServerData();
			var collection = '';

			filterType = filterType || 'all';
			filterName = filterName || 'brand';

			var options = {};

			if (filterName == 'type')
			{
				options = {filterType : filterType};
			}
			else if (filterName == 'brand')
			{
				options = {filterBrand : filterType};
			}
			else if (filterName == 'discount')
			{
				options = {filterDiscount : filterType};
			}
			sd.fetch({
				data: options,
				success: function(response,xhr) {
					console.log("Inside success");
					console.log(response);
					contacts = response.models;
					directory.collection =  new Directory(contacts);
					if (filterType && filterType !='all')
					{
						directory.trigger('change:filterType');
					}
					else
					{
						directory.$el.find('#filter').append(directory.createSelectForType());
						directory.$el.find('#filter').append(directory.createSelectForBrand());

						var discountFilter = '<div id="filterByDiscount"><label>Filter Results By Discount ::</label><select id="filterBox" name="discount"><option value="1">0-10%</option><option value="2">11-20%</option><option value="3">21-30%</option><option value="4">31-40%</option><option value="5">41-50%</option></select></div>';
						directory.$el.find('#filter').append(discountFilter);
					}
					
					directory.render();
					//directory.$el.find('#filter').append(directory.createSelect());
					directory.on('change:filterType', directory.filterByType, directory);
					directory.collection.on("reset", directory.render, directory);	
				},
				error: function (errorResponse) {
					console.log("Inside error");
					console.log(errorResponse);
				}
			});
		},
		
		render : function(){
		console.log('DirectoryView:render');
			directory.$el.find("div.contact-container").remove();
			
			_.each(directory.collection.models, function(item){
				directory.renderContact(item);
			}, directory)
		},
		
		renderContact: function(item){
		console.log('renderContact');
			var contactView = new ContactView({
				model: item
			});
			directory.$el.append(contactView.render().el);
		},
		getTypes: function() {
		console.log('getTypes');
		var data = directory.collection.pluck("name");
		    return _.uniq(data);
		},
		
        getBrands: function() {
		console.log('getTypes');
		var data = directory.collection.models;
		    
            var finalData = new Array();
		    _.each(data, function(item1){
                
                var item = item1.toJSON();
                _.each(item.brands, function(brand){
                      finalData.push(brand.name);
		        });
		    });
		    return _.uniq(finalData);
		},

		createSelectForType: function (){
		console.log('createSelect');
		$('#filterBox').remove();
		    var select = $("<select/>", {
					html: "<option value=''>All</option>",	
				});
				var types = this.getTypes();

			_.each(types, function(item){
				var option = $("<option/>", {
					value: item,
					text: item,
				}).appendTo(select);
			});
			select.attr('id', 'filterBox');
			select.attr('name', 'type');
			return select;
		},
		
		createSelectForBrand : function(){

			$('#filterByBrand').remove();
			var brands = this.getBrands();

            var selectBrands = $("<select/>", {
					html: "<option value=''>All</option>",	
            });

			_.each(brands, function(item){
				var option = $("<option/>", {
					value: item,
					text: item,
				}).appendTo(selectBrands);
			});
			selectBrands.attr('id', 'filterBoxBrands');
			selectBrands.attr('name', 'brand');
			return selectBrands;
		},

		events: {
			"change #filter select": "setFilter",
		},
		
		setFilter: function(e) {
		console.log('setFilter');
			this.filterType = e.currentTarget.value;
			this.filterName = e.currentTarget.name;
			this.trigger('change:filterType');
		},
		
		filterByType: function(){
			console.log('filterByType');
			if(this.filterType == 'all' || this.filterType == '')
			{
				this.collection.reset(contacts);
				//this.collection.reset(contacts, {silent: true });
				contactsRouter.navigate('filter/' + this.filterName + '/all');
			}
			else
			{
			
			    directory.collection.reset(contacts, { silent: true });	
				var filterType = this.filterType;
				if (this.filterName == 'type')
				{
					var filtered = _.filter(this.collection.models, function(item){
							return item.get("name").toLowerCase() == filterType.toLowerCase();
					});
				}
				else if (this.filterName == 'brand')
				{
					

                    var filtered = _.filter(this.collection.models, function(brands){
						 
							var f = _.filter(brands.get('brands'), function(item){
								return item.name.toLowerCase() == filterType.toLowerCase();
							});

							if (f.length)
							{
								return true;
							}
					});
				}
				else if (this.filterName == 'discount')
				{
					

                    var filtered = _.filter(this.collection.models, function(brands){
						 
							var f = _.filter(brands.get('brands'), function(item){
								return item.offer >= filterType * 10 && item.offer <= (filterType * 10) + 10;
							});

							if (f.length)
							{
								return true;
							}
					});
				}
				this.collection.reset(filtered);
				contactsRouter.navigate('filter/'+ this.filterName + '/' + filterType);
			}
		},
		
	});
	
    var collection = '';
	var contacts   = '';
 	var filterType = '';
 	var filterName = '';
 	var directory  = '';

	var ContactsRouter = Backbone.Router.extend({
		routes: {
			"filter/:name/:type" : "urlFilter",
			'*path':  'urlFilter'
		},
		urlFilter: function(name, type){
		    console.log('urlFilter');
		    filterType = type;
		    filterName = name;
			directory = new DirectoryView();
		}
	});
	
	var contactsRouter = new ContactsRouter();
	//create instance of master view
   	Backbone.history.start();

}(jQuery));