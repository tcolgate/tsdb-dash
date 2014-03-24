describe("View Hosts", function() {
  beforeEach(function() {
    jasmine.Ajax.install();
  });
  afterEach(function() {
    jasmine.Ajax.uninstall();
  });
  it("Should run", function() {
    var doneFn = jasmine.createSpy("success");
    jasmine.Ajax.stubRequest('/api/tree').andReturn({
              "responseText": 'immediate response2'
    });

    view_host_main();

    expect(doneFn).toHaveBeenCalledWith('immediate response')

  });
});
