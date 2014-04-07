'use strict';


// Declare app level module which depends on filters, and services
var bzTodoApp = angular.module('bzTodoApp', [
  'ngRoute'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/list', {templateUrl: 'partials/list.html', controller: 'ListCtrl'});
  $routeProvider.otherwise({redirectTo: '/list'});
}],
  ['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  }
]);


bzTodoApp.controller('ListCtrl', function($scope, $http) {

  // Get all todos
  $http.get('../server/get.php?list=BZtodo').then(function(dataJ) {

    if (!(dataJ==false)){
      console.log(dataJ.data)
      var items =JSON.parse(dataJ.data.items);
      console.log(items);
      $scope.list = items;
      //view.refreshList(model.list.BZtodo);
      localStorage.setItem('BZtodoNg',JSON.stringify($scope.list));           
    }
  });

  $scope.priorities = [{level:'high'}, {level:'normal'}, {level:'low'}];
  $scope.defaultPriority = 'normal';
  $scope.urlqstr = 'list=BZtodo';
  $scope.defaultPriorityIdx = 1;
  $scope.spriority = $scope.priorities[1];

/*

  $scope.add2List = function(newItem) {
    var itemObject ={
      item: newItem,
      done: false,
      priority: model.defaultPriorityIdx
    }
    $http.post('../server/post.php?list=BZtodo', {
      title: item,

    }).success(function(todo) {
      $scope.newTodoTitle = '';
      $scope.todos.push(todo);
    }).error(function(err) {
      // Alert if there's an error
      return alert(err.message || "an error occurred");
    });
  };

  $scope.changeCompleted = function(todo) {
    // Update the todo
    $http.put('/todos/' + todo.id, {
      completed: todo.completed
    }).error(function(err) {
      return alert(err.message || (err.errors && err.errors.completed) || "an error occurred");
    });
  };

  $scope.removeCompletedItems = function() {
    $http.get('/todos', {
      params: {
        completed: true
      }
    }).success(function(todos) {
      todos.forEach(function(t) { deleteTodo(t); });
    });
  };

  function deleteTodo(todo) {
    $http.delete('/todos/' + todo.id, {
      params: {
        completed: true
      }
    }).success(function() {
      // Find the index of an object with a matching id
      var index = $scope.todos.indexOf(
          $scope.todos.filter(function(t) {
            return t.id === todo.id;
          })[0]);

      if (index !== -1) {
        $scope.todos.splice(index, 1);
      }
    }).error(function(err) {
      alert(err.message || "an error occurred");
    });
  }
*/
});

bzTodoApp.directive('isChecked', ['isChecked', function(){
  // Runs during compile
  return {
    // name: '',
    // priority: 1,
    // terminal: true,
    // scope: {}, // {} = isolate, true = child, false/undefined = no change
    // controller: function($scope, $element, $attrs, $transclude) {},
    // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
    restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
    // template: '',
    // templateUrl: '',
    // replace: true,
    // transclude: true,
    // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
    link: function($scope, iElm, iAttrs, controller) {
      
    }
  };
}]);
