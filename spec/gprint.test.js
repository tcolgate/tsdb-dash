describe("gprintf", function() {
    it("should render a plain string", function() {
        expect(gprintf).toBeDefined();
        expect(gprintf("plain",10.0,".",1000000)).toEqual("plain");
    });
});
