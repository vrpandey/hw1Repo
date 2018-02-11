var AWS = require('aws-sdk');


var aws_access_key = process.env.AWS_ACCESS_KEY;
var aws_secret_key = process.env.AWS_SECRET_KEY;
console.log(aws_access_key);
var region = 'us-east-1';

AWS.config.update({region: region, accessKeyId: aws_access_key, secretAccessKey: aws_secret_key});

var ec2 = new AWS.EC2();

var params = {
    ImageId: 'ami-97785bed', // amzn-ami-2011.09.1.x86_64-ebs
    InstanceType: 't2.micro',
    MinCount: 1,
    MaxCount: 1
 };
 var instanceId ;




ec2.runInstances(params, function(err, data) {
    if (err) {
       console.log("Could not create instance", err);
       return;
    }
    instanceId = data.Instances[0].InstanceId;
    console.log("Created instance", instanceId);
    describeInstanceData(instanceId);
    //console.log(JSON.stringify(data));
});








  
function describeInstanceData(instanceId) {

    var interval = setInterval(function() {

    var instanceIdParam = {InstanceIds:[instanceId]};

      ec2.describeInstances(instanceIdParam, function(err, data) {
        if(err) {
          console.log("ERROR - " + err.stack);
        }
        else {


          
            if(data.Reservations && data.Reservations[0].Instances && data.Reservations[0].Instances.length > 0 && data.Reservations[0].Instances[0].State.Name == "running" ) {


              

                    var createdInstance = data.Reservations[0].Instances[0];
    
                    console.log("Instance Id: "+createdInstance.InstanceId);
                    console.log("Public IpAddress: "+createdInstance.PublicIpAddress);
                    console.log("Instance Type: "+createdInstance.InstanceType);
                    console.log("State: "+createdInstance.State.Name);
    
                   
    
                    console.log("EC2 instance created successfully");
    
                    clearInterval(interval);
                
                
              
            }
            
          }
        });
    }, 10000);
} 	
