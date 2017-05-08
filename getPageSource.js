chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.sendData)
      sendResponse({
        issue: {
          title: document.getElementsByClassName('js-issue-title')[0].innerHTML,
          number: document.getElementsByClassName('gh-header-number')[0].innerHTML,
          types: Object.keys(document.getElementsByClassName('label')).map(function (key) {
            return document.getElementsByClassName('label')[key].innerHTML;
          })
        }
      });
  });