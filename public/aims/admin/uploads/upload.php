<?php
ob_start();
header('Access-Control-Allow-Origin: *');  
$headers = getallheaders();
uploadDisk($_FILES['file'], $headers['filename'], $headers['who'], $headers['what']);
var_dump($headers);
die('');

function uploadDisk($uploadedfile, $accountno, $who, $what)
{
	$allowedExts = array("gif", "jpeg", "jpg", "png");
	$temp = explode(".", $uploadedfile["name"]);
	$extension = end($temp);
	if ((($uploadedfile["type"] == "image/gif")
	|| ($uploadedfile["type"] == "image/jpeg")
	|| ($uploadedfile["type"] == "image/jpg")
	|| ($uploadedfile["type"] == "image/pjpeg")
	|| ($uploadedfile["type"] == "image/x-png")
	|| ($uploadedfile["type"] == "image/png"))
	&& ($uploadedfile["size"] < 50000)
	&& in_array($extension, $allowedExts))
	  {
		  if ($uploadedfile["error"] > 0)
			{
				return false;
			}
		  else if ($who == "1")
			{
				  if($what == "p")
				  {
					  move_uploaded_file($uploadedfile["tmp_name"],
					  "Users/passport/" .  $accountno.".jpg");
				  }
				  else
				  {
					  move_uploaded_file($uploadedfile["tmp_name"],
					  "Users/signature/" .  $accountno.".jpg");
				  }
				  return true;
			}
		else if ($who == "2") //relatives
			{
				if($what == "p")
				  {
					  move_uploaded_file($uploadedfile["tmp_name"],
					  "UserRelatives/passport/" .  $accountno.".jpg");
				  }
				  else
				  {
						move_uploaded_file($uploadedfile["tmp_name"],
					  	"UserRelatives/signature/" .  $accountno.".jpg");

				  }
				  return true;
			}
			else if ($who == "3") //companies
			{
				if($what == "p")
				  {
					  move_uploaded_file($uploadedfile["tmp_name"],
					  "Companies/passport/" .  $accountno.".jpg");
				  }
				  else
				  {
						move_uploaded_file($uploadedfile["tmp_name"],
					  	"Companies/signature/" .  $accountno.".jpg");

				  }
				  return true;
			}
			
			
			
	  }
	else
	  {
			return false;
	  }
	}
ob_end_flush();
?>