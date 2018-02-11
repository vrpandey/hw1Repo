var needle = require("needle");
var os   = require("os");


var config = {};
config.token = process.env.DOTOKEN;
console.log("Your token is:", config.token);

var SSHKEY=process.env.SSHKEY;


var headers =
{
	'Content-Type':'application/json',
	Authorization: 'Bearer ' + config.token
};

// Documentation for needle:
// https://github.com/tomas/needle

var client =
{
	listRegions: function( onResponse )
	{
		needle.get("https://api.digitalocean.com/v2/regions", {headers:headers}, onResponse)
	},

	createDroplet: function (dropletName, region, imageName, onResponse)
	{
		var data = 
		{
			"name": dropletName,
			"region":region,
			"size":"512mb",
			"image":imageName,
			// Id to ssh_key already associated with account.
			"ssh_keys":[SSHKEY],
			//"ssh_keys":null,
			"backups":false,
			"ipv6":false,
			"user_data":null,
			"private_networking":null
		};

		console.log("Attempting to create: "+ JSON.stringify(data) );

		needle.post("https://api.digitalocean.com/v2/droplets", data, {headers:headers,json:true}, onResponse );
	},

	getDropletInfo: function(dropletID, onResponse)
	{
		needle.get("https://api.digitalocean.com/v2/droplets/"+dropletID, {headers:headers}, onResponse)
	},
	getDroplets: function( onResponse)
	{
		needle.get("https://api.digitalocean.com/v2/droplets/", {headers:headers}, onResponse)
	}
};




var dropletName="vrpandey"+os.hostname();
var region ="nyc1";
var imageName="ubuntu-14-04-x64";


client.createDroplet(dropletName, region, imageName, function(err, resp, body){

	if(!err && resp.statusCode == 202){
		
		var data=resp.body;
		if(data.droplet){
			var dropletId = data.droplet.id;


			var interval = setInterval(function(){

				client.getDropletInfo(dropletId, function(error, response) {		
					var data = response.body;
					if (data.droplet)
					{
						if(data.droplet.networks.v4.length > 0) {	
							
							console.log(data.droplet.name);
							console.log(data.droplet.networks.v4[0].ip_address);
							console.log("Droplet created successfully");
							
							clearInterval(interval);
						}
					}	
				});


			},2000);

			

			
		}
	}

});




// client.getDroplets( function(error, response) {		
// 	var data = response.body;
// 	console.log(JSON.stringify(data));	
// }); 


// client.getDropletInfo(dropletId, function(error, response) {		
// 	var data = response.body;
// 	if (data.droplet)
// 	{
// 		if(data.droplet.networks.v4.length > 0) {	
// 			var ip=	data.droplet.networks.v4[0].ip_address;			
// 			//console.log(ip);
// 			console.log(data.droplet.networks.v4[0].ip_address);
// 			//getIPAddress(data.droplet.networks.v4[0].ip_address);					
// 		}
// 	}	
// });