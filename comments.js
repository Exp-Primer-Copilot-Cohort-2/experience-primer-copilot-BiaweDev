// Create web server
// Run it with node comments.js
// Load it in your browser: http://localhost:3000

var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

var comments = [];

function renderForm(req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write('<html><head><title>Comments</title></head>');
  res.write('<body><h1>Comments</h1><ul>');
  comments.forEach(function(comment) {
    res.write('<li>' + comment + '</li>');
  });
  res.write('</ul>');
  res.write('<form method="post" action="/comment">');
  res.write('<input type="text" name="comment" />');
  res.write('<input type="submit" value="Submit" />');
  res.write('</form></body></html>');
  res.end();
}

function render404(req, res) {
  res.writeHead(404, {'Content-Type': 'text/plain'});
  res.write('404 Not Found\n');
  res.end();
}

function render500(req, res) {
  res.writeHead(500, {'Content-Type': 'text/plain'});
  res.write('500 Internal Server Error\n');
  res.end();
}

var server = http.createServer(function(req, res) {
  if (req.method === 'GET') {
    if (req.url === '/') {
      renderForm(req, res);
    } else {
      render404(req, res);
    }
  } else if (req.method === 'POST') {
    if (req.url === '/comment') {
      var body = '';
      req.on('data', function(data) {
        body += data;
      });
      req.on('end', function() {
        var params = qs.parse(body);
        comments.push(params.comment);
        renderForm(req, res);
      });
    } else {
      render404(req, res);
    }
  } else {
    render404(req, res);
  }
});

server.listen(3000, 'localhost');
console.log('Comments running at http://localhost:3000/');