(function() {
    'use strict';

    window.onload = function() {
        checklist.init(addItemListener);
    }

    var config = {
        apiKey: "AIzaSyAToilXdu-MAtXr0vWXOC9q_eTErtPbn0A",
        authDomain: "cloud-checklist.firebaseapp.com",
        databaseURL: "https://cloud-checklist.firebaseio.com",
        storageBucket: "cloud-checklist.appspot.com",
        messagingSenderId: "51566897564"
    };
    firebase.initializeApp(config);
    var httpRequest,
        http = function(config, callback) {

          httpRequest = new XMLHttpRequest();
          httpRequest.withCredentials = true;

          if (!httpRequest) {
            console.log('XMLHTTPRequest not supported');
            return false;
          }

          httpRequest.onreadystatechange = stateChanged;

          if(config.method && config.url){
            httpRequest.open(config.method, config.url, true);
          }
          if(config.headers){
            for (var header in config.headers) {
              if (config.headers.hasOwnProperty(header)) {
                httpRequest.setRequestHeader(header, config.headers[header]);
              }
            }
          }
          if(config.data){
            httpRequest.send(JSON.stringify(config.data));
          }
          else{
            httpRequest.send();
          }

          function stateChanged() {
              if (httpRequest.readyState === XMLHttpRequest.DONE) {
                  callback(httpRequest);
              }
          }
      }
    var rest = {
        addUser: addUser,
        getUser: getUser,
        findUser: findUser,
        addChecklist: addChecklist,
        updateChecklist: updateChecklist,
        share: share
    };

    function addUser() {
      http({
        'method' : 'POST',
        'headers' : {
          'Content-type' : 'application/json'
        },
        'url' : 'http://localization.englishduniya.in/get/json',
        'data' : {
          h : 'one'
        }
      }, function(response){
        if (response.status === 200) {
            console.log(response.responseText);
        } else {
            console.log('There was a problem with the request.');
        }
      })
    }

    function getUser() {}

    function findUser() {}

    function addChecklist() {}

    function updateChecklist() {}

    function share() {}

    var checklist = {
        addList: addList,
        deleteList: deleteList,
        init: init,
        save: save,
        getCount : getCount
    };

    function deleteList() {
        console.log(this)
        var ul = this.parentNode.parentNode;
        var li = this.parentNode;
        ul.removeChild(li)
        checklist.save()
    }

    function getCount() {
        var list = document.querySelector('#checklist')
        var total = list.children.length;
        var checked = 0;
        for (var i = total - 1; i >= 0; i--) {
            list.children[i].children[1].checked && checked++;
        }

        return '('+checked+'/'+total+')'

    }

    function addItemListener() {
        document.querySelectorAll('ul#checklist > li > input.checkbox').forEach(function(item) {
            item.addEventListener('click', function() {
                checklist.save();
            })
        })

        document.querySelectorAll('ul#checklist > li > a.delete').forEach(function(anchor) {
            anchor.addEventListener('click', checklist.deleteList)
        })
    }

    function init(callback) {

        document.querySelector('button#addItemBtn').addEventListener('click', function() {
            checklist.addList(
                false,
                document.querySelector('#newItem').value,
                function(ele){
                    ele.addEventListener('click', checklist.deleteList)
                });
            checklist.save();
        })
        // document.querySelector('button#addUserBtn').addEventListener('click', function() {
        //     rest.addUser();
        // })

        chrome.storage.sync.get('checklist', function(data) {
            console.log(data)
            for (var list in data.checklist) {
                if (data.checklist.hasOwnProperty(list)) {
                    checklist.addList(data.checklist[list].checked, data.checklist[list].item)
                }
            }
            checklist.getCount()
            callback();
        });
    }

    function addList(checked, item, callback) {
        console.log('item %s', item)
        checked = checked == null ? false : checked;
        var node = document.createElement("li");
        node.setAttribute('class', 'list-item');
        node.innerHTML = "<a class=\"icon icon-delete delete pull-right\">x</a><input type=\"checkbox\" class=\"checkbox\"><label class=\"truncate\" >" + item + "</label>";
        node.children[1].checked = checked;
        callback && callback(node.children[0])
        document.querySelector("ul#checklist").appendChild(node);
    }

    function save() {
        var checklist = document.querySelector('#checklist').children;
        var syncList = {};
        for (var i = 0; i < checklist.length; i++) {
            syncList[i] = {
                "checked": checklist[i].children[1].checked,
                "item": checklist[i].children[2].textContent
            }
        }
        console.log(syncList)
        chrome.storage.sync.set({
            "checklist": syncList
        }, function() {
            console.log("checklist saved")
        });
    }
})();
