(function ($) {

	// MOdel: Single contact
	var Deal = Backbone.Model.extend({
		defaults: {
			photo: "img/placeholder.png",
		},
	});
	
	 //define dealGroup collection
    var DealGroup = Backbone.Collection.extend({
        model: Deal,
    //});

	// Collection : Group of model/Deals
	//var ServerData = Backbone.Collection.extend({

        url : 'http://127.0.0.1:6600/offers/find',
		sync: function(method, collection, options) {
		   options.dataType = "jsonp";
		   options.jsonpCallback = "jsonpCallback";
		   return Backbone.sync(method, collection, options);
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
				var dealObject = {};
				
				dealObject = values[i];
				dealObject['template'] = template;

				this.models.push(dealObject);	
			}
			
			console.log(this.models);
			//return models
			return this.models;
		}

	});
	
	// 1:1 view
	var DealView = Backbone.View.extend({
		tagName: "div",
		className: "contact-container",
		//template: $("#contactTemplate").html(),
		
		render: function(){
		console.log('DealView:render');
			var tmpl = _.template(this.model.get('template'));
			//var tmpl = _.template(this.template);
			
			$(this.el).html(tmpl(this.model.toJSON()));
			return this;
		},
	});

	var DealGroupView = Backbone.View.extend({
	
		el: $("#contacts"),
		filterType : '',
		filterName : '',
		events: {
			"change #filters select": "setFilter",
		},
		initialize: function(){
			console.log('initialize');

			var dg = new DealGroup();
			var collection = '';

			//filterType = filterType || 'all';
			//filterName = filterName || 'brand';

			var options = {};
			options.dataType = "jsonp";

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
			dg.fetch({
				data: options,
				success: function(response,xhr) {
					console.log("Inside success");
					console.log(response);
					dealGroup.collection         =  new DealGroup(response.models);
					dealGroup.collectionToFilter = dealGroup.collection.clone();

					dealGroup.$el.find('header').append(dealGroup.createSelectForType());
					dealGroup.$el.find('header').append(dealGroup.createSelectForBrand());
					
                    dealGroup.on('change:filterByType', dealGroup.filterByType, dealGroup);

					dealGroup.collection.on("reset", dealGroup.render, dealGroup);	
					if (dealGroup.filters)
					{
						dealGroup.trigger('change:filterByType');
					}
					else
					{
						dealGroup.render();
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
			dealGroup.$el.find("div.contact-container").remove();
			_.each(dealGroup.collection.models, function(item){
				dealGroup.renderDeal(item);
			}, dealGroup)
		},
		
		renderDeal: function(item){
		console.log('renderDeal');
			var contactView = new DealView({
				model: item
			});
			dealGroup.$el.append(contactView.render().el);
		},
		getTypes: function() {
			console.log('getTypes');
		    return _.uniq(dealGroup.collection.pluck("category"));
		},
		
        getBrands: function() {
		console.log('getTypes');
		    return _.uniq(dealGroup.collection.pluck("brand"));
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
					selected : (dealGroup.filters && dealGroup.filters.category == item) ? true : false,
				}).appendTo(selectType);
			});
			selectType.attr('id', 'filterByType');
			selectType.attr('class', 'filters');
			selectType.attr('name', 'category');
			return selectType;
		},
		
		createSelectForBrand : function(){

			$('#filterByBrands').remove();
			var brands = this.getBrands();
            var selectBrand = $("<select/>", {
					html: "<option value='all'>All</option>",	
            });

			_.each(brands, function(item){
				var option = $("<option/>", {
					value: item,
					text: item,
					selected : (dealGroup.filters && dealGroup.filters.brand == item) ? true : false,
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
			
			if (!dealGroup.filters)
			{
				_.each($('.filters'), function(filter){
					if (filter.value !='' && filter.value.toLowerCase() !='all')
						filterOptions[filter.name] = filter.value;
				});
			}
			else
			{
				filterOptions = dealGroup.filters;
			}

			if (!_.isEmpty(filterOptions))
			{
				var filtered = this.collectionToFilter.where(filterOptions);
				contactsRouter.navigate('filter/' + JSON.stringify(filterOptions));
			}
			else
			{
				var filtered = this.collectionToFilter.models;
			}

			this.collection.reset(filtered);
			dealGroup.$el.find('header').append(dealGroup.createSelectForBrand());
			dealGroup.filters = '';
		},
	});

	var DealsRouter = Backbone.Router.extend({
		routes: {
			"filter/:filters" : "urlFilter",
			//'*path':  'urlFilter'
		},
		urlFilter: function(filters){
		    console.log('urlFilter');
			console.log(filters);
			dealGroup.filters = JSON.parse(filters);
		}
	});
	
	//create instance of master view
	var dealGroup      = new DealGroupView;
	var contactsRouter = new DealsRouter;

   	Backbone.history.start();

}(jQuery));