(function(){
  'use strict';

  var checklist = {};
  checklist.addList = addList;
  checklist.deleteList = deleteList;
  checklist.init = init;
  checklist.save = save;

  window.onload = function(){
    checklist.init(addItemListener);
  }

  function deleteList() {
    var ul = this.parentNode.parentNode;
    var li = this.parentNode;
    ul.removeChild(li)
    checklist.save()
  }

  function addItemListener() {
    document.querySelectorAll('ul#checklist > li > input.checkbox').forEach(function(item){
      item.addEventListener('click', function(){
        checklist.save();
      })
    })

    document.querySelectorAll('ul#checklist > li > a.delete').forEach(function(anchor){
      anchor.addEventListener('click', checklist.deleteList)
    })
  }

  function init(callback){

    document.querySelector('button#addItemBtn').addEventListener('click', function(){
      checklist.addList(false, document.querySelector('#newItem').value);
      checklist.save();
    })

    chrome.storage.sync.get('checklist', function (data) {
      console.log(data)
      for (var list in data.checklist) {
        if (data.checklist.hasOwnProperty(list)) {
          checklist.addList(data.checklist[list].checked, data.checklist[list].item)
        }
      }
      callback();
    });
  }

  function addList(checked, item){
    checked = checked == null ? false : checked;
    var node = document.createElement("li");
    node.innerHTML = "<input type=\"checkbox\" class=\"checkbox\"><label>"+ item +"</label><a class=\"delete\">delete</a>";
    node.children[0].checked = checked;
    document.querySelector("ul#checklist").appendChild(node);
  }

  function save() {
      var checklist = document.querySelector('#checklist').children;
      var syncList = {};
      for (var i = 0; i < checklist.length; i++) {
        syncList[i] = {
          "checked" : checklist[i].children[0].checked,
          "item" : checklist[i].children[1].textContent
        }
      }
      console.log(syncList)
      chrome.storage.sync.set({"checklist" : syncList}, function() {
       console.log("checklist saved")
     });
  }
})();
