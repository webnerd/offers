db.product.insert({
	name:'Shirts',
	brands:
	[
		{
			name : 'Peter England',
			offer : 24
		},
		{
			name : 'Allen Solly',
			offer : 30
		},
	]
});
-----------------------------------------------
db.product.find(
	{
		'brands.name' : 'Levis' , 'brands.offer' : {$gt : 10}
	},
	{
		name :1,
		'brands.name' : 1
	}
)
.forEach(printjson)
-------------------------------------------
db.product.update(
   { name: "jeans" },
   {
     $set: { 'brands.name' "apparel" },
     $currentDate: { lastModified: true }
   },
   { multi: true }
)


db.product.update(
    { name: "Jeans" },
    { $push: {
        brands: { name : 'Jai Hind', offer : 22, photo : 'img/placeholder.png' }
      }
	}
)


db.product.remove()



