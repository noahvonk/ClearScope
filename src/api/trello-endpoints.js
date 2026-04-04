
const fetch = require('node-fetch');

async function CreateTrelloWebhook(callbackURL, APIKey, APIToken) {

    // make sure callbackURL is properly formatted for the API request
    if(!callbackURL.startsWith('{') || !callbackURL.endsWith('}')){
        
        // remove any existing curly braces to prevent double wrapping, then wrap the entire URL in curly braces
        callbackURL.replace('{', '');
        callbackURL.replace('}', '');

        // wrap sanitized URL in curly braces for the API request
        callbackURL = `{${callbackURL}}`;
    }
    await fetch(`https://api.trello.com/1/webhooks/?callbackURL=${callbackURL}&idModel=5abbe4b7ddc1b351ef961414&key=${APIKey}&token=${APIToken}`, {
    method: 'POST',
    headers: {
        'Accept': 'application/json'
    }
    })
    .then(response => {
        console.log(
        `Response: ${response.status} ${response.statusText}`
        );
        return response.text();
    })
    .then(text => console.log(text))
    .catch(err => console.error(err));
}

async function GetMemberInfo(memberId) {

    await fetch('https://api.trello.com/1/members/{id}?key=APIKey&token=APIToken', {
    method: 'GET',
    headers: {
        'Accept': 'application/json'
    }
    })
  .then(response => {
    console.log(
      `Response: ${response.status} ${response.statusText}`
    );
    return response.text();
  })
  .then(text => console.log(text))
  .catch(err => console.error(err));
}

function GetWorkspaceBoards(workspaceId) {
    fetch()
    return `/workspaces/${workspaceId}/boards`;
}