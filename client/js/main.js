$( document ).ready(function() {
  console.log( "ready!" );

  $('form').submit(function(){
    var newItem = $('input').val();
    $('ul').append('<li>'
      +'<input type="checkbox"/>'
      +'<span class="item"> '+ newItem +'</span>'
      +'<span class="priority"> nornal </span>'
      +'<a href="">x</a>'
      +'</li>');
    return false; 
  })
});