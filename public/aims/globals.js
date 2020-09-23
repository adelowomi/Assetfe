/* eslint-disable no-undef */
//AngularPath = "http://localhost:3000/aims/admin/index.html";
AngularPath = "http://www.asset.bz/aims/admin/index.html";
//AngularPath = "http://uat.bts.com.ng/asset/aims/admin/index.html";
FileUploader = "http://api.asset.bz/uploader.aspx";
//FileUploader = "http://uat.bts.com.ng/assetapi/uploader.aspx";

//baseUrl = "http://localhost:56700/"
//baseUrl = "http://uat.bts.com.ng/assetapi/"
baseUrl = "http://api.asset.bz/";

//PictureHostRoot = "http://uat.bts.com.ng/assetapi/images";
//PictureHostRoot = "http://localhost:56700/assetapi/images";
PictureHostRoot = "http://api.asset.bz/images";
RootFolder = "AIMS";
//GlobalDownloader = "http://localhost:56700/PDFdownloader.aspx";
GlobalDownloader = "http://api.asset.bz/PDFdownloader.aspx";
//GlobalDownloader = "http://uat.bts.com.ng/assetapi/PDFdownloader.aspx";
//PictureHostServer = "http://picturehost.asset.bz";

//PictureHostRoot = "http://localhost:3366/aims";
//Hostname = "http://localhost:3000/asset/aims";
Hostname = "http://www.asset.bz/aims";
//Hostname = "http://uat.bts.com.ng/assetapi/images"
//Hostname = "http://www.asset.bz/aims";
//ReportHostname = "http://uat.bts.com.ng/assetapi/images";
ReportHostname = "http://api.asset.bz/images";
PageExceptions = [
  "#/error-message",
  "#/child-menus",
  "#/userprofile",
  "#/pipe",
];
ThrowPageError = function (ErrorTitle, ErrorMessage) {
  localStorage.setItem("error-message-title", ErrorTitle);
  localStorage.setItem("error-message-info", ErrorMessage);
  window.location.href = "#/error-message";
  $("body").css("visibility", "visible");
};

GlobalMessageAlert = function (message, type) {
  try {
    var n = noty({
      layout: "topRight",
      text: message,
      theme: "relax",
      type: type,
      timeout: 10000,
      animation: {
        open: "animated bounceInRight", // Animate.css class names
        close: "animated bounceOutRight", // Animate.css class names
        easing: "swing", // unavailable - no need
        speed: 500, // unavailable - no need
      },
    });
  } catch (e) {
    alert(type.toUpperCase() + ": " + message);
  }
  return;
};

ShowBusyMode = function () {
  $(".spinner").css("display", "block");
};

HideBusyMode = function () {
  $(".spinner").css("display", "none");
};

AjaxOptions = {
  url: "",
  type: "POST",
  dataType: "json",
  crossDomain: true,
  ifModified: true,
  cache: true,
  data: JSON.stringify({}),
  contentType: "application/json; charset=utf-8",
  beforeSend: function () {
    ShowBusyMode();
    return true;
  },
  complete: function () {
    HideBusyMode();
  },
};

AjaxFail = function (jpXHR, textStatus, thrownError) {
  console.log("--------------------");
  console.log(textStatus);
  console.log(jpXHR);
  console.log(thrownError);
  console.log("--------------------");
  //HideBusyMode();
  if (jpXHR.status == 500) {
    GlobalMessageAlert(
      "A critical application error occurred. Try again, and contact your system admin if this persists",
      "error"
    );
  }
};

ApplyViewChanges = function ($scope) {
  try {
    $scope.$apply();
  } catch (e) {}
};

CollapseSection = function (SectionId) {
  $(SectionId).next(".panel-body").slideUp();
  $(SectionId).addClass("up");
};

ExpandSection = function (SectionId) {
  $(SectionId).next(".panel-body").slideDown();
  $(SectionId).removeClass("up");
};

window.mobilecheck = function () {
  var check = false;
  (function (a, b) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};

$.extend({
  distinct: function (anArray) {
    var result = [];
    $.each(anArray, function (i, v) {
      if ($.inArray(v, result) == -1) result.push(v);
    });
    return result;
  },
});

function isInArray(value, array) {
  return array.indexOf(value) > -1;
}

$.sanitize = function (input) {
  var output = input
    .replace(/<script[^>]*?>.*?<\/script>/gi, "")
    .replace(/<[\/\!]*?[^<>]*?>/gi, "")
    .replace(/<style[^>]*?>.*?<\/style>/gi, "")
    .replace(/<![\s\S]*?--[ \t\n\r]*>/gi, "");
  return output;
};

SanitizeAll = function (subject) {
  if (typeof subject == "string") return $.sanitize(subject);
  var keys;
  if (Array.isArray(subject)) {
    keys = Object.keys(subject[0]);
    for (var i = 0; i < subject.length; i++) {
      for (var j = 0; j < keys.length; j++) {
        try {
          subject[i][keys[j]] = subject[i][keys[j]]
            .replace(/<script[^>]*?>.*?<\/script>/gi, "-")
            .replace(/<[\/\!]*?[^<>]*?>/gi, "-")
            .replace(/<style[^>]*?>.*?<\/style>/gi, "-")
            .replace(/<![\s\S]*?--[ \t\n\r]*>/gi, "-");
        } catch (e) {}
      }
    }
  } else {
    keys = Object.keys(subject);
    for (var j = 0; j < keys.length; j++) {
      try {
        subject[keys[j]] = subject[keys[j]]
          .replace(/<script[^>]*?>.*?<\/script>/gi, "-")
          .replace(/<[\/\!]*?[^<>]*?>/gi, "-")
          .replace(/<style[^>]*?>.*?<\/style>/gi, "-")
          .replace(/<![\s\S]*?--[ \t\n\r]*>/gi, "-");
      } catch (e) {}
    }
  }
  console.log(subject);
};
