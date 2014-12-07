(function ($) {

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

       url : 'http://127.0.0.1:6600/offers/find',

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
		filterType : '',
		filterName : '',
		events: {
			"change #filters select": "setFilter",
		},
		initialize: function(){
			console.log('initialize');

			var sd = new ServerData();
			var collection = '';

			//filterType = filterType || 'all';
			//filterName = filterName || 'brand';

			var options = {};

			/*if (filterName == 'type')
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
			*/
			sd.fetch({
				data: options,
				success: function(response,xhr) {
					console.log("Inside success");
					console.log(response);
					directory.collection         =  new Directory(response.models);
					directory.collectionToFilter = directory.collection.clone();

					directory.$el.find('header').append(directory.createSelectForType());
					directory.$el.find('header').append(directory.createSelectForBrand());

                    directory.on('change:filterByType', directory.filterByType, directory);

					directory.collection.on("reset", directory.render, directory);	
					if (directory.filters)
					{
						directory.trigger('change:filterByType');
					}
					else
					{
						directory.render();
					}
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
		    return _.uniq(directory.collection.pluck("category"));
		},
		
        getBrands: function() {
		console.log('getTypes');
		    return _.uniq(directory.collection.pluck("brand"));
		},

		createSelectForType: function (){
		console.log('createSelect');
		$('#filterByType').remove();
		    var selectType = $("<select/>", {
					html: "<option value='all'>All</option>",	
				});
				var types = this.getTypes();

			_.each(types, function(item){
				var option = $("<option/>", {
					value: item,
					text: item,
					selected : (directory.filters && directory.filters.category == item) ? true : false,
				}).appendTo(selectType);
			});
			selectType.attr('id', 'filterByType');
			selectType.attr('class', 'filters');
			selectType.attr('name', 'category');
			return selectType;
		},
		
		createSelectForBrand : function(){

			$('#filterByBrand').remove();
			var brands = this.getBrands();
            var selectBrand = $("<select/>", {
					html: "<option value='all'>All</option>",	
            });

			_.each(brands, function(item){
				var option = $("<option/>", {
					value: item,
					text: item,
					selected : (directory.filters && directory.filters.brand == item) ? true : false,
				}).appendTo(selectBrand);
			});
			selectBrand.attr('id', 'filterByBrands');
			selectBrand.attr('class', 'filters');
			selectBrand.attr('name', 'brand');
			return selectBrand;
		},

		setFilter: function(e) {
			console.log('setFilter');
			this.trigger('change:filterByType');
		},
		
		filterByType: function(){
			console.log('filterByType');
			var filterOptions = {};
			
			if (!directory.filters)
			{
				_.each($('.filters'), function(filter){
					if (filter.value.toLowerCase() !='' && filter.value.toLowerCase() !='all')
						filterOptions[filter.name] = filter.value.toLowerCase();
				});
			}
			else
			{
				filterOptions = directory.filters;
			}

			if (!_.isEmpty(filterOptions))
			{
				var filtered = this.collectionToFilter.where(filterOptions);
			}
			else
			{
				var filtered = this.collectionToFilter.models;
			}
			directory.filters = '';
			this.collection.reset(filtered);
			contactsRouter.navigate('filter/' + JSON.stringify(filterOptions));
		},
	});

	
	var ContactsRouter = Backbone.Router.extend({
		routes: {
			"filter/:filters" : "urlFilter",
			'*path':  'urlFilter'
		},
		urlFilter: function(filters){
		    console.log('urlFilter');
			console.log(filters);
			directory = new DirectoryView();
			directory.filters = JSON.parse(filters);
		}
	});
	
	var contactsRouter = new ContactsRouter;
	//create instance of master view
   	Backbone.history.start();

}(jQuery));