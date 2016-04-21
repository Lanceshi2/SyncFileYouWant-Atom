var CompositeDisposable, SyncFileYouWant, SyncFileYouWantView, jQuery;

SyncFileYouWantView = require('./sync-file-you-want-view');

CompositeDisposable = require('atom').CompositeDisposable;

var fs = require('fs');

module.exports = SyncFileYouWant = {
  config: {
    sourceLoc1: {
      type: 'string',
      default: 'c:\\test'
    },
    destLoc1: {
      type: 'string',
      default: 'c:\\dest'
    },
    sourceLoc2: {
      type: 'string',
      default: 'c:\\test'
    },
    destLoc2: {
      type: 'string',
      default: 'c:\\dest'
    },
    sourceLoc3: {
      type: 'string',
      default: 'c:\\test'
    },
    destLoc3: {
      type: 'string',
      default: 'c:\\dest'
    },
    sourceLoc4: {
      type: 'string',
      default: 'c:\\test'
    },
    destLoc4: {
      type: 'string',
      default: 'c:\\dest'
    },
    sourceLoc5: {
      type: 'string',
      default: 'c:\\test'
    },
    destLoc5: {
      type: 'string',
      default: 'c:\\dest'
    },
  },
  syncFileYouWantView: null,
  modalPanel: null,
  subscriptions: null,
  activate: function(state) {
    this.syncFileYouWantView = new SyncFileYouWantView(state.syncFileYouWantViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.syncFileYouWantView.getElement(),
      visible: false
    });
    this.subscriptions = new CompositeDisposable();
    return this.subscriptions.add(atom.commands.add('atom-workspace', {
      'sync-file-you-want:toggle': (function(_this) {
        return function() {
          return _this.toggle();
        };
      })(this)
    }));
  },
  deactivate: function() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    return this.syncFileYouWantView.destroy();
  },
  serialize: function() {
    return {
      syncFileYouWantViewState: this.syncFileYouWantView.serialize()
    };
  },
  toggle: function() {
    console.log('SyncFileYouWant was toggled!');
    if(this.modalPanel.isVisible()) {
      this.modalPanel.hide();
    }
    else {
      var editor = atom.workspace.getActivePaneItem();
      if(editor === null || editor === undefined) {
        this.syncFileYouWantView.setContent("Please run the sync file command in a file view");
        this.displayMessage();
        return;
      }
      var buffer = editor.buffer;
      if(buffer === null || buffer === undefined) {
        this.syncFileYouWantView.setContent("Please run the sync file command in a file view");
        this.displayMessage();
        return;
      }
      var file = buffer.file;
      var fileName = file.getRealPathSync();

      var mappings = [];
      for(var i = 1; i < 6; i++) {
        var mapping = {};
        mapping.sourceLoc = atom.config.get('sync-file-you-want.sourceLoc' + i);
        mapping.destLoc = atom.config.get('sync-file-you-want.destLoc' + i);
        mappings.push(mapping);
      }

      var found = false;
      var destFileName = '';

      for(i = 0; i < mappings.length; i++) {
        var curMapping = mappings[i];
        var sourceLoc = curMapping.sourceLoc;
        var destLoc = curMapping.destLoc;
        if(sourceLoc === null || sourceLoc === undefined || sourceLoc === '' ||
          destLoc === null || destLoc === undefined || destLoc === '') {
          continue;
        }
        if(fileName.indexOf(sourceLoc) >= 0) {
          destFileName = fileName.replace(sourceLoc, destLoc);
          found = true;
          break;
        }
      }

      if(!found) {
        this.syncFileYouWantView.setContent("Your current file location is not in one of your source locations, or the relevent dest Location is empty. Please set the settings file properly and retry.");
        this.displayMessage();
        return;
      }
      fs.createReadStream(fileName).pipe(fs.createWriteStream(destFileName));
      this.syncFileYouWantView.setContent("Your file is successfully copied to destination location!");
      this.displayMessage();
    }
  },
  displayMessage: function() {
    var modal = this.modalPanel;
    modal.show();

    setTimeout(function() {
      modal.hide();
    }, 3000);
  }
};
