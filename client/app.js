window.addEventListener('load', function() {
  var loadingScreen = document.getElementById('loading-screen');
  setTimeout(function() {
    loadingScreen.style.display = 'none';
  }, 500);
});

function getBathValue() {
  var uiBathrooms = document.getElementsByName("uiBathrooms");
  for(var i in uiBathrooms) {
    if(uiBathrooms[i].checked) {
        return parseInt(i)+1;
    }
  }
  return -1; // Invalid Value
}

function getBHKValue() {
  var uiBHK = document.getElementsByName("uiBHK");
  for(var i in uiBHK) {
    if(uiBHK[i].checked) {
        return parseInt(i)+1;
    }
  }
  return -1; // Invalid Value
}

function onClickedEstimatePrice() {
  console.log("Submit Button Clicked");
  var sqft = document.getElementById("uiSqft");
  var bhk = getBHKValue();
  var bathrooms = getBathValue();
  var location = document.getElementById("uiLocations");
  var modal = document.getElementById("estimateModal");
  var modalText = document.getElementById("modalText");
  var span = document.getElementsByClassName("close")[0];

  if (location.value === "") {
    console.log("Error: Please select a Location");
    alert("Please select a Location!");
    return;
  } 
  var url = "http://127.0.0.1:10000/predict_home_price";

  $.post(url, {
      total_sqft: parseFloat(sqft.value),
      bhk: bhk,
      bath: bathrooms,
      location: location.value
  }, function(data, status) {
      console.log(data.estimated_price);
      modalText.innerHTML = "₹ " + data.estimated_price.toString() + " Lakhs";
      console.log(status);
      modal.style.display = "block";
  });

  // Close the modal when the user clicks on <span> (x)
  span.onclick = function() {
      modal.style.display = "none";
  }

  // Close the modal when the user clicks anywhere outside of the modal
  window.onclick = function(event) {
      if (event.target == modal) {
          modal.style.display = "none";
      }
  }
}

function onPageLoad() {
  console.log("Page Loaded");
  var url = "http://127.0.0.1:10000/get_location_names";
  $.get(url, function(data, status) {
    console.log("Got response for get_location_names request");
    if (data) {
      var locations = data.locations;
      var uiLocations = document.getElementById("uiLocations");
      $('#uiLocations').empty();

      // Add default "Select an Option"
      var defaultOption = new Option("Select an Option", "");
      $('#uiLocations').append(defaultOption);

      // Append location options
      for (var i in locations) {
        var opt = new Option(locations[i]);
        $('#uiLocations').append(opt);
      }
    }
  });
}

window.onload = onPageLoad;
