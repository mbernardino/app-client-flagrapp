    var pictureSource;   // picture source
    var destinationType; // sets the format of returned value

    // Wait for device API libraries to load
    //
    document.addEventListener("deviceready",onDeviceReady,false);

    // device APIs are available
    //
    function onDeviceReady() {
      pictureSource=navigator.camera.PictureSourceType;
      destinationType=navigator.camera.DestinationType;

      $(".button-collapse").sideNav();
      $('select').material_select();

      $("#btnCancelPhoto").click(function(e){
        changeDisplays("list");
        e.preventDefault();
      });

      $("form").submit(function(e){
        postPic($(this));
        e.preventDefault();
      });
      setRecentsList();
    }

    // Called when a photo is successfully retrieved
    //
    function onPhotoDataSuccess(imageData) {
      // Uncomment to view the base64-encoded image data
      // console.log(imageData);
      //changeDisplays receives list or photo
      changeDisplays("photo");
      setImageIntoForm(imageData);
    }

    // Called when a photo is successfully retrieved
    //
    function onPhotoURISuccess(imageURI) {
      // Uncomment to view the image file URI
      // console.log(imageURI);

      // Get image handle
      //
      var largeImage = document.getElementById('largeImage');

      // Unhide image elements
      //
      largeImage.style.display = 'block';

      // Show the captured photo
      // The in-line CSS rules are used to resize the image
      //
      largeImage.src = imageURI;
    }

    // A button will call this function
    //
    function capturePhoto() {
      // Take picture using device camera and retrieve image as base64-encoded string
      navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50,
        destinationType: destinationType.DATA_URL });
    }

    // A button will call this function
    //
    function capturePhotoEdit() {
      // Take picture using device camera, allow edit, and retrieve image as base64-encoded string
      navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 20, allowEdit: true,
        destinationType: destinationType.DATA_URL });
    }

    // A button will call this function
    //
    function getPhoto(source) {
      // Retrieve image file location from specified source
      navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50,
        destinationType: destinationType.FILE_URI,
        sourceType: source });
    }

    // Called if something bad happens.
    //
    function onFail(message) {
      //alert('Failed because: ' + message);
      Materialize.toast(message, 4000);
    }


    function changeDisplays(type) {
      switch(type) {
        case "list":
        $("#body-loader").css("display","none");
        $("#body-photo").css("display","none");
        $("#body-list").css("display","block");
        break;
        case "photo":
        $("#body-loader").css("display","none");
        $("#body-list").css("display","none");
        $("#body-photo").css("display","block");
        break;
        case "loader":
        $("#body-loader").css("display","block");
        $("#body-list").css("display","none");
        $("#body-photo").css("display","none");

        break;
      }
    }

    function setImageIntoForm(imageData) {
      var smallImage = document.getElementById('smallImage');
      smallImage.src = "data:image/jpeg;base64," + imageData;
      $("#media").val(imageData);
    }

    function setRecentsList() {
      $.ajax({url: "https://flagrapp-server.herokuapp.com/api/recents",
        dataType: "json",
        async: true,
        beforeSend:function(){changeDisplays('loader')},
        complete:function(){changeDisplays('list')},
        success: function (response) {
          $("#list-place").html("");
          if(response != null) {
            $.each(response.message, function(key, value){
              var card = $("<div class=\"row\">"+
               "<div class=\"col s12 m7\">"+
               "<div class=\"card\">"+
               "<div class=\"card-image\">"+
               "<img src=\""+value.media+"\" style=\"width:100%; height:auto;\">"+
               "<span class=\"card-title\">"+value.text+"</span>"+
               "</div></div></div></div>");
              $("#list-place").append(card);
            });
          }
        },
        error: function (xhr, ajaxOptions, thrownError) {
          onFail('Network issue '+ xhr.status +' Error: ' + thrownError);
          console.log('Network issue '+ xhr.status +' Error: ' + thrownError);
        }
      });
    }

  function postPic(frm) {
      var url = "https://flagrapp-server.herokuapp.com/api/publish";
      var optionStatus = $("#status-tipo option:selected").val();
      var data = '{ "media" : "'+$("#media").val()+'",'+
                 ' "status" : "#Flagrapp '+$("input:text").val()+' '+optionStatus+'" }';

      $.ajax({url: url,
          dataType: "json",
          async: true,
          method: "POST",
          contentType: "application/json",
          data: data,
          beforeSend:function(){changeDisplays('loader')},
          complete:function(){changeDisplays('list')},
          success: function (response) {
            setRecentsList();
          },
          error: function (xhr, ajaxOptions, thrownError) {
            onFail('Network issue '+ xhr.status +' Error: ' + thrownError);
            console.log('Network issue '+ xhr.status +' Error: ' + thrownError);
          }
        });
  }

    // var str = JSON.stringify(postData);
    $.fn.serializeObject = function() {
      var o = {};
      var a = this.serializeArray();
      $.each(a, function() {
        if (o[this.name] !== undefined) {
          if (!o[this.name].push) {
            o[this.name] = [o[this.name]];
          }
          o[this.name].push(this.value || '');
        } else {
          o[this.name] = this.value || '';
        }
      });
      return o;
    }