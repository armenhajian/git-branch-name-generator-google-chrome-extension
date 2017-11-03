document.addEventListener("DOMContentLoaded", function () {
  var checkPageButton = document.getElementById('branch-name');

  chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {sendData: true, url: tabs[0].url}, function (res) {
      function githubIssueTitleToBranchName() {
        //@todo: improve Regex logic and combine
        var title = res.issue.title.trim()
          .replace(/-/g, ' ')
          .replace(/_/g, ' ')
          .replace(/\[/g, '')
          .replace(/]/g, '')
          .replace(/,/g, '')
          .replace(/  +/g, ' ')
          // this is the last and general replacing for title
          .replace(new RegExp(' ', 'g'), '-');
        var number = res.issue.number.replace('#', '');
        var type = 'feature';
        res.issue.types.forEach(function (t) {
          if(t.replace('Type: ','').toLowerCase().indexOf('bug') >= 0) {
            type = 'bugfix'
          }
        });

        return (type+'/'+number+'-'+title).toLowerCase();
      }

      checkPageButton.innerHTML = githubIssueTitleToBranchName();

      checkPageButton.addEventListener('click', function () {
        if ( document.selection ) {
          document.selection.empty();
        } else if ( window.getSelection ) {
          window.getSelection().removeAllRanges();
        }

        var text = document.querySelector('#branch-name');
        var range = document.createRange();
        range.selectNode(text);
        window.getSelection().addRange(range);
        document.execCommand('copy');

        if ( document.selection ) {
          document.selection.empty();
        } else if ( window.getSelection ) {
          window.getSelection().removeAllRanges();
        }
      }, false);
    });
  });
});
