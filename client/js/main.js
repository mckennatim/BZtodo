$( document ).ready(function() {

  ctrl.loadList();
  console.log(ctrl.priorityOptions());

  $('form').submit(function(){
    var newItem = $('input').val();
    if(newItem.length>1){
      ctrl.addItem(newItem);
    }
    $('input').val('');
    return false; 
  });

  $('input[type="checkbox"]').live('click',function(){
    ctrl.updDone($(this));
  }) 

  $('#priority').live('change', function(){
    ctrl.updPriority($(this));
  }) 

  $('a').live('click', function(){
    ctrl.deleteItem($(this));
    return false;
  })

  $('#sortDoneBut').click(function(){
    ctrl.sortOnDone();
    return false;
  })

  $('#sortPriorBut').click(function(){
    ctrl.sortOnPriority();
    return false;
  })

});

var ctrl ={
  list: {BZtodo:[]},
  priority: ['high', 'normal', 'low'],
  defaultPriority: 'normal',
  defaultPriorityIdx: 1,
  priorityOptions: function(pridx){
    var ostr= '<select id="priority">';
    $.each(this.priority, function(index, opt){
      if(index==pridx){
        ostr+= '<option value='+index+' selected="selected">'+opt+'</option>';        
      }else{
        ostr+= '<option value='+index+'>'+opt+'</option>';        
      }
    })
    ostr+='</select>';
    return ostr;
  },
  addItem: function(item){
    this.add2list(item);
  },
  add2list:function(item){
    var itemObject ={
      item: item,
      done: false,
      priority: this.defaultPriorityIdx
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
    if(localStorage.BZtodo!=undefined){
      this.list= JSON.parse(localStorage.BZtodo);
      view.refreshList(this.list.BZtodo);
    } 
  },
  updDone: function(el){
    var done;
    if(el.prop('checked')){
      done=true;
    }else{
      done=false
    }
    console.log(el.parent().index())
    this.list.BZtodo[el.parent().index()].done=done;
    this.saveList();
  },
  updPriority: function(el){
    this.list.BZtodo[el.parent().index()].priority=el.val()*1;
    this.saveList();
  },
  deleteItem: function(el){
    var idx = el.parent().index();
    if (idx > -1) {
      this.list.BZtodo.splice(idx, 1);
    }
    view.refreshList(this.list.BZtodo);
    this.saveList();    
  },
  sortOnDone: function(){
    this.list.BZtodo.sort(function(a,b){
      return a.done-b.done
    })
    console.log(this.list.BZtodo)
    view.refreshList(this.list.BZtodo);
    this.saveList();
  },
  sortOnPriority: function(){
    this.list.BZtodo.sort(function(a,b){
      return a.priority-b.priority
    })
    console.log(this.list.BZtodo)
    view.refreshList(this.list.BZtodo);
    this.saveList();    
  }

} 

var view ={
  appendLi: function(itemObj){
    var item = itemObj.item;
    var priority = itemObj.priority;
    var checked='';
    if(itemObj.done){checked='checked="checked"'}
    $('ul').append('<li>'
      +'<input type="checkbox"'+checked+'/>'
      +'<span class="item"> '+ item +'</span>'
      + ctrl.priorityOptions(priority)
      +'<a href="">x</a>'
      +'</li>');
  },
  refreshList: function(list){
    $('ul').empty();
    $.each(list, function(index, itemObj) {
      view.appendLi(itemObj);
    });
  }
}
