var SyncFileYouWantView;

module.exports = SyncFileYouWantView = (function() {
  function SyncFileYouWantView(serializedState) {
    var message;
    this.element = document.createElement('div');
    this.element.classList.add('sync-file-you-want');
    message = document.createElement('div');
    message.textContent = "The SyncFileYouWant package is Alive! It's ALIVE! Hello ABC";
    message.classList.add('message');
    this.element.appendChild(message);
  }

  SyncFileYouWantView.prototype.serialize = function() {};

  SyncFileYouWantView.prototype.destroy = function() {
    return this.element.remove();
  };

  SyncFileYouWantView.prototype.getElement = function() {
    return this.element;
  };

  SyncFileYouWantView.prototype.setContent = function(content, type) {
    var message = this.element.children[0];
    message.textContent = content;

    if(type === 'Error') {
      message.classList.remove('infoDiv');
      message.classList.add('errorDiv');
    }

    if(type === 'Info') {
      message.classList.remove('errorDiv');
      message.classList.add('infoDiv');
    }
  };

  return SyncFileYouWantView;

})();
