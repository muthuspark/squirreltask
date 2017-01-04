'use strict';

/**
 * @ngdoc overview
 * @name squirreltasksApp
 * @description
 * # squirreltasksApp
 *
 * Main module of the application.
 */
angular
    .module('squirreltasksApp', [])
    .controller('MainCtrl', function($scope, $http) {
        var database = firebase.database();
        //console.log(location)
        $scope.tasks = {};
        $scope.loading = true;
        var userid = location.search.split('=')[1];
        firebase.auth().signInAnonymously().catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
        });

        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                // User is signed in.
                var isAnonymous = user.isAnonymous;
                var uid = user.uid;
                // console.log(user);
                firebase.database().ref('/users/' + userid).once('value').then(function(snapshot) {
                    $scope.tasks = JSON.parse(snapshot.A.B);
                    console.log($scope.tasks);
                    $scope.loading = false;
                    $scope.$apply();
                    // ...
                });
            } else {
                // User is signed out.
                // ...
            }
            // ...
        });

        $scope.selectedCategory = '';

        $scope.addCategory = function() {
            if ($scope.category && !$scope.tasks[$scope.category]) {
                $scope.tasks[$scope.category] = [];
                $scope.category = '';
                $scope.changed = !$scope.changed;
            }
        }

        $scope.selectCategory = function(cat) {
            $scope.selectedCategory = cat;
        }

        $scope.addTask = function() {
            if ($scope.selectedCategory && $scope.task && $scope.time) {
                $scope.tasks[$scope.selectedCategory].push({
                    "task": $scope.task,
                    "createdDate": $scope.time,
                    "done": false
                })
                $scope.task = '';
                $scope.time = '';
                $scope.changed = !$scope.changed;
            }
        }

        $scope.markAsDone = function(item) {
            item.done = true;
            $scope.changed = !$scope.changed;
        }

        $scope.markAsNotDone = function(item) {
            item.done = false;
            $scope.changed = !$scope.changed;
        }

        $scope.removekey = function(cat) {
            delete $scope.tasks[cat];
            console.log($scope.tasks);
            $scope.changed = !$scope.changed;
        }

        $scope.removeTask = function(cat, index){
            $scope.tasks[cat].splice(index,1);
            $scope.changed = !$scope.changed;
        }

        $scope.$watch('changed', function(newval, oldval) {
            if (newval != oldval) {
                localStorage.setItem('tasks', JSON.stringify($scope.tasks));
                firebase.database().ref('users/' + userid).set(JSON.stringify($scope.tasks));
            }
        });

    }).directive('ngEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if (event.which === 13) {
                    scope.$apply(function() {
                        scope.$eval(attrs.ngEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    });;
