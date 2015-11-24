var assert = require('assert');

var assetHandler = require('../src/asset-handler.js');

describe('assethandler', function() {
    it('should exist', function() {
        assert.equal(typeof assetHandler, 'object');
        assert.equal(typeof assetHandler.objects_and_embeds, 'object');
    });
});
