var container = document.getElementById( "zinc_rendered_view" );
var zincRenderer = undefined;

var surfaceStatus = {
	"scene": undefined,
	"initialised": false,
	"download": {
		"progress": 0,
		"total": 0,
	},
};
var airwaysStatus = {
	"scene": undefined,
	"initialised": false,
	"download": {
		"progress": 0,
		"total": 0,
	},
}

var renderer_Age = 0;

function updateUniformsWithDetails() {
	var age = Math.floor(userData["Current Age"] + 0.5);
	start_age = userData["Age started smoking"] * 0.01;
	if (start_age < 0.0)
		start_age = 0.0;
	cellUniforms["starting_time"].value = start_age;
	cellUniforms["severity"].value = userData["Packs Per Day"] * 1.0;
	flowUniforms["starting_time"].value = start_age;
	flowUniforms["severity"].value = userData["Packs Per Day"] * 1.0;
}

var cellUniforms = THREE.UniformsUtils.merge( [
	{
		"ambient"  : { type: "c", value: new THREE.Color( 0xffffff ) },
		"emissive" : { type: "c", value: new THREE.Color( 0x000000 ) },
		"specular" : { type: "c", value: new THREE.Color( 0x111111 ) },
		"shininess": { type: "f", value: 100 },
		"diffuse": { type: "c", value: new THREE.Color( 0xeecaa2 ) },
		"ambientLightColor": { type: "c", value: new THREE.Color( 0x444444 ) },
		"directionalLightColor": { type: "c", value: new THREE.Color( 0x888888 ) },
		"directionalLightDirection": { type: "v3", value: new THREE.Vector3()  },
		"time": { type: "f", value: 0.0 },
		"starting_time": { type: "f", value: 0.0 },
		"severity": { type: "f", value: 0.0 },
		"cellsDensity": { type: "f", value: 0.1 },
		"tarDensity":  { type: "f", value: 0.0175}
	}
] );

var flowUniforms = THREE.UniformsUtils.merge( [
{
	"ambient"  : { type: "c", value: new THREE.Color( 0xffffff ) },
	"emissive" : { type: "c", value: new THREE.Color( 0x000000 ) },
	"specular" : { type: "c", value: new THREE.Color( 0x111111 ) },
	"shininess": { type: "f", value: 100 },
	"ambientLightColor": { type: "c", value: new THREE.Color( 0x444444 ) },
	"directionalLightColor": { type: "c", value: new THREE.Color( 0x888888 ) },
	"directionalLightDirection": { type: "v3", value: new THREE.Vector3()  },
	"time": { type: "f", value: 0.0 },
	"starting_time": { type: "f", value: 0.0 },
	"severity": { type: "f", value: 1.0 }
} ] );

var userData = {
	'Current Age': 25,
	'Gender' : "Male",
	'Asthma Severity' : "None",
	'Age started smoking': 18,
	'Packs Per Day': 1.0,
	'Height (cm)' : 180,
	'3D Models' : "Lungs (Tar)",
	'Play Speed' : 500
};

function endLoading() {
	loadingPage.endLoading();
}

function beginLoading() {
	loadingPage.beginLoading();
}

function updateUniforms(zincRenderer, cellUniforms, flowUniforms) {
	return function () {
		var directionalLight = zincRenderer.getCurrentScene().directionalLight;
		cellUniforms["directionalLightDirection"].value.set(directionalLight.position.x,
			directionalLight.position.y,
			directionalLight.position.z);
		flowUniforms["directionalLightDirection"].value.set(directionalLight.position.x,
			directionalLight.position.y,
			directionalLight.position.z);
		cellUniforms["time"].value = zincRenderer.getCurrentTime()/3000.0;
		flowUniforms["time"].value = zincRenderer.getCurrentTime()/3000.0;
		var age = parseInt(cellUniforms["time"].value *100.0);
		if (age != renderer_Age) {
			renderer_Age = age;
			var element = document.getElementById("renderer_Age");
			if (element)
				element.innerHTML =  "Simulated Age: " + renderer_Age;
		}
		if (zincRenderer.playAnimation == true)
		{
			var sliderElement = document.getElementById("age_slider");
			sliderElement.value = renderer_Age;
		}
	};
}

function isSceneInitialised(scene_name) {
	var result = false;
	if (scene_name == "Surface") {
		result = surfaceStatus["initialised"];
	} else if (scene_name == "Airways") {
		result = airwaysStatus["initialised"];
	}
	
	return result;
}

var updateModelDownloadProgress = function(model_name, scene, model_ready) {
	var error = false;
	if (scene) {
		var element = document.getElementById("loadingOverlay");
		if (model_ready) {
			element.innerHTML =  "Loading " + model_name + "... Completed."
		} else {
			var progress = scene.getDownloadProgress();
			if (progress[2] == false) {
				var totalString = "unknown";
				if (progress.totalSize > 0)
					totalString = parseInt(progress[0]/1024).toString() + " KB";
				if (element)
					element.innerHTML =  "Loading " + model_name + "... (" + parseInt(progress[1]/1024).toString() + " KB/" + totalString + ").";
			} else {
				error = true;
				if (element)
					element.innerHTML =  "Loading " + model_name + "... Failed to load models. Please try again later.";
			}
		}
	}
	if (model_ready) {
		setTimeout(endLoading, 1000);
	}
	else if (error == false) {
		setTimeout(updateModelDownloadProgress, 500, model_name, scene, isSceneInitialised(model_name));
	}
}

