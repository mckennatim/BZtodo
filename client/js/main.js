
  $( document ).ready(function() {

    model.loadList();
    console.log(view.priorityOptions());

    $('form').submit(function(){
      var newItem = $('input').val();
      if(newItem.length>1){
        ctrl.add2List(newItem);
      }
      $('input').val('');
      return false; 
    });

    $('input[type="checkbox"]').live('click',function(){
      ctrl.updDone($(this));
    }) 

    $('.priority').live('change', function(){
      console.log('firing on priority change');
      ctrl.updPriority($(this));
    }) 

    $('a').live('click', function(){
      ctrl.deleteItem($(this));
      return false;
    })

    $('#sortDoneBut').click(function(){
      console.log('sortDoneBut')
      ctrl.sortOnDone();
      return false;
    })

    $('#sortPriorBut').click(function(){
      ctrl.sortOnPriority();
      return false;
    })

  });


var model = {
  list: {BZtodo:[]},
  priority: ['high', 'normal', 'low'],
  defaultPriority: 'normal',
  urlqstr: 'list=BZtodo',
  defaultPriorityIdx: 1, 
  testData:{
    name: 'Timothy Scott McKenna'
  },
  saveList: function(){
    var listJ=JSON.stringify(this.list);
    localStorage.setItem('BZtodo', listJ);
    itemsJ = JSON.stringify(this.list.BZtodo)
    $.post("../server/post.php?"+this.urlqstr, {data: itemsJ}).done(function(data){});     
  },
  loadList: function(){
    $.get('../server/get.php', this.urlqstr, function(dataJ) {
      console.log(!(dataJ==false));
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

var ctrl ={
  add2list:function(item){
    var itemObject ={
      item: item,
      done: false,
      priority: model.defaultPriorityIdx
    }
    view.appendLi(itemObject);
    model.list.BZtodo.push(itemObject);
    model.saveList();
  },
  updDone: function(el){
    var done;
    if(el.prop('checked')){
      done=true;
    }else{
      done=false
    }
    console.log(el.parent().index())
    model.list.BZtodo[el.parent().index()].done=done;
    model.saveList();
  },
  updPriority: function(el){
    console.log(el.parent().parent());
    model.list.BZtodo[el.parent().parent().index()].priority=el.val()*1;
    model.saveList();
  },
  deleteItem: function(el){
    var idx = el.parent().parent().index();
    if (idx > -1) {
      model.list.BZtodo.splice(idx, 1);
    }
    view.refreshList(model.list.BZtodo);
    model.saveList();    
  },
  sortOnDone: function(){
    model.list.BZtodo.sort(function(a,b){
      return a.done-b.done
    })
    view.refreshList(model.list.BZtodo);
    model.saveList();
  },
  sortOnPriority: function(){
    model.list.BZtodo.sort(function(a,b){
      return a.priority-b.priority
    })
    view.refreshList(model.list.BZtodo);
    model.saveList();    
  }

} 

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
  },  
}
