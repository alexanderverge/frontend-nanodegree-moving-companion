
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // Google Street View
    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var address = streetStr + ', ' + cityStr;
    $greeting.text('So, you want to live at ' + address + '?');
    var streetviewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address;
    $body.append('<img class="bgimg" src="' + streetviewUrl + '">');

    // NYTimes AJAX request
    var nytimesUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + cityStr + '&sort=newest&api-key=cb7b11a0c162aa1eb6bb4eb9c5fa140f:9:72128533';
    $.getJSON(nytimesUrl, function(data){
        $nytHeaderElem.text('NYTimes Articles About ' + cityStr);
        articles = data.response.docs;
        for (var i = 0; i < articles.length; i++) {
            var article = articles[i];
            $nytElem.append('<li class="article">' + 
                                '<a href="' + article.web_url + '">' + article.headline.main + '</a>' + 
                                '<p>' + article.snippet + '</p>' + 
                            '</li>');
        };
    }).error(function(e){
        $nytHeaderElem.text('NYTimes Articles Could Not Be Loaded');
    })

    // Wikipedia AJAX Request
    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text('Wikipedia Resources Could Not Be Loaded');
    }, 4000); // 4 second timeout error

    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + cityStr + '&format=json&callback=wikiCallBack';
    $.ajax({
        url: wikiUrl,
        dataType: 'jsonp',
        success: function(response){
            var articleList = response[1];

            for (var i = 0; i < articleList.length; i++) {
                articleStr = articleList[i];
                var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                $wikiElem.append('<li> <a href="' + url + '">' + articleStr + '</a></li>');
            };

            clearTimeout(wikiRequestTimeout);
        }

    })

    return false;
};

$('#form-container').submit(loadData);

// loadData();
