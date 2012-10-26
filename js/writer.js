var ckEditorToolbarConfig =
    [
        { name: 'basicstyles', items : ['Format', 'Bold','Italic','Underline','Strike','Subscript','Superscript','-','RemoveFormat' ] },
        { name: 'paragraph', items : [ 'NumberedList','BulletedList','-','Outdent','Indent','-','Blockquote',
            '-','JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock'] },
        { name: 'clipboard', items : [ 'Cut','Copy','Paste','PasteText','PasteFromWord','-','Undo','Redo' ] },
        { name: 'editing', items : [ 'Find','Replace','-','SelectAll'] },
        { name: 'links', items : [ 'Link','Unlink'] },
        { name: 'insert', items : [ 'Image','Table','HorizontalRule','Smiley','SpecialChar','PageBreak'] },
        { name: 'fonts', items : [ 'Styles','Font','FontSize' ] },
        { name: 'colors', items : [ 'TextColor','BGColor' ] },
        { name: 'tools', items : [ 'Maximize', 'ShowBlocks','Preview','Print'] }
    ];


$(function () {
    var ckeditor = CKEDITOR.replace('documentContent', {
        toolbar:'my',
        skin : 'ozone',
        height: '30em',
        toolbar_my: ckEditorToolbarConfig
    });
    var currentDoc;

    function onHistoryChange(newHash, oldHash) {
        currentDoc = rs.getDocument(newHash);
        renderDocument(currentDoc);
    }

    function renderDocument(doc) {
        ckeditor.setData(doc.content);
        $('#documentTitle').val(doc.title);
    }

    $('#saveButton').click(function () {
        currentDoc.content = ckeditor.getData();
        rs.save(currentDoc);
    });

    rs.init(function (state) {
    });
    rs.onChange(function (oldValue, newValue) {
        renderDocument(newValue);
    });

    hasher.changed.add(onHistoryChange);
    hasher.initialized.add(onHistoryChange);
    hasher.init();


});


