var blogApp = angular.module('blogApp',['ngRoute']);

//*** REST Web API functions ***
function getAllBlogs($http){
    return $http.get('/api/blogs');
}

function getBlogById($http,id) {
    return $http.get('/api/edit/' + id);
}

function updateBlogById($http,id,data) {
    return $http.put('/api/edit/' + id, data);
}

function addBlog($http,data){
    return $http.post('/api/blogs',data);
}

function deleteBlog($http,id){
    return $http.delete('/api/delete/' + id);
}
//*** Controllers ***
blogApp.controller('HomeController', function HomeController() {
    var vm = this;
    vm.pageHeader = {
        title: "Blog App"
    };
    vm.message = "Welcome to Kyle Kalbach's Blog site!";
});

blogApp.controller('ListController', function ListController($http) {
    var vm = this;
    vm.pageHeader = {
        title: "Blog List"
    };

    getAllBlogs($http)
        .then(function successCallBack(response) {
            vm.blogs = response.data;
            vm.message = "Blog data found!";
        },function errorCallBack(response){
            vm.message = "Could not get list of blogs";
        });
});

blogApp.controller('EditController', ['$http','$routeParams','$location',function EditController($http,$routeParams,$location) {
    var vm = this;
    vm.blog ={};
    vm.id = $routeParams.id;
    vm.pageHeader = {
        title: "Blog Edit"
    };

    getBlogById($http,vm.id)
        .then(function successCallBack(response) {
            vm.blog = response.data;
            vm.message ="Blog data found!"
        }),function errorCallBack(response){
            vm.message = "Could not find Blog with id of " + vm.id;
        };
    vm.submit = function(){
        var data = vm.blog;
        data.title = userForm.title.value;
        data.text = userForm.text.value;
        $location.path(['/blog-list']);
    updateBlogById($http,vm.id,data)
        .then(function successCallBack(response){
            vm.message="Blog data updated!";
        }),function errorCallBack(response){
            vm.message = "Could not update book given id of " + vm.id + userForm.title.text + " " + userForm.text.text ;
        }
    }
}]);

blogApp.controller('DeleteController',['$http','$location','$routeParams',function DeleteController($http,$location,$routeParams) {
    var vm = this;
    vm.blog ={};
    vm.id = $routeParams.id;
    vm.pageHeader = {
        title: "Blog Delete"
    };
    getBlogById($http,vm.id)
    .then(function successCallBack(response) {
        vm.blog = response.data;
        vm.message ="Blog data found!"
    }),function errorCallBack(response){
        vm.message = "Could not find Blog with id of " + vm.id;
    };

    vm.delete = function(){
        $location.path(['/blog-list']);
        deleteBlog($http,vm.id)
        .then(function successCallBack(response){
            vm.message="Blog Deleted!";
        }),function errorCallBack(response){
            vm.message = "Failed to delete Blog" ;
        }
    }
}]);

blogApp.controller('AddController',['$http','$location',function AddController($http,$location) {
    var vm = this;
    vm.pageHeader = {
        title: "Blog Add"
    };
    vm.add = function(){
        var data = {};
        data.title = userForm.title.value;
        data.text = userForm.text.value;
        data.createOn = Date.now();

    addBlog($http,data)
        .then(function successCallBack(response) {
            vm.message = "Blog Added";
            $location.path(['/blog-list']);
        }),function errorCallBack(response){
            vm.message = "Blog failed to add"; 
        }
    }
}]);


//*** Router Provider ***
blogApp.config(function($routeProvider,$locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'pages/home.html',
            controller: 'HomeController',
            controllerAs: 'vm'
            })
  
        .when('/blog-list', {
            templateUrl: 'pages/blog-list.html',
            controller : 'ListController',
            controllerAs: 'vm'
            })
  
        .when('/blog-add', {
            templateUrl: 'pages/blogAdd.html',
            controller: 'AddController',
            controllerAs: 'vm'
            })
            
        .when('/blog-edit/:id', {
            templateUrl: 'pages/blogEdit.html',
            controller: 'EditController',
            controllerAs: 'vm'
            })
        .when('/blog-delete/:id', {
                templateUrl: 'pages/blogDelete.html',
                controller: 'DeleteController',
                controllerAs: 'vm'
                })
  
        .otherwise({redirectTo: '/'});
        $locationProvider.html5Mode(true);
      });
    angular
        .module('blogApp')
        .config(['$routeProvider','$locationProvider', blogApp.config]);