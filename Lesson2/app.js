var express = require('express');
var fs = require('fs');
var got = require('got');
var tress = require('tress');
var cheerio = require('cheerio');
var resolve = require('url').resolve;
var app = express();

var results = [];
var links = {};

app.get('/', function (req, res) {

  var url = "http://" + req.query.url;
  var selector = req.query.selector;
  var depth = req.query.depth;

  console.log ("URL: " + url);
  console.log("selector: " + selector);
  console.log("depth: " + depth);

  var counter = 0;

  for(i = 0; i < url.length; i++){
      if(url[i] === '/')counter++;
  }

  var q = tress(function(url, callback) {

      got(url).then(function (data) {
          var $ = cheerio.load(data.body);
          $(selector).each(function (index, selector) {
              results.push({href: url, Content: $(selector).text()});
              console.log(results);
          });
          $('a').each(function () {
              var link = $(this).attr('href');
              var count = 0;
              var fullLink = "http://" + link;
              if(link.indexOf(url) != -1 && links[link] !== true){
                  for(i = 0; i < fullLink.length; i++){
                      if(fullLink[i] == '/')count++;
                  }
                  if(count - counter <= depth) {
                      console.log(fullLink);
                      q.push(fullLink);
                      links[link] = true;
                  }
              }
              if (link.slice(0,1) == '/'  && links[link] !== true ){
                  var resolvedLink = resolve(url, link);
                  for(i = 0; i < resolvedLink.length; i++){
                      if(resolvedLink[i] == '/')count++;
                  }
                  if(count - counter <= depth) {
                      console.log(resolvedLink);
                      q.push(resolvedLink);
                      links[link] = true;
                  }
              }

          });

      });
      callback();
  },10);

  q.drain = function(){
      fs.writeFileSync('output.json', JSON.stringify(results, null, 2));
  };
  q.push(url);

  res.send('Check your console and output.json');
});

app.listen(3000, function () {
  console.log('Magic started on port 3000!');
});
