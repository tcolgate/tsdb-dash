describe('<dash-app>', function(){

  var container;

  beforeEach(function(){
    container = document.createElement("div");
    container.innerHTML = __html__['spec/dash-app-fixture.html'];
    document.body.appendChild(container);
    waits(0); // One event loop for elements to register in Polymer
  });
  afterEach(function(){
    document.body.removeChild(container);
  });
  // Tests here...
});
