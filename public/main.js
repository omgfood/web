$('#Take-Picture').change( function() {
  $(".file-upload").hide();
  $("canvas").show();
  $('.result').text('Uploading image...');
});

var takePicture = document.querySelector("#Take-Picture"),
  showPicture = document.createElement("img");
  Result = document.querySelector("#textbit");

var canvas = document.getElementById("picture");
var ctx = canvas.getContext("2d");
JOB.Init();
JOB.SetImageCallback(function(result) {
  if(result.length > 0){
    var tempArray = [];
    for(var i = 0; i < result.length; i++) {
      tempArray.push(result[i].Format+" : "+result[i].Value);
      $('.result').html("Querying TESCO API.....");
      $.get(
        "/barcode_search",
        'id=' + result[i].Value,
        function(response) {
          console.log(response);
          if(response == 'notfound'){
            $('.result').html("Couldn't find anything matching that baercode");
          }else{
            $('canvas').hide();
            $('#textbit').hide();
            $('.result').html(
              '<img src="' + response['ImagePath'] + '" /><br />' +
              '<strong>' + response['Name'] + '</strong>' +
              '<p class="nutrition">'+
                'Calories: ' + response['RDA_Calories_Count'] + '<br />' +
                'Fat: ' + response['RDA_Fat_Grammes'] + 'g<br />' +
                'Salt: ' + response['RDA_Salt_Grammes'] + 'g<br />' +
                'Saturates: ' + response['RDA_Saturates_Grammes'] + 'g<br />' +
                'Sugar: ' + response['RDA_Sugar_Grammes'] + 'g<br />' +
              '</p>'
            );
          }
        }
      );
    }
    Result.innerHTML=tempArray.join("<br />");
  }else{
    if(result.length === 0) {
      Result.innerHTML="Decoding failed.";
    }
  }
});
JOB.PostOrientation = true;
JOB.OrientationCallback = function(result) {
  $('.result').html("Deciphering barcode.....");
  canvas.width = result.width;
  canvas.height = result.height;
  var data = ctx.getImageData(0,0,canvas.width,canvas.height);
  for(var i = 0; i < data.data.length; i++) {
    data.data[i] = result.data[i];
  }
  ctx.putImageData(data,0,0);
};
JOB.SwitchLocalizationFeedback(true);
JOB.SetLocalizationCallback(function(result) {
  ctx.beginPath();
  ctx.lineWIdth = "2";
  ctx.strokeStyle="red";
  for(var i = 0; i < result.length; i++) {
    ctx.rect(result[i].x,result[i].y,result[i].width,result[i].height); 
  }
  ctx.stroke();
});
if(takePicture && showPicture) {
  takePicture.onchange = function (event) {
    var files = event.target.files;
    if (files && files.length > 0) {
      file = files[0];
      try {
        var URL = window.URL || window.webkitURL;
        showPicture.onload = function(event) {
          Result.innerHTML="";
          JOB.DecodeImage(showPicture);
          URL.revokeObjectURL(showPicture.src);
        };
        showPicture.src = URL.createObjectURL(file);
      }
      catch (e) {
        try {
          var fileReader = new FileReader();
          fileReader.onload = function (event) {
            showPicture.onload = function(event) {
              Result.innerHTML="";
              JOB.DecodeImage(showPicture);
            };
            showPicture.src = event.target.result;
          };
          fileReader.readAsDataURL(file);
        }
        catch (e) {
          Result.innerHTML = "Neither createObjectURL or FileReader are supported";
        }
      }
    }
  };
}
