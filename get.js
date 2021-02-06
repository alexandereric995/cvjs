var Browser = require('browser');

module.exports.get = function (assert) {
    var browser = new Browser;
    var executed = 0;
    browser
        .get('https://192.168.0.5')
        .tap(function (storage, response, data) {
            executed++;
            assert.deepEqual(storage, {});
            assert.ok(/cookies/.test(response.headers['set-cookie']));
        })
        .end();

    setTimeout(function () {
        assert.equal(executed, 1)
    }, 2000);
}

module.exports['get with opts'] = function (assert) {
    var browser = new Browser;
    var executed = 0;
    browser
        .get({ url : 'https://192.168.0.5' })
        .tap(function (storage, response, data) {
            executed++;
            assert.deepEqual(storage, {});
            assert.ok(/cookies/.test(response.headers['set-cookie']));
        })
        .end();

    setTimeout(function () {
        assert.equal(executed, 1)
    }, 2000);
}

