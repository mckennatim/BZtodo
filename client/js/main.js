/*----------------------------Events-------------------------*/

$( document ).ready(function() {
  model.loadList();
  $('form').submit(function(){
    ctrl.add2list(); 
  });
  $('input[type="checkbox"]').live('click',function(){
    ctrl.updDone($(this));
  }) 
  $('.priority').live('change', function(){
    ctrl.updPriority($(this));
  }) 
  $('a').live('click', function(){
    ctrl.deleteItem($(this));
  })
  $('#sortDoneBut').click(function(){
    ctrl.sortOnDone();
  })
  $('#sortPriorBut').click(function(){
    ctrl.sortOnPriority();
  })
});

/*----------------------------Model-------------------------*/

var model = {
  list: {BZtodo:[]},
  priority: ['high', 'normal', 'low'],
  defaultPriority: 'normal',
  urlqstr: 'list=BZtodo',
  defaultPriorityIdx: 1, 
  saveList: function(){
    var listJ=JSON.stringify(this.list);
    localStorage.setItem('BZtodo', listJ);
    itemsJ = JSON.stringify(this.list.BZtodo)
    $.post("../server/post.php?"+this.urlqstr, {data: itemsJ}).done(function(data){});     
  },
  loadList: function(){
    $.get('../server/get.php', this.urlqstr, function(dataJ) {
      if (!(dataJ==false)){
        var data =JSON.parse(dataJ);
        var items = JSON.parse(data.items);
        model.list.BZtodo = items;
        view.refreshList(model.list.BZtodo);
        localStorage.setItem('BZtodo',JSON.stringify(model.list));           
      }
    }); 
  } 
}

/*----------------------------Controller-------------------------*/

var ctrl ={
  add2list:function(item){
    event.preventDefault();
    console.log($('#inpTxt').val())
    var newItem = $('input').val();
    if(newItem.length>1){  
      var itemObject ={
        item: newItem,
        done: false,
        priority: model.defaultPriorityIdx
      }
      view.appendLi(itemObject);
      model.list.BZtodo.push(itemObject);
      model.saveList();
    }
    $('#inpTxt').val('');
  },
  updDone: function(el){
    var done;
    if(el.prop('checked')){
      done=true;
    }else{
      done=false
    }
    model.list.BZtodo[el.parent().index()].done=done;
    model.saveList();
  },
  updPriority: function(el){
    model.list.BZtodo[el.parent().parent().index()].priority=el.val()*1;
    model.saveList();
  },
  deleteItem: function(el){
    event.preventDefault();
    var idx = el.parent().parent().index();
    if (idx > -1) {
      model.list.BZtodo.splice(idx, 1);
    }
    view.refreshList(model.list.BZtodo);
    model.saveList();    
  },
  sortOnDone: function(){
    event.preventDefault();
    model.list.BZtodo.sort(function(a,b){
      return a.done-b.done
    })
    view.refreshList(model.list.BZtodo);
    model.saveList();
  },
  sortOnPriority: function(){
    event.preventDefault();
    model.list.BZtodo.sort(function(a,b){
      return a.priority-b.priority
    })
    view.refreshList(model.list.BZtodo);
    model.saveList();    
  }

} 

/*----------------------------View-------------------------*/

var view ={
  appendLi: function(itemObj){
    var item = itemObj.item;
    var priority = itemObj.priority;
    var checked='';
    if(itemObj.done){checked='checked="checked"'}
    $('ul').append('<li class="list-group-item">'
      +'<input type="checkbox"'+checked+'/>'
      +'<span class="item"> '+ item +'</span>'
      +'<span class="list-right">'
      + this.priorityOptions(priority)
      +'<a href="">'
      +'<span class="glyphicon glyphicon-remove-sign"></span>'
      +'</a></span>'
      +'</li>');
  },
  refreshList: function(list){
    $('ul').empty();
    $.each(list, function(index, itemObj) {
      view.appendLi(itemObj);
    });
  },
  priorityOptions: function(pridx){
    var ostr= '<select class="priority">';
    $.each(model.priority, function(index, opt){
      if(index==pridx){
        ostr+= '<option value='+index+' selected="selected">'+opt+'</option>';        
      }else{
        ostr+= '<option value='+index+'>'+opt+'</option>';        
      }
    })
    ostr+='</select>';
    return ostr;
  } 
}
