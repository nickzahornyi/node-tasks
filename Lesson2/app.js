var express = require('express');
var fs = require('fs');
var got = require('got');
var tress = require('tress');
var cheerio = require('cheerio');
var resolve = require('url').resolve;
var app = express();
var serveStatic = require('serve-static');

var results = [];
var links = {};

app.use(serveStatic('front'));
app.get('/scrape', function (req, res) {

  var url = 'http://' + req.query.url;
  var selector = req.query.selector;
  var depth = req.query.depth;

  console.log ('URL:', url);
  console.log('selector:', selector);
  console.log('depth:', depth);

  var counter = url.split('/').length;

  var q = tress(function processNode(url, callback) {

      got(url).then(function pageParse(data) {
          var $ = cheerio.load(data.body);

          $(selector).each(function contentSave(index, sel) {
              var text = $(sel).text();
              results.push({href: url, Content: text});
              console.log({href: url, Content: text});
          });

          $('a').each(function processLink() {
              var link = $(this).attr('href');

              var resolvedLink = resolve(url, link);

              var currentDepth = resolvedLink.split('').length;

                  if(currentDepth - counter <= depth) {
                      console.log(fullLink);
                      q.push(fullLink);
                      links[link] = true;
                  }
          });

      });
      callback();
  },10);

  var resultsStr = JSON.stringify(results, null, 4);

  q.drain = function saveToFile(){
      fs.writeFileSync('output.json', resultsStr);
  };
  links[url] = true;
  q.push(url);

  res.send('<pre>' + resultsStr + '</pre>');
});

app.listen(3000, function () {
  console.log('Magic started on port 3000!');
});
