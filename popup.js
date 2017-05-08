document.addEventListener("DOMContentLoaded", function () {
  var checkPageButton = document.getElementById('branch-name');

  chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {sendData: true}, function (res) {
      function githubIssueTitleToBranchName() {
        var title = res.issue.title.trim().replace(new RegExp(' ', 'g'), '-').replace('[','').replace(']','').replace(',','');
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
