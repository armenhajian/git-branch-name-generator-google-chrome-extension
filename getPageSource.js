chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.sendData) {
      sendResponse({
        issue: getIssue(getService(request.url), document)
      })
    }

    function getIssue(service, document) {
      var issue = {};
      switch (service) {
        case 'github':
          issue = getGithub(document);
          break;
        case 'atlassian':
          issue = getAtlassian(document);
          break;
      }

      return issue;
    }

    function getGithub(document) {
      return {
        title: document.getElementsByClassName('js-issue-title')[0].innerHTML,
        number: document.getElementsByClassName('gh-header-number')[0].innerHTML,
        types: Object.keys(document.getElementsByClassName('label')).map(function (key) {
          return document.getElementsByClassName('label')[key].innerHTML;
        })
      }
    }

    function getAtlassian(document) {
      return {
        title: document.getElementById('summary-val').innerHTML,
        number: document.getElementsByClassName('issue-link')[0].innerHTML,
        types: []//@todo: implement right logic for this
      }
    }

    function getService(url) {
      var service = '';

      if (url.indexOf('github') > 0) {
        service = 'github';
      } else if (url.indexOf('atlassian') > 0) {
        service = 'atlassian'
      }

      return service;
    }
  }
);