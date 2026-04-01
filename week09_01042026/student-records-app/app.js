var app = angular.module('studentApp', []);
app.controller('studentCtrl', function($scope) {
    $scope.students = [];
    $scope.student = {};
    $scope.editMode = false;
    $scope.editIndex = -1;

    $scope.submitStudent = function() {
        if ($scope.editMode) {
            $scope.students[$scope.editIndex] = angular.copy($scope.student);
            $scope.editMode = false;
        } else {
            $scope.students.push(angular.copy($scope.student));
        }
        $scope.student = {};
        $scope.studentForm.$setPristine();
        $scope.studentForm.$setUntouched();
    };

    $scope.editStudent = function(student) {
        $scope.student = angular.copy(student);
        $scope.editMode = true;
        $scope.editIndex = $scope.students.indexOf(student);
    };

    $scope.deleteStudent = function(index) {
        $scope.students.splice(index, 1);
    };

    $scope.cancelEdit = function() {
        $scope.student = {};
        $scope.editMode = false;
        $scope.editIndex = -1;
        $scope.studentForm.$setPristine();
        $scope.studentForm.$setUntouched();
    };
});