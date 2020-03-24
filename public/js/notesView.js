//notesView.js

(function (angular) {
    
    var theModule = angular.module("notesView", ["ui.bootstrap"]);
    
    theModule.controller("notesViewController", [
        "$scope", "$window", "$http",
        function ($scope, $window, $http) {
            
            $scope.notes = [];
            
            $scope.newNote = createBlankNote();
            
            var urlParts = $window.location.pathname.split("/");
            var catName = urlParts[urlParts.length - 1];
            
            var notesUrl = "/api/notes/" + catName;
            var deleteUrl = "/api/notes/" + catName;
            
            $http.get(notesUrl)
                .then(function (res) {
                //success
                $scope.notes = res.data;

            }, function (err) {
                //error
                alert(err);
            });
            
            
            $scope.save = function () {
                
                $http.post(notesUrl, $scope.newNote).then(
                    function (res) {
                        $scope.notes.push(res.data);
                        
                        $scope.newNote = createBlankNote();
                    },
                    function (err) {
                        console.log(err);
                    });

            };

            $scope.deleteNote = function (idx) {
                
                var note_to_delete = $scope.notes[idx];

                $http.delete(deleteUrl, {params:{note: note_to_delete.note}}).then(
                    function (res) {
                      //  $scope.notes.splice(n, 1);
                        $scope.notes.splice(idx, 1);
                        console.log($scope.notes);
                      // $scope.newNote = createBlankNote();
                    },
                    function (err) {
                        console.log(err);

                      //  $scope.notes.push(n);

                    });
            };


        }
    ]);
    
    function createBlankNote() {
        return {
            note: "",
            color: "yellow"
        };
            
    }


})(window.angular);