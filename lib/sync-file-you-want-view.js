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

  SyncFileYouWantView.prototype.setContent = function(content) {
      this.element.children[0].textContent = content;
  };

  return SyncFileYouWantView;

})();
