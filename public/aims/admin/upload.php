<?php

$headers = getallheaders();
uploadDisk($_FILES['file'], $headers['userid']);


function uploadDisk($uploadedfile, $accountno)
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
		  else
			{
				  move_uploaded_file($uploadedfile["tmp_name"],
				  "userimages/" .  $accountno.".jpg");
				  return true;
			}
	  }
	else
	  {
			return false;
	  }
	}

?>