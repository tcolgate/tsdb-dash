describe("gprintf", function() {
    it("should render a plain string", function() {
        expect(gprintf).toBeDefined();
        expect(gprintf("plain",10.0,".",1000000)).toEqual("plain");
    });
    it("sci should render milli", function() {
        expect(gprintf).toBeDefined();
        expect(gprintf("%.2s%cB",10.0,".",0.001)).toEqual("1.00mB");
    });
    it("sci should render unit", function() {
        expect(gprintf).toBeDefined();
        expect(gprintf("%.2s%cB",10.0,".",1)).toEqual("1.00 B");
    });
    it("sci should render 100s", function() {
        expect(gprintf).toBeDefined();
        expect(gprintf("%.2s%cB",100.0,".",10000)).toEqual("100.00");
    });
    it("sci should render kilo", function() {
        expect(gprintf).toBeDefined();
        expect(gprintf("%.2s%cB",10.0,".",10000)).toEqual("10.00kB");
    });
    it("sci should render mega", function() {
        expect(gprintf).toBeDefined();
        expect(gprintf("%.2s%cB",10.0,".",10000000)).toEqual("10.00MB");
    });
});
