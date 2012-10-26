function log(message) {
    console.log(message);
}

function isNotNull(o) {
    return !!o;
}

var rs = {
    documentDao:null,

    init:function (onStateCallback) {
        remoteStorage.util.silenceAllLoggers();
        remoteStorage.claimAccess('documents', 'rw');
        remoteStorage.displayWidget('remotestorage-connect');
        remoteStorage.onWidget('state', onStateCallback);
        this.documentDao = remoteStorage.documents.getPrivateList('remote-office');
    },

    getDocument:function (id) {
        return {
            id:id,
            title:this.documentDao.getTitle(id),
            content:this.documentDao.getContent(id),
            editUrl:'writer.html#' + id
        }
    },

    loadAll:function () {
        var self = this;
        return this.documentDao.getIds().map(function (id) {
            return self.getDocument(id);
        });
    },

    onChange:function (callback) {
        var documentDao = this.documentDao;
        this.documentDao.on('change', function (event) {
            log("Event:");
            log(event);
            var id = event.relativePath.split('/')[1];
            if (event.newValue) {
                event.newValue.id = id;
                event.newValue.title = documentDao.getTitle(id);
                event.newValue.editUrl = 'writer.html#' + id;
            }
            if (event.oldValue) {
                event.oldValue.id = id;
            }
            callback(event.oldValue, event.newValue);
        });
    },

    add:function (content) {
        this.documentDao.add(content);
    },

    save:function (document) {
        this.documentDao.setContent(document.id, document.content);
    },

    remove:function (id) {
        this.documentDao.remove(id);
    },

    getState:function () {
        return remoteStorage.getWidgetState();
    }

}


function isConnected(state) {
    return  (state == 'connected') || (state == 'busy');
}

function isBlank(s) {
    return !s || s.isBlank();
}