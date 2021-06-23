var API_KEY = 'APIKEY_HERE';
var GOOGLE_URL = 'https://vision.googleapis.com/v1/images:annotate?key=' + API_KEY;

$(function () {
  $('#fileform').on('submit', uploadFiles);
});

function uploadFiles (event) {
  event.preventDefault();
  $('#results').text("");
  $('#result-image').html("");
  
  var file = $('#fileform [name=imagefile]')[0].files[0];
  var reader = new FileReader();
  
  reader.onloadend = sendFileToCloudVision;
  reader.readAsDataURL(file);
}

function sendFileToCloudVision (event) {
  var content = event.target.result;

  $('#result-image').html('<img class="result-image" src=' + content + '>');

  var request = {
    requests: [{
      image: {
        content: content.replace('data:image/jpeg;base64,', '')
      },
      features: [{
        type: 'TEXT_DETECTION',
        maxResults: 200
      }],
      imageContext:{
        languageHints:["ja","en"]
      }
    }]
  };

  $.post({
    url: GOOGLE_URL,
    data: JSON.stringify(request),
    contentType: 'application/json'
  }).fail(function (jqXHR, textStatus, errormsg) {
    showError(jqXHR, textStatus, errormsg);
  }).done(function(data){
    showData(data);
  });
}

function showData (data) {
  var text = data['responses'][0]['fullTextAnnotation']['text'];
  text.replace("\n", "<br>");
  $('#results').text(text);
  var evt = new Event('results-displayed');
  evt.results = text;
  document.dispatchEvent(evt);
}

function showError(jqXHR, textStatus, errormsg) {
  $('#results').text('error: ' + textStatus + ' ' + errormsg);
}