function meshReady(sceneName, shaderText, uniforms) {
	return function(mygeometry) {
		var material = new THREE.ShaderMaterial( {
			vertexShader: shaderText[0],
			fragmentShader: shaderText[1],
			uniforms: uniforms
		} );
		material.side = THREE.DoubleSide;
		mygeometry.setMaterial(material)
		if (sceneName == "Surface") {
			surfaceStatus["initialised"] = true;
		} else if (sceneName == "Airways") {
			airwaysStatus["initialised"] = true;
		}
		updateUniformsWithDetails();
	}
}
		
function initSurface(scene) {
	loadExternalFiles(['shaders/clean_cell.vs', 'shaders/clean_cell.fs'], function (shaderText) {
		scene.loadFromViewURL('surface/surface', meshReady(scene.sceneName, shaderText, cellUniforms));
	}, function (url) {
	    alert('Failed to download "' + url + '"');
	});
}

function initAirways(scene) {
	loadExternalFiles(['shaders/dynamic_flow.vs', 'shaders/dynamic_flow.fs'], function (shaderText) {
		scene.loadFromViewURL('airways/smoker_flow', meshReady(scene.sceneName, shaderText, cellUniforms));
	}, function (url) {
	    alert('Failed to download "' + url + '"');
	});
}

function initScene(scene_name) {
	beginLoading();
	scene = zincRenderer.createScene(scene_name);
	if (scene_name == "Surface") {
		initSurface(scene);
	} else if (scene_name == "Airways") {
		initAirways(scene);
	}else {
		console.log("Trying to initialise an undefined scene!!!")
	}
	updateModelDownloadProgress(scene_name, scene, isSceneInitialised(scene_name));
	
	return scene;
}

function setScene(scene_name) {
	var currentScene = undefined;
	if (scene_name == "Surface") {
		if (!surfaceStatus["initialised"]) {
			surfaceStatus["scene"] = initScene(scene_name);
		}
		currentScene = surfaceStatus["scene"];
	} else if (scene_name == "Airways") {
		if (!airwaysStatus["initialised"]) {
			airwaysStatus["scene"] = initScene(scene_name);
		}
		currentScene = airwaysStatus["scene"];
	} else {
		console.log("Trying to set undefined scene!!!!")
	}
	zincRenderer.setCurrentScene(currentScene);
}

function modelButtonClicked(model_name) {
	setScene(model_name);
}

function initZinc() {
	var errorString = undefined;
	if ( ! Detector.webgl )
		errorString = Detector.getWebGLErrorMessage();
	if (errorString == undefined) {
		zincRenderer = new Zinc.Renderer(container, window);
		zincRenderer.initialiseVisualisation();
		zincRenderer.addPreRenderCallbackFunction(updateUniforms(zincRenderer, cellUniforms, flowUniforms));
		zincRenderer.setPlayRate(500);
		zincRenderer.playAnimation = false;
		zincRenderer.animate();
	} else {
		errorString = "WebGL is required to display the interactive 3D models.<br>" + errorString + "<br>";
		var element = undefined;
		element = document.getElementById("loadingOverlay");
		if (element) {
			element.innerHTML = errorString;
			element.onclick = endLoading;
		}
	}
}

function setInputsToUserDataValues() {
	var age = document.getElementById("renderer_Age");
	var age_input = document.getElementById("age_input");
	var height_input = document.getElementById("height_input");
	var gender_input = undefined;
	if (userData["Gender"] == "Male") {
		gender_input = document.getElementById("male_radiobutton");
	} else {
		gender_input = document.getElementById("female_radiobutton");
	}
	gender_input.checked = true;
	age_input.value = userData["Current Age"];
	height_input.value = userData["Height (cm)"];
}

function setPage(pageIndex) {
	var pages = document.getElementsByClassName("toggleByPageNumber");
	var pages_length = pages.length;
	for (var i = 0; i < pages_length; i++) {
		var e = pages[i];
		if (e.classList.contains("page_" + pageIndex)) {
			e.style.display = "block";
		} else {
			e.style.display = "none";
		}
	}
}

function interactiveLungButtonClicked() {
	setPage(1);
}

function setUserDataValue(identifier, value) {
	if (identifier == "height_input") {
		userData["Height (cm)"] = value;
	} else if (identifier == "age_input") {
		userData["Current Age"] = value;
	} else {
		console.log("Uh Oh unknown identifier " + identifier + " with value: " + value);
	}
}

function addClicked(owner) {
	owner.previousElementSibling.value = +owner.previousElementSibling.value + 1;
	setUserDataValue(owner.previousElementSibling.id, owner.previousElementSibling.value);
	updateUniformsWithDetails();
}

function subClicked(owner) {
	if (owner.nextElementSibling.value > 0) {
		owner.nextElementSibling.value = +owner.nextElementSibling.value - 1;
		setUserDataValue(owner.nextElementSibling.id, owner.nextElementSibling.value);
		updateUniformsWithDetails();
	}
}

function resetViewButtonClicked() {
	zincRenderer.viewAll();
}

var dojoConfig = {
	async: true,
	// This code registers the correct location of the "demo" package
	// so we can load Dojo from the CDN whilst still being able to
	// load local modules
	packages: [{
		name: "js",
		location: location.pathname.replace(/\/[^/]+$/, '')  + '/js'
	}]
};

function updateSlider(slideAmount) {
	this.zincRenderer.setMorphsTime(slideAmount * 30);
}

require(["dojo/domReady!"], function(){
	setInputsToUserDataValues();
});

$( "#navcontent_page_0" ).load("page_0.html");
$( "#navcontent_page_1" ).load("page_1.html");
