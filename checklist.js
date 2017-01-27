window.onload = function(){
  document.querySelector('#addItemBtn').addEventListener('click', addItem)
  document.querySelector('#saveChecklist').addEventListener('click', saveChecklist)
}
function saveChecklist() {
    var checklist = document.querySelector('#checklist').children;
    var syncList = {};
    for (var i = 0; i < checklist.length; i++) {
      syncList[i] = {
        "checked" : false,
        "item" : checklist[i].children[1].textContent
      }
    }
    console.log(syncList)
    chrome.storage.sync.set({"checklist" : syncList}, function() {
       console.log("checklist saved")
     });

}

function addItem(){
  var item = document.querySelector('#newItem').value;
  var node = document.createElement("li");
  node.innerHTML = "<input type=\"checkbox\"><label>"+ item +"</label>";
  document.getElementById("checklist").appendChild(node);     // Append <li> to <ul> with id="myList"
}
