var storage = require('node-persist');
storage.initSync();
storage.setItemSync("testaccount1", [{
    name :"test",
    age : "20"
}]
   )

var data = storage.getItemSync("testaccount1");
console.log(data);