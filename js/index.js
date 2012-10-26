

function DocumentIndexController($scope) {
    function refresh() {
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    }

    $scope.isConnected = isConnected(rs.getState());

    rs.init(function (state) {
        $scope.isConnected = isConnected(state);
        if (state === 'disconnected') {
            $scope.documents = [];
        }
        refresh();
    });

    $scope.documents = rs.loadAll();

    rs.onChange(function (oldDocument, newDocument) {
        if (!newDocument) {
            //delete
            $scope.documents.remove({id:oldDocument.id});
            return;
        }
        var existingDocument = $scope.documents.find({id:newDocument.id});
        if (existingDocument) {
            Object.merge(existingDocument, newDocument);
        } else {
            $scope.documents.insert(newDocument, 0);
        }
        refresh();
    });


    $scope.noDocumentTitleWarning = false;
    $scope.addDocument = function () {
        if (isBlank($scope.documentText)) {
            $scope.noDocumentTitleWarning = true;
            return;
        }
        rs.add($scope.documentText);
        $scope.documentText = '';
    };

    $scope.edit = function (doc) {
        window.open(doc.editUrl);
    }

    $scope.$watch('documentText', function (value) {
        if (!isBlank($scope.documentText)) {
            $scope.noDocumentTitleWarning = false;
        }
    });


    $scope.removeDocument = function (document) {
        $scope.documents.remove(document);
        rs.remove(document.id);
    };

}
