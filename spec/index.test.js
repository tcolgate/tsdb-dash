describe("Index", function() {
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

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(arguments) {
      if (this.readyState == this.DONE) {
        doneFn(this.responseText);
      }
    };

    xhr.open("GET", "/api/tree");
    xhr.send();

    expect(doneFn).toHaveBeenCalledWith('immediate response')

//    view_host_main();
  });
});
