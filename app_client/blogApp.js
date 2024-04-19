var blogApp = angular.module('blogApp', ['ngRoute']);

//*** REST Web API functions ***
function getAllBlogs($http) {
    return $http.get('/api/blogs');
}

function getBlogById($http, authentication, id) {
    return $http.get('/api/edit/' + id, { headers: { Authorization: 'Bearer ' + authentication.getToken() } });
}

function updateBlogById($http, authentication, id, data) {
    return $http.put('/api/edit/' + id, data, { headers: { Authorization: 'Bearer ' + authentication.getToken() } });
}

function addBlog($http, data, authentication) {
    return $http.post('/api/blogs', data, { headers: { Authorization: 'Bearer ' + authentication.getToken() } });
}

function deleteBlog($http, id, authentication) {
    return $http.delete('/api/delete/' + id, { headers: { Authorization: 'Bearer ' + authentication.getToken() } });
}

//API Ticket Functions
function getAllTickets($http) {
    return $http.get('/api/tickets');
}

//*** Controllers ***
blogApp.controller('HomeController', function HomeController() {
    var vm = this;
    vm.pageHeader = {
        title: "Blog App"
    };
    vm.message = "Welcome to Kyle Kalbach's Blog site!";
});

blogApp.controller('ListController', ['$http', 'authentication', function ListController($http, authentication) {
    var vm = this;
    vm.pageHeader = {
        title: "Blog List"
    };
    vm.isLoggedIn = function () {
        return authentication.isLoggedIn();
    };
    vm.isUser = function () {
        return authentication.currentUser().email;
    };
    
    getAllBlogs($http)
        .then(function successCallBack(response) {
            vm.blogs = response.data;
            vm.message = "Blog data found!";
        }, function errorCallBack(response) {
            vm.message = "Could not get list of blogs";
        });
}]);

blogApp.controller('EditController', ['$http', '$routeParams', '$location', 'authentication', function EditController($http, $routeParams, $location, authentication) {
    var vm = this;
    vm.blog = {};
    vm.id = $routeParams.id;
    vm.pageHeader = {
        title: "Blog Edit"
    };
    vm.isLoggedIn = function () {
        return authentication.isLoggedIn();
    };
    vm.getToken = function () {
        return authentication.getToken();
    };
    getBlogById($http, authentication, vm.id)
        .then(function successCallBack(response) {
            vm.blog = response.data;
            vm.message = "Blog data found!"
        }), function errorCallBack(response) {
            vm.message = "Could not find Blog with id of " + vm.id;
        };
    vm.submit = function () {
        var data = vm.blog;
        data.title = userForm.title.value;
        data.text = userForm.text.value;
        $location.path(['/blog-list']);
        updateBlogById($http, authentication, vm.id, data)
            .then(function successCallBack(response) {
                vm.message = "Blog data updated!";
            }), function errorCallBack(response) {
                vm.message = "Could not update book given id of " + vm.id + userForm.title.text + " " + userForm.text.text;
            }
    }
}]);

blogApp.controller('DeleteController', ['$http', '$location', '$routeParams', 'authentication', function DeleteController($http, $location, $routeParams, authentication) {
    var vm = this;
    vm.blog = {};
    vm.id = $routeParams.id;
    vm.pageHeader = {
        title: "Blog Delete"
    };
    getBlogById($http, authentication, vm.id,)
        .then(function successCallBack(response) {
            vm.blog = response.data;
            vm.message = "Blog data found!"
        }), function errorCallBack(response) {
            vm.message = "Could not find Blog with id of " + vm.id;
        };

    vm.delete = function () {
        $location.path(['/blog-list']);
        deleteBlog($http, vm.id, authentication)
            .then(function successCallBack(response) {
                vm.message = "Blog Deleted!";
            }), function errorCallBack(response) {
                vm.message = "Failed to delete Blog";
            }
    }
}]);

blogApp.controller('AddController', ['$http', '$location', 'authentication', function AddController($http, $location, authentication) {
    var vm = this;
    vm.pageHeader = {
        title: "Blog Add"
    };
    vm.add = function () {
        var data = {};
        data.title = userForm.title.value;
        data.text = userForm.text.value;
        data.createdBy = {}
        data.createdBy.userEmail = authentication.currentUser().email;
        data.createdBy.name = authentication.currentUser().name;
        data.createOn = Date.now();
        console.log(data);
        addBlog($http, data, authentication)
            .then(function successCallBack(response) {
                vm.message = "Blog Added";
                $location.path(['/blog-list']);
            }), function errorCallBack(response) {
                vm.message = "Blog failed to add";
            }
    }
}]);

blogApp.controller('LoginController', ['$http', '$location', 'authentication', function LoginController($http, $location, authentication) {
    var vm = this;

    vm.pageHeader = {
        title: 'Sign in to Blogger'
    };

    vm.credentials = {
        email: "",
        password: ""
    };

    vm.returnPage = $location.search().page || '/';

    vm.onSubmit = function () {
        vm.credentials.email = userForm.email.value;
        vm.credentials.password = userForm.password.value;
        vm.formError = "";
        if (!vm.credentials.email || !vm.credentials.password) {
            vm.formError = "All fields required, please try again";
            return false;
        } else {
            vm.doLogin();
        }
    };

    vm.doLogin = function () {
        vm.formError = "";
        authentication
            .login(vm.credentials)
            .then(function () {
                $location.search('page', null);
                $location.path(vm.returnPage);
            }, function errorCallBack(response) {
                vm.formError = response.message;
            });
    };
}]);

