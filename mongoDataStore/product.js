db.product.insert({
	name:'Jeans',
	brands:
	[
		{
			name : 'Levis',
			data : 
			[
				{
					offer : 20,
					photo : 'img/placeholder.png',
					location : 'a',
				},
				{
					offer : 24,
					photo : 'img/placeholder.png',
					location : 'b',
				}
			],
			
		},
		{
			name : 'Flying-Machine',
			offer : 10,
			photo : 'img/placeholder.png',
		},
		{
			name : 'Lee',
			offer : 25,
			photo : 'img/placeholder.png',
		},
		{
			name : 'Lee Cooper',
			offer : 15,
			photo : 'img/placeholder.png',
		},
	]
});
 
db.product.insert({
	name:'Shirts',
	brands:
	[
		{
			name : 'Peter England',
			offer : 24,
			photo : 'img/placeholder.png',
		},
		{
			name : 'Allen Solly',
			offer : 30,
			photo : 'img/placeholder.png',
		},
		{
			name : 'Van Huesen',
			offer : 24,
			photo : 'img/placeholder.png',
		},
		{
			name : 'Levis',
			offer : 30,
			photo : 'img/placeholder.png',
		},
	]
});
 
db.product.insert({
	name:'TShirt',
	brands:
	[
		{
			name : 'Levis',
			offer : 30,
			photo : 'img/placeholder.png',
		},
		{
			name : 'US Polo',
			offer : 10,
			photo : 'img/placeholder.png',
		},
		{
			name : 'Pepe',
			offer : 25,
			photo : 'img/placeholder.png',
		},
		{
			name : 'Bewkoof',
			offer : 13,
			photo : 'img/placeholder.png',
		},
	]
});


db.product.insert({
	name:'Shoes',
	brands:
	[
		{
			name : 'Roush',
			offer : 30,
			photo : 'img/placeholder.png',
		},
		{
			name : 'Hush Puppies',
			offer : 10,
			photo : 'img/placeholder.png',
		},
		{
			name : 'Lee Cooper',
			offer : 12,
			photo : 'img/placeholder.png',
		},
		{
			name : 'Woodland',
			offer : 23,
			photo : 'img/placeholder.png',
		},
	]
});

db.product.insert({
	name:'Dress',
	brands:
	[
		{
			name : 'AND',
			offer : 20,
			photo : 'img/placeholder.png',
		},
		{
			name : 'Bare denim',
			offer : 10,
			photo : 'img/placeholder.png',
		},
		{
			name : 'Western Desi',
			offer : 22,
			photo : 'img/placeholder.png',
		},
		{
			name : 'Van Heusen',
			offer : 13,
			photo : 'img/placeholder.png',
		},
	]
});

db.product.insert({
	name:'Kurtas',
	brands:
	[
		{
			name : 'Cilaii',
			offer : 22,
			photo : 'img/placeholder.png',
		},
		{
			name : 'Manyawar',
			offer : 13,
			photo : 'img/placeholder.png',
		},
		{
			name : 'Jai Hind',
			offer : 22,
			photo : 'img/placeholder.png',
		},
	]
});

db.product.update(
    { name: "Jeans" },
    { $push: {
        brands: { name : 'Jai Hind', offer : 22, photo : 'img/placeholder.png' }
      }
	}
)


db.product.insert({
	name:'Jeans',
	brands:
	[	
		{
			name : 'Levis',
			data : 
			[
				{
					offers : 
					{
					    flat :
						[
							{
								offer     : 50,
								type      : '%',
								condition : '',
								
							},
							{
								offer     : 24,
								type      : 'rs',
								condition : '',
							}
						]
					},
					photo : 'img/placeholder.png',
					location : 'F C Road, Pune',
				},
				{
					offers : 
					{
					    flat :
                        [
							{
								offer     : 30,
								type      : '%',
								condition : '',
							},
						],
						conditional :
						[
							{
								offer     : 'buy 2 get 1',
								type      : '',
								condition : '',
							},
						]
					},
					photo : 'img/placeholder.png',
					location : 'Central Mall, Pune',
				}
			],
			offers : 
			[
				{
					category  : 'flat',
					offer     : '10',
					type      : '%',
					condition : '',
				}
			],
		},
	]
});