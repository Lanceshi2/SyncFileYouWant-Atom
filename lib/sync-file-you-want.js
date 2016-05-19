var CompositeDisposable, SyncFileYouWant, SyncFileYouWantView;

SyncFileYouWantView = require('./sync-file-you-want-view');

CompositeDisposable = require('atom').CompositeDisposable;

var fs = require('fs');
var exec = require('child_process').exec;

module.exports = SyncFileYouWant = {
  config: {
    meldLoc: {
      type: 'string',
      title: 'Meld Location',
      default: '"C:\\Program Files (x86)\\Meld\\meld\\meld"'
    },
    mapping1: {
      type: 'object',
      properties: {
        sourceLoc: {
          title: 'Source Location',
          type: 'string',
          default: 'c:\\test',
          order: 100
        },
        destLoc: {
          title: 'Destination Location',
          type: 'string',
          default: 'c:\\dest',
          order: 200
        }
      }
    },
    mapping2: {
      type: 'object',
      properties: {
        sourceLoc: {
          title: 'Source Location',
          type: 'string',
          default: 'c:\\test',
          order: 100
        },
        destLoc: {
          title: 'Destination Location',
          type: 'string',
          default: 'c:\\dest',
          order: 200
        }
      }
    },
    mapping3: {
      type: 'object',
      properties: {
        sourceLoc: {
          title: 'Source Location',
          type: 'string',
          default: 'c:\\test',
          order: 100
        },
        destLoc: {
          title: 'Destination Location',
          type: 'string',
          default: 'c:\\dest',
          order: 200
        }
      }
    },
    mapping4: {
      type: 'object',
      properties: {
        sourceLoc: {
          title: 'Source Location',
          type: 'string',
          default: 'c:\\test',
          order: 100
        },
        destLoc: {
          title: 'Destination Location',
          type: 'string',
          default: 'c:\\dest',
          order: 200
        }
      }
    },
    mapping5: {
      type: 'object',
      properties: {
        sourceLoc: {
          title: 'Source Location',
          type: 'string',
          default: 'c:\\test',
          order: 100
        },
        destLoc: {
          title: 'Destination Location',
          type: 'string',
          default: 'c:\\dest',
          order: 200
        }
      }
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
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'sync-file-you-want:sync': (function(_this) {
        return function() {
          return _this.syncFile();
        };
      })(this),
      'sync-file-you-want:meldMerge': (function(_this) {
        return function() {
          console.log('Hello');
          return _this.mergeFile();
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

  syncFile: function() {
    console.log('SyncFileYouWant was toggled!');
    if(this.modalPanel.isVisible()) {
      this.modalPanel.hide();
    }
    else {
      var fileNames = this.getFileNames();
      var fileName = fileNames.file;
      var destFileName = fileNames.destFile;
      var found = fileNames.found;

      if(!found) {
        this.syncFileYouWantView.setContent("Your current file location is not in one of your source locations, or the relevent dest Location is empty. Please set the settings file properly and retry.", "Error");
        this.displayMessage();
        return;
      }
      fs.createReadStream(fileName).pipe(fs.createWriteStream(destFileName));
      this.syncFileYouWantView.setContent("Your file is successfully copied to destination location!", "Info");
      this.displayMessage();
    }
  },

  mergeFile: function() {
    var fileNames = this.getFileNames();
    console.log('Meld called');
    var fileName = fileNames.file;
    var destFileName = fileNames.destFile;
    var found = fileNames.found;

    if(!found) {
      this.syncFileYouWantView.setContent("Your current file location is not in one of your source locations, or the relevent dest Location is empty. Please set the settings file properly and retry.", "Error");
      this.displayMessage();
      return;
    }

    var meldLoc = atom.config.get('sync-file-you-want.meldLoc');
    var cmd = meldLoc + " " + fileName + " " + destFileName;

    exec(cmd, function(error, stdout, stderr){

    });
  },

  getFileNames: function() {
    var editor = atom.workspace.getActivePaneItem();
    if(editor === null || editor === undefined) {
      this.syncFileYouWantView.setContent("Please run the sync file command in a file view", "Error");
      this.displayMessage();
      return;
    }
    var buffer = editor.buffer;
    if(buffer === null || buffer === undefined) {
      this.syncFileYouWantView.setContent("Please run the sync file command in a file view", "Error");
      this.displayMessage();
      return;
    }
    var file = buffer.file;
    if(file === null || file === undefined) {
      this.syncFileYouWantView.setContent("Please run the sync file command in a file view", "Error");
      this.displayMessage();
      return;
    }
    var fileName = file.getRealPathSync();

    var mappings = [];
    for(var i = 1; i < 6; i++) {
      var mapping = atom.config.get('sync-file-you-want.mapping' + i);
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
    var fileNames = {};
    fileNames.file = fileName;
    fileNames.destFile = destFileName;
    fileNames.found = found;

    return fileNames;
  },

  displayMessage: function() {
    var modal = this.modalPanel;
    modal.show();

    setTimeout(function() {
      modal.hide();
    }, 1000);
  }
};
