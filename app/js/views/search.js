$(document).ready(function() {

  var remote = require('remote');
  var BrowserWindow = remote.require('browser-window');

});

function startSearch () {
  localStorage.setItem('searchSuccess', false);
  var searchInput = document.getElementById("search-box").value;
  localStorage.setItem('searchQuery', searchInput);
  if (searchInput !== "") {
    loading(true, 'Wir durchsuchen unser Help Center nach Lösungen.');
    hideEverything(true);
    document.getElementById("search-box").value = "";
    searchHelpCenter(searchInput);
  } else {
    $('#search-box').addClass("shake");
    $('#search-box').on("webkitAnimationEnd", function() {$(this).removeClass("shake")});
  }
}

//Initiates the API Call
function searchHelpCenter (searchString) {
  var api = ".zendesk.com/api/v2/help_center/articles/search.json?query=" + searchString
  zendeskAPICall(api, displayHelpCenterCards)
}

//Executes once the API Query has finished and builds the search results view
function displayHelpCenterCards(response) {
  var articles = response.results;
  localStorage.setItem('searchResults', JSON.stringify(articles));
  articleCount = articles.length;
  if (articleCount > 0) {
    if(articleCount > 5) {
      articleCount = 5;
    }
    var searchResultsCard = '<p id="search-results-description">Wir haben einige Lösungsvorschläge gefunden:</p>';

    for(i = 0; i < articleCount; i += 1) {
      var resultNumber = i + 1;

      searchResultsCard += [
        '<a href="#" onclick="displayArticle(' + i + '); return false;" class="search-results-card">',
          '<p class="search-results-number">' + resultNumber + '</p>',
          '<p class="search-results-title">' + articles[i].name + '</p>',
        '</a>'
        ].join('');
    }
    localStorage.setItem('searchSuccess', true);
    $('div.search-results-insert').html(searchResultsCard);
  } else {
    startTicket();
    localStorage.setItem('searchSuccess', false);
    return;
  }
  loading(false, '')
  $('.search-completed, #header-main').fadeIn();
}

//Displays the Help Center articles
function displayArticle(id) {
  $('.search-results-insert').hide();
  var articlesArray = JSON.parse(localStorage.getItem('searchResults'));
  var articlesHTML = '';

  articlesHTML += [
    '<h2>' + articlesArray[id].name + '</h2>',
    '<a href="#" onclick="hideArticle()"><img src="img/x-blue.svg"></a>',
    '<p>' + articlesArray[id].body + '</p>'
  ].join('');

  $('.article-insert').toggleClass('article-insert-style');
  $('.article-insert').html(articlesHTML);
}

function hideArticle() {
  $('.article-insert').html('');
  $('.article-insert').toggleClass('article-insert-style');
  $('.search-results-insert').show();
}

function leaveSearchResults() {
  $('.article-insert').html('');
  $('.article-insert').removeClass('article-insert-style');
  $('.search-results-insert').show();
  initiateViews();
}
