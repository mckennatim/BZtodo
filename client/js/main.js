$( document ).ready(function() {

  ctrl.loadList();

  $('form').submit(function(){
    var newItem = $('input').val();
    if(newItem.length>1){
      ctrl.addItem(newItem);
    }
    $('input').val('');
    return false; 
  });
  

});

var ctrl ={
  list: {BZtodo:[]},
  priority: ['high', 'normal', 'low'],
  defaultPriority: 'normal',
  addItem: function(item){
    this.add2list(item);
  },
  add2list:function(item){
    var itemObject ={
      item: item,
      done: false,
      priority: this.priority.indexOf(this.defaultPriority)
    }
    view.appendLi(itemObject);
    this.list.BZtodo.push(itemObject);
    this.saveList();
  },
  saveList: function(){
    var listJ=JSON.stringify(this.list);
    localStorage.setItem('BZtodo', listJ);     
  },
  loadList: function(){
    this.list= JSON.parse(localStorage.BZtodo);
    view.refreshList(this.list.BZtodo);
  }

} 

var view ={
  appendLi: function(itemObj){
    var item = itemObj.item;
    var priority = ctrl.priority[itemObj.priority];
    $('ul').append('<li>'
      +'<input type="checkbox"/>'
      +'<span class="item"> '+ item +'</span>'
      +'<span class="priority">' + priority +'</span>'
      +'<a href="">x</a>'
      +'</li>');
  },
  refreshList: function(list){
    $.each(list, function(index, itemObj) {
      console.log(itemObj);
      view.appendLi(itemObj);
    });
  }
}
