// Declare variables
let guidelinesArray = {};
let tagsArray = [];
let tags = [];
let selectedGuideline = "";
let selectedTag = "";
let selectedRole = "";
let guideline = "";
//Test
//load tags.json object
renderPage();

function renderPage() {
  loadJSON(function(response) {
    // Parse JSON string into object
    guidelinesArray = JSON.parse(response);
    //console.log(tagObject);
    // console.log(guidelinesArray);
    loadTags(guidelinesArray);
  });

  function loadJSON(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open(
      "GET",
      "https://kanusobti.github.io/AccessibilityGuidelines/tags.json",
      true
    ); //Hosted the file to avoid CORS error
    xobj.onreadystatechange = function() {
      if (xobj.readyState == 4 && xobj.status == "200") {
        // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
        callback(xobj.responseText);
      }
    };
    xobj.send(null);
  }

  function loadTags(guidelinesArrayObj) {
    Object.keys(guidelinesArrayObj).forEach(function(key) {
      let tagObject = guidelinesArray[key];
      let tagString = tagObject.tags.split("|");
      tagsArray = tagsArray.concat(tagString);
      //console.log(tagsArray);
    });

    tags = tagsArray.filter(getUniqueValues);
    renderGuidelines(guidelinesArrayObj);
    renderTags(tags);
  }

  function getUniqueValues(value, index, self) {
    return self.indexOf(value) === index;
  }

  function renderGuidelines(guidelines) {
    //NOT USING TEMPLATE LITERALS FOR IE 11 SUPPORT
    Object.keys(guidelines).forEach(function(key) {
      document.getElementById(
        "radioBtnGuidelines"
      ).innerHTML += '<div class="radioDiv"><input type="radio" name="guidelines" value="'
        .concat(guidelines[key].name, '" id="')
        .concat(
          guidelines[key].name,
          '" onclick="DisableTags()" /> <label for="'
        )
        .concat(guidelines[key].name, '">')
        .concat(guidelines[key].name, "</label> </div>");
    });
  }

  function renderTags(tags) {
    //NOT USING TEMPLATE LITERALS FOR IE11 SUPPORT
    Object.keys(tags).forEach(function(key) {
      document.getElementById(
        "radioBtnTags"
      ).innerHTML += '<div class="radioDiv"><input type="radio" name="tags" value="'
        .concat(tags[key], '" id="')
        .concat(tags[key], '" onclick="DisableGuidelines()" /><label for="')
        .concat(tags[key], '">')
        .concat(tags[key], "</label></div>");
    });
  }

  //Apply Click Event
  document.getElementById("btnApply").onclick = renderContent;

  function renderContent() {
    document.getElementById("content").innerHTML = "";
    selectedGuideline = getSelectecRadioButton("guidelines");
    selectedTag = getSelectecRadioButton("tags");
    selectedRole = getSelectecRadioButton("roles");

    if (
      ((selectedTag === "" || selectedTag === undefined) &&
        (selectedGuideline === "" || selectedGuideline === undefined)) ||
      selectedRole === "" || selectedRole === undefined
    ) {
      (selectedRole === "" || selectedRole === undefined) &&
      (selectedTag === "" || selectedTag === undefined) &&
      (selectedGuideline === "" || selectedGuideline === undefined)
        ? (document.getElementById("content").innerHTML =
            "<h2>Please select atleast one Role along with a Guideline or a Tag</h2>")
        : selectedRole === "" || selectedRole === undefined
        ? (document.getElementById("content").innerHTML =
            "<h2>Please select atleast one Role</h2>")
        : (document.getElementById("content").innerHTML =
            "<h2>Please select a Guideline or a Tag!</h2>");
    } else {
      if (selectedTag === undefined || selectedTag === "") {
        guideline = guidelinesArray.filter(function(obj) {
          return obj.name == selectedGuideline;
        });
      } else {
        guideline = guidelinesArray.filter(function(item) {
          return item.tags.indexOf(selectedTag) !== -1;
        });
      }
      //console.log(guideline[0].snippets[selectedRole]);
      Object.keys(guideline).forEach(function(key) {
        if (selectedRole === "dev") {
          document.getElementById("content").innerHTML +=
            '<div class="contentDiv"><h3>' +
            guideline[key].name +
            "-" +
            selectedRole +
            ".html</h3>" +
            guideline[key].snippets[selectedRole] +
            "<h3>Tags</h3><p>".concat(guideline[key].tags, "</p>") +
            "<span>" +
            guideline[key].name +
            "-Code.html</span>" +
            guideline[key].snippets["code"]
              .split("&gt;&lt;")
              .join("&gt;\n&lt;") +
            "</div>";
        } else {
          document.getElementById("content").innerHTML +=
            '<div class="contentDiv"><h3>' +
            guideline[key].name +
            "-" +
            selectedRole +
            ".html</h3>" +
            guideline[key].snippets[selectedRole] +
            "<h3>Tags</h3><p>".concat(guideline[key].tags, "</p>") +
            "</div>";
        }
      });
    }
    //reset everything
    resetRadioButtons();
    selectedGuideline = "";
    selectedTag = "";
    selectedRole = "";
  }
}
function getSelectecRadioButton(groupName) {
  let radioBtnGroup = document.getElementsByName(groupName);
  let selectedRadioBtn = "";
  for (i = 0; i < radioBtnGroup.length; i++) {
    if (radioBtnGroup[i].checked) {
      selectedRadioBtn = radioBtnGroup[i].value;
      return selectedRadioBtn;
    }
  }
}
function resetRadioButtons() {
  var radios = document.getElementsByName("tags");
  for (var i = 0, r = radios, l = r.length; i < l; i++) {
    r[i].disabled = false;
    r[i].checked = false;
  }
  var radios = document.getElementsByName("guidelines");
  for (var i = 0, r = radios, l = r.length; i < l; i++) {
    r[i].disabled = false;
    r[i].checked = false;
  }
  var radios = document.getElementsByName("roles");
  for (var i = 0, r = radios, l = r.length; i < l; i++) {
    r[i].disabled = false;
    r[i].checked = false;
  }
}
function DisableTags() {
  // document.getElementById("radioBtnTags").disabled = true;
  var radios = document.getElementsByName("tags");
  for (var i = 0, r = radios, l = r.length; i < l; i++) {
    r[i].disabled = true;
  }
}
function DisableGuidelines() {
  var radios = document.getElementsByName("guidelines");
  for (var i = 0, r = radios, l = r.length; i < l; i++) {
    r[i].disabled = true;
  }
}
