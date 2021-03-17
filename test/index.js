const assert = require("assert");
const t = require("../dist/index");

describe("format", function () {
    it("format string", function () {
        let r = t.formatString("hello {0}", "world");
        assert.strictEqual(r, "hello world")
    })
})