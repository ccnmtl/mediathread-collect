var assert = require('assert');
var jsdom = require('jsdom');

var hostHandler = require('../src/host-handler.js');

var jqueryUrl = 'https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js';

describe('hosthandler', function() {
    it('should exist', function() {
        assert.equal(typeof hostHandler, 'object');
        assert.equal(typeof hostHandler['flickr.com'], 'object');
    });
});

describe('library.artstor.org', function() {
    it('has the expected JavaScript', function(done) {
        jsdom.env({
            url: 'http://library.artstor.org/library/',
            resourceLoader: function (resource, callback) {
                // Only load relevant scripts, otherwise jsdom times out.
                if (resource.url.hostname === 'library.artstor.org') {
                    resource.defaultFetch(callback);
                } else {
                    callback();
                }
            },
            features : {
                FetchExternalResources : ['script'],
                ProcessExternalResources : ['script']
            },
            'done': function (err, window) {
                assert.ok(typeof window.dijit.registry.length === 'number');
                assert.ok(typeof window.dijit.registry._hash === 'object');
                done();
            }
        });
    });
});

describe('blakearchive.org', function() {
    it('has the expected DOM', function(done) {
        jsdom.env({
            url: 'http://www.blakearchive.org/exist/blake/archive/object.xq?objectid=milton.a.illbk.33',
            scripts: [jqueryUrl],
            done: function (err, window) {
                var $ = window.$;
                assert.ok($('img').length > 0);
                assert.ok($('form[name="form"] option').length > 0);
                done();
            }
        });
    });

    it('has the expected DOM for the enlarged image page', function(done) {
        jsdom.env({
            url: 'http://www.blakearchive.org/exist/blake/archive/enlargement.xq?objectdbi=milton.a.p33',
            scripts: [jqueryUrl],
            done: function (err, window) {
                var $ = window.$;
                assert.ok($('img').length > 0);
                assert.ok($('#enlargedImage').length === 1);
                done();
            }
        });
    });
});

describe('classpop.ccnmtl.columbia.edu', function() {
    it('has the expected DOM', function(done) {
        jsdom.env({
            url: 'http://classpop.ccnmtl.columbia.edu/content/perspectives-freedom-speech',
            scripts: [jqueryUrl],
            done: function (err, window) {
                var $ = window.$;
                assert.ok($('#currently_playing').length === 1);
                done();
            }
        });
    });
});

describe('flickr.com', function() {
    it('has the expected DOM', function(done) {
        jsdom.env({
            url: 'https://www.flickr.com/photos/dropacat/15183956471/',
            scripts: [jqueryUrl],
            done: function (err, window) {
                var $ = window.$;
                assert.ok($('img').length > 0);
                done();
            }
        });
    });
});

describe('youtube.com', function() {
    it('has the expected DOM', function(done) {
        jsdom.env({
            url: 'https://www.youtube.com/watch?v=ZQhbB6-cT3Y',
            scripts: [jqueryUrl],
            done: function (err, window) {
                var $ = window.$;

                // The host handler looks for #movie_player, but this won't
                // get rendered in jsdom. We can look for the on-page
                // javascript that instantiates it with this ID, though.
                assert.ok($('script').text().match(/movie_player/));
                done();
            }
        });
    });
});
