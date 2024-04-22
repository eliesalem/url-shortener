/*
Must take long url and send back number XXX
must link back to long url if path/api/shorturl/XXX is typed
*/

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');
const app = express();
var URL = require('url').URL;
const arr = [];


// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

// Middleware to parse JSON bodies
app.use(express.json());

// gives content type to url post requests
app.use(express.urlencoded({ extended: true }));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.get('/api/shorturl/:id?', function(req, res){

  console.log("Hello");
  console.log("id: ", req.params.id);

  if(arr[req.params.id]){

    console.log(arr[req.params.id]);
    res.redirect(arr[req.params.id]);

  } else {

    res.json('Shorturl does not have url')

  }

});

app.post('/api/shorturl', function(req, res){

  console.log("Req.body: ", req.body);

  //create new url object from req.body
  let url = new URL(req.body.url);
  console.log("Url: ", url);

  //convert url to hostname string for dns lookup
  let hostname = url.hostname;
  console.log("Hostname: ", hostname);

  //confirm url is valid
  dns.lookup(hostname, (err, address, family) => {

    if(err){

      console.error("DNS lookup failed: ", err);
      res.json({ error: 'invalid url'});

    } else {

      console.log("DNS lookup successful");
      let shortUrl = -1;
      arr.push(url);

      if(arr[arr.length - 1] == url){

        console.log("Url added successfully.")
        //assign shortUrl to current value in list
        shortUrl = arr.length - 1;

      } else {

        console.err("Url not added successfully.")
      }

      res.json({url: url, shortUrl: shortUrl});
      console.log(arr[shortUrl]);     
    }

  });

});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
