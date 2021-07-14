const assert = require("assert");
const t = require("../dist/index");
const pathModule = require("../out/path");

describe("format", function () {
    it("format string", function () {
        let r = t.formatString("hello {0}", "world");
        assert.strictEqual(r, "hello world")
    })
})

describe("pathContact2", function () {
    it("path contact 1", function () {
        let path = pathModule.partConcat2("a", "b");
        assert.strictEqual(path, "a/b");
    })

    it("path contact 2", function () {
        let path = pathModule.partConcat2("a", "./b");
        assert.strictEqual(path, "a/b");
    })

    it("path contact 3", function () {
        let path = pathModule.partConcat2("a", "../b");
        assert.strictEqual(path, "b");
    })

    it("path contact 4", function () {
        let path = pathModule.partConcat2("a/b/c/d", "../k");
        assert.strictEqual(path, "a/b/c/k");

        path = pathModule.partConcat2("a/b/c/d", "../../k");
        assert.strictEqual(path, "a/b/k");
    })
})

describe("pathContact", function () {
    it("test1", function () {
        let path = pathModule.pathConcat("a", "b", "c");
        assert.strictEqual(path, "a/b/c");
    })

    it("test2", function () {
        let path = pathModule.pathConcat("a", "b", "../c");
        assert.strictEqual(path, "a/c");
    })

    it("test3", function () {
        let path = pathModule.pathConcat("/", "b");
        assert.strictEqual(path, "/b");
    })

    it("test4", function () {
        let path = pathModule.pathConcat("/", "../");
        assert.strictEqual(path, "/");
    })

    
    it("test5", function () {
        let path = pathModule.pathConcat("/a/b/c", "../");
        assert.strictEqual(path, "/a/b");
    })

    it("test6", function () {
        let path = pathModule.pathConcat("/a/b/c", "../../../../../");
        assert.strictEqual(path, "/");
    })
})

