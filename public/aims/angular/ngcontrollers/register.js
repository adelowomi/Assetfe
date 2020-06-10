function registerCtrl ($scope, $http)
{
	$scope.newClient = {};

	$scope.registerClient = function () {
		if($scope.newClient.password != $scope.newClient.passwordRetype)
		{
			alert('The passwords supplied do not match. Confirm and retry.');
			return;
		}
		if($scope.newClient.email == null || $scope.newClient.email.trim() == "")
		{
			alert('Email must be supplied. Confirm and retry.');
			return;
		}
	    //username, string password, string email
	$.support.cors = true;
	var searchUrl = $scope.serviceURL + "/RegisterUser"
	   // var searchUrl = "http://localhost:1587/webservices/wsget.asmx/authenticate"
       $.ajax({
           url : searchUrl, type: "POST",
           dataType : "json",
           crossDomain:true,
           ifModified: true,
           cache:true, 
           data: "{username: '" + $scope.newClient.email + "', password: '" + $scope.newClient.password + "', email: '" + //
               $scope.newClient.email + "', surname: '" + $scope.newClient.surname + "', othernames: '" + $scope.newClient.othernames + "', phone: '" +
               $scope.newClient.phonenumber+"'}",
           contentType: "application/json; charset=utf-8",
           beforeSend: function () {
               return true;
           }
       }).done(function(results){
				//var response = [];
			   //for(var i = 0; i< results.length; i++)
			   //{
	
//			   }
				console.log(results);
				if(results.d == '1')
				{
					$.session.set('username', $scope.newClient.email);					
					window.location = "admin/#/userprofile";
				}
				else
				{
				    alert('Sorry, an error occurred. Your email address may already exist in our system. Please try again with another email');
//					alert(results.d.description);
				}
           }
       ).fail(function (jpXHR, textStatus, thrownError) {
           alert('Sorry, an error occurred. Please ensure your internet connection is okay and try again later.');
               console.log("--------------------");
               console.log(textStatus);
               console.log(jpXHR);
               console.log(thrownError);
               console.log("--------------------");
               
          
           }
       );
	}

	$(document).ready(function(e) {
		$.get("http://ipinfo.io", function(response) {
		  $('.telephone').intlTelInput({
			defaultCountry: response.country.toLowerCase()
		  });
		}, "jsonp");
        
    });

}