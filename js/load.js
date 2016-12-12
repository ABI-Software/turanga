// $("#left_page_1").load("pages/left_page_1.html");
// $("#left_page_2").load("pages/left_page_2.html");
// $("#left_page_3").load("pages/left_page_3.html");
// $("#left_page_6").load("pages/left_page_6.html");
// $("#left_page_7").load("pages/left_page_7.html");
// $("#left_page_8").load("pages/left_page_8.html");
// $("#right_page_1").load("pages/right_page_1.html");
// $("#right_page_2").load("pages/right_page_2.html");
// $("#right_page_3").load("pages/right_page_3.html");
// $("#right_page_6").load("pages/right_page_6.html");
// $("#right_page_8").load("pages/right_page_8.html");
require(["dojo/request/xhr"], function(xhr){
  xhr("pages/left_page_1.html", {
    handleAs: "html"
  }).then(function(newContent){
	  document.getElementById("left_page_1").innerHTML = newContent;
    // Do something with the handled data
  }, function(err){
    // Handle the error condition
  }, function(evt){
    // Handle a progress event from the request if the
    // browser supports XHR2
  });
});

require(["dojo/request/xhr"], function(xhr){
  xhr("pages/left_page_2.html", {
    handleAs: "html"
  }).then(function(newContent){
	  document.getElementById("left_page_2").innerHTML = newContent;
    // Do something with the handled data
  }, function(err){
    // Handle the error condition
  }, function(evt){
    // Handle a progress event from the request if the
    // browser supports XHR2
  });
});

require(["dojo/request/xhr"], function(xhr){
  xhr("pages/left_page_3.html", {
    handleAs: "html"
  }).then(function(newContent){
	  document.getElementById("left_page_3").innerHTML = newContent;
    // Do something with the handled data
  }, function(err){
    // Handle the error condition
  }, function(evt){
    // Handle a progress event from the request if the
    // browser supports XHR2
  });
});

require(["dojo/request/xhr"], function(xhr){
  xhr("pages/left_page_6.html", {
    handleAs: "html"
  }).then(function(newContent){
	  document.getElementById("left_page_6").innerHTML = newContent;
    // Do something with the handled data
  }, function(err){
    // Handle the error condition
  }, function(evt){
    // Handle a progress event from the request if the
    // browser supports XHR2
  });
});

require(["dojo/request/xhr"], function(xhr){
  xhr("pages/left_page_7.html", {
    handleAs: "html"
  }).then(function(newContent){
	  document.getElementById("left_page_7").innerHTML = newContent;
    // Do something with the handled data
  }, function(err){
    // Handle the error condition
  }, function(evt){
    // Handle a progress event from the request if the
    // browser supports XHR2
  });
});

require(["dojo/request/xhr"], function(xhr){
  xhr("pages/left_page_8.html", {
    handleAs: "html"
  }).then(function(newContent){
	  document.getElementById("left_page_8").innerHTML = newContent;
    // Do something with the handled data
  }, function(err){
    // Handle the error condition
  }, function(evt){
    // Handle a progress event from the request if the
    // browser supports XHR2
  });
});

require(["dojo/request/xhr"], function(xhr){
  xhr("pages/right_page_1.html", {
    handleAs: "html"
  }).then(function(newContent){
	  document.getElementById("right_page_1").innerHTML = newContent;
    // Do something with the handled data
  }, function(err){
    // Handle the error condition
  }, function(evt){
    // Handle a progress event from the request if the
    // browser supports XHR2
  });
});

require(["dojo/request/xhr"], function(xhr){
  xhr("pages/right_page_2.html", {
    handleAs: "html"
  }).then(function(newContent){
	  document.getElementById("right_page_2").innerHTML = newContent;
    // Do something with the handled data
  }, function(err){
    // Handle the error condition
  }, function(evt){
    // Handle a progress event from the request if the
    // browser supports XHR2
  });
});

require(["dojo/request/xhr"], function(xhr){
  xhr("pages/right_page_3.html", {
    handleAs: "html"
  }).then(function(newContent){
	  document.getElementById("right_page_3").innerHTML = newContent;
    // Do something with the handled data
  }, function(err){
    // Handle the error condition
  }, function(evt){
    // Handle a progress event from the request if the
    // browser supports XHR2
  });
});

require(["dojo/request/xhr"], function(xhr){
  xhr("pages/right_page_6.html", {
    handleAs: "html"
  }).then(function(newContent){
	  document.getElementById("right_page_6").innerHTML = newContent;
    // Do something with the handled data
  }, function(err){
    // Handle the error condition
  }, function(evt){
    // Handle a progress event from the request if the
    // browser supports XHR2
  });
});

require(["dojo/request/xhr"], function(xhr){
  xhr("pages/right_page_8.html", {
    handleAs: "html"
  }).then(function(newContent){
	  document.getElementById("right_page_8").innerHTML = newContent;
    // Do something with the handled data
  }, function(err){
    // Handle the error condition
  }, function(evt){
    // Handle a progress event from the request if the
    // browser supports XHR2
  });
});