blogApp.controller('RegisterController', ['$http', '$location', 'authentication', function RegisterController($http, $location, authentication) {
    var vm = this;

    vm.pageHeader = {
        title: 'Create a new Bloger account'
    };

    vm.credentials = {
        name: "",
        email: "",
        password: ""
    };

    vm.returnPage = $location.search().page || '/';

    vm.onSubmit = function () {
        vm.formError = "";
        if (!vm.credentials.name || !vm.credentials.email || !vm.credentials.password) {
            vm.formError = "All fields required, please try again";
            return false;
        } else {
            vm.doRegister();
        }
    };

    vm.doRegister = function () {
        vm.formError = "";
        authentication
            .register(vm.credentials)
            .then(function () {
                $location.search('page', null);
                $location.path(vm.returnPage);
            }, function errorCallBack(response) {
                vm.formError = "Error registering. Try again with a different email address."
            });
    };
}]);

blogApp.controller('NavigationController', ['$location', 'authentication', function NavigationController($location, authentication) {
    var vm = this;
    vm.currentPath = $location.path();
    vm.currentUser = function () {
        return authentication.currentUser();
    }
    vm.isLoggedIn = function () {
        return authentication.isLoggedIn();
    }
    vm.logout = function () {
        authentication.logout();
        $location.path('/');
    };
}]);

blogApp.controller('AdminTicketController', ['$http', 'authentication', function ListController($http,authentication) {
    var vm = this;
    vm.pageHeader = {
        title: "Ticket Dashboard"
    };
    vm.isLoggedIn = function () {
        return authentication.isLoggedIn();
    };
    vm.isUser = function () {
        return authentication.currentUser().email;
    };
    
    getAllTickets($http)
        .then(function successCallBack(response) {
            vm.tickets = response.data;
            vm.message = "Ticket data found!";
        }, function errorCallBack(response) {
            vm.message = "Could not get list of open tickets";
        });
}]);

//*** Directives ***
blogApp.directive('navigation', function () {
    return {
        restrict: 'EA',
        templateUrl: 'common/directives/navigation.html',
        controller: 'NavigationController',
        controllerAs: 'vm'
    };
});

//*** Authentication Service and Methods **
blogApp.service('authentication', authentication);
authentication.$inject = ['$window', '$http'];
function authentication($window, $http) {
    var vm = this;

    function saveToken(token) {
        $window.localStorage['blog-token'] = token;
    };

    function getToken() {
        return $window.localStorage['blog-token'];
    };

    var register = function (user) {
        console.log('Registering user ' + user.email + ' ' + user.password);
        return $http.post('/api/register', user).then(function successCallBack(response) {
            saveToken(response.data.token);
        }, function errorCallBack(error) {
            vm.message = "failed to register";
        });
    };

    var login = function (user) {
        console.log('Attempting to login user ' + user.email + ' ' + user.password);
        //$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
        return $http.post('/api/login', user).then(function (response) {
            saveToken(response.data.token);
        }, function errorCallBack(error) {
            vm.message = "Failed to login";
        });
    };

    var logout = function () {
        $window.localStorage.removeItem('blog-token');
    };

    var isLoggedIn = function () {
        var token = getToken();

        if (token) {
            var payload = JSON.parse($window.atob(token.split('.')[1]));

            return payload.exp > Date.now() / 1000;
        } else {
            return false;
        }
    };

    var currentUser = function () {
        if (isLoggedIn()) {
            var token = getToken();
            var payload = JSON.parse($window.atob(token.split('.')[1]));
            return {
                email: payload.email,
                name: payload.name,
                isAdmin: payload.isAdmin
            };
        }
    };

    return {
        saveToken: saveToken,
        getToken: getToken,
        register: register,
        login: login,
        logout: logout,
        isLoggedIn: isLoggedIn,
        currentUser: currentUser
    };
}
//*** Router Provider ***
blogApp.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'pages/home.html',
            controller: 'HomeController',
            controllerAs: 'vm'
        })

        .when('/blog-list', {
            templateUrl: 'pages/blog-list.html',
            controller: 'ListController',
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
        .when('/register', {
            templateUrl: 'pages/register.html',
            controller: 'RegisterController',
            controllerAs: 'vm'
        })
        .when('/login', {
            templateUrl: 'pages/login.html',
            controller: 'LoginController',
            controllerAs: 'vm'
        })
        .when('/AdminTickets', {
            templateUrl: 'pages/AdminTickets.html',
            controller: 'AdminTicketController',
            controllerAs: 'vm'
        })
        .otherwise({ redirectTo: '/' });
    $locationProvider.html5Mode(true);
});
angular
    .module('blogApp')
    .config(['$routeProvider', '$locationProvider', blogApp.config]);