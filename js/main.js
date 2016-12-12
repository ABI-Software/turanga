
function setCurrentAge(age) {
	// Age is in years.
	zincRenderer.setMorphsTime(age * 30);
}

function updateUniformsWithDetails() {
	var age = Math.floor(subjectDetails.age + 0.5);
	var start_age = subjectDetails.ageStartedSmoking * 0.01;
	if (start_age < 0.0)
		start_age = 0.0;
	var height = subjectDetails.height;
	var asthmaScaling = asthmaLevel[subjectDetails.asthmaSeverity];
	cellUniforms["starting_time"].value = start_age;
	cellUniforms["severity"].value = subjectDetails.packsPerDay * 1.0;
	flowUniforms["starting_time"].value = start_age;
	flowUniforms["severity"].value = subjectDetails.packsPerDay * 1.0;
	flowUniforms["height"].value = height * 1.0;
	flowUniforms["weight"].value = 70.0;
	flowUniforms["asthmaSeverity"].value = asthmaScaling * 1.0;
}

function endLoading() {
	loadingPage.endLoading();
}

function beginLoading() {
	loadingPage.beginLoading();
}

function updateUi() {
	updateFEV1Plot();
}

var skip = 0;

function updateUniforms(zincRenderer, cellUniforms, flowUniforms) {
	return function () {
		var directionalLight = zincRenderer.getCurrentScene().directionalLight;
		cellUniforms["directionalLightDirection"].value.set(directionalLight.position.x,
			directionalLight.position.y,
			directionalLight.position.z);
		flowUniforms["directionalLightDirection"].value.set(directionalLight.position.x,
			directionalLight.position.y,
			directionalLight.position.z);
		var time = zincRenderer.getCurrentTime()/3000.0;  // (0, 1])
		skip++;
		if (skip > 100) {
			// console.log(flowUniforms['severity']);
			// console.log(flowUniforms['asthmaSeverity']);
			// console.log(time);
			skip = 0;
		}
		cellUniforms["time"].value = time;
		flowUniforms["time"].value = time;

		var age = parseInt(time * 100.0);
		if (age != rendered_age) {
			setRenderedAge(lung_age_display, age);
			rendered_age = age;
		}

		var timeIncrement = 0.0;
		if (!currentDate) { 
			currentDate = new Date();
		} else {
			var oldDate = currentDate;
			currentDate = new Date();
			timeIncrement = currentDate.getTime() - oldDate.getTime();
		}
		currentBreathingTime = currentBreathingTime + timeIncrement;
		var breathing_cycle = 0.0;
		if (currentBreathingTime > 4000.0) {
			currentBreathingTime = currentBreathingTime - 4000.0;
			breathing_cycle = currentBreathingTime / 2000.0;
			if (breath == 1) {
				breath = 2;
			} else {
				breath = 1;
			}
		} else if (currentBreathingTime > 2000.0) {
			breathing_cycle = (4000.0 - currentBreathingTime) / 2000.0;
		} else {
			breathing_cycle = currentBreathingTime / 2000.0;
		}

		var trace_time = breath == 2 ? currentBreathingTime / 8000.0 + 0.5 : currentBreathingTime / 8000.0;
		breathing_plot.updateTrace(trace_time);
		dynamic_p_v_plot.updateTrace(breath, currentBreathingTime / 4000.0);

		flowUniforms["breathing_cycle"].value = breathing_cycle;
		cellUniforms["breathing_cycle"].value = breathing_cycle;
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

var modelDownloadError = function(model_name, scene) {
	console.log('Error downloading model: ' + model_name);
}

var updateModelDownloadProgress = function(model_name, scene, model_ready) {
	var error = false;
	if (scene) {
		var message = "";
		var element = document.getElementById("loadingMessage");
		if (model_ready) {
			message = "<p>Loading " + model_name + " ... Completed.</p>";
		} else {
			var progress = scene.getDownloadProgress();
			if (progress[2] == false) {
				var totalString = "";
				if (progress.totalSize > 0)
					totalString = parseInt(progress[0]/1024).toString() + " KB";
				message = "<p>Loading " + model_name + " ... (" + parseInt(progress[1]/1024).toString() + " KB" + (totalString ? "/" + totalString : "") + ").</p>";
			} else {
				error = true;
				message = "<p>Loading " + model_name + " ... Failed to load models. Please try again later.</p>";
			}
		}
		loadingPage.setLoadingText(message);
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
			uniforms: uniforms,
		} );
		material.side = THREE.DoubleSide;
		if (sceneName == "Surface") {
			surfaceStatus.initialised = true;
			material.transparent = false;
			mygeometry.setMaterial(material);
			surfaceStatus.scene.viewAll();
		} else if (sceneName == "Airways") {
			airwaysStatus.initialised = true;
			airwaysStatus.scene.addZincGeometry(mygeometry, 10001, undefined, undefined, false, false, true, undefined, material);
			setCurrentAge(100);
			airwaysStatus.scene.viewAll();
		} else if (sceneName == "Lungs") {
			lungsStatus.initialised = true;
			lungsStatus.scene.viewAll();
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

// function initAirways(scene) {
// 	loadExternalFiles(['shaders/dynamic_flow.vs', 'shaders/dynamic_flow.fs'], function (shaderText) {
// 		scene.loadFromViewURL('airways/smoker_and_asthmatic_flow', meshReady(scene.sceneName, shaderText, cellUniforms), );
// 	}, function (url) {
// 	    alert('Failed to download "' + url + '"');
// 	});
// }

function initAirways(scene) {
	scene.loadViewURL('airways/smoker_and_asthmatic_flow_view.json')
	loadExternalFiles(['shaders/dynamic_flow.vs', 'shaders/dynamic_flow.fs'], function (shaderText) {
		loadURLsIntoBufferGeometry('airways/smoker_and_asthmatic_flow_1.json', meshReady(scene.sceneName, shaderText, flowUniforms), updateModelDownloadProgress(scene.sceneName, scene, isSceneInitialised(scene.sceneName), modelDownloadError(scene.sceneName, scene)));
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

function resetSubjectDetails() {
	subjectDetails = new person(11, 153, "Male");
}

function setValueDisplay(element, value) {
	var value_display = undefined;
	if (element) {
		value_display = element.getElementsByClassName('ValueDisplay')[0];
		if (!value_display) {
			value_display = element.getElementsByClassName('ValueWideDisplay')[0];
		}
		value_display.innerHTML = value;
	}
}

function setInputsToSubjectDetailsValues() {
	var resistance_input = document.getElementById("resistance_input");
	var height_input = document.getElementById("height_input");
	var gender_input = document.getElementById("gender_input");
	var fev_input = document.getElementById("fev_input");

	setValueDisplay(resistance_input, subjectDetails.resistance);
	setValueDisplay(height_input, subjectDetails.height);
	setValueDisplay(gender_input, subjectDetails.gender == 'Male' ? 'M' : 'F');
	setValueDisplay(fev_input, subjectDetails.FEV1);	
	setRenderedAge(lung_age_display, subjectDetails.age);
}

function setPage(pageIndex) {
	var elements = document.getElementsByClassName("toggleByPageNumber");
	var elements_length = elements.length;
	for (var i = 0; i < elements_length; i++) {
		var e = elements[i];
		if (e.classList.contains("page_" + pageIndex)) {
			e.style.display = "";
		} else if (pageIndex > 0 && e.classList.contains("page_natural")) {
			e.style.display = "";
		} else {
			e.style.display = "none";
		}
	}
	fev1_plot.renderPlot();
	breathing_plot.setActive(pageIndex == 1 ? true : false);
        dynamic_p_v_plot.setActive(pageIndex == 3 ? true : false);
}

function setSubjectDetailsValue(identifier, value) {
	if (identifier == "height_input") {
		subjectDetails.height = value;
	} else if (identifier == "resistance_input") {
		subjectDetails.resistance = value;
	} else if (identifier == "age_input") {
		subjectDetails.age = value;
	} else if (identifier == "gender_input") {
		subjectDetails.gender = value;
	} else if (identifier == "fev_input") {
		subjectDetails.FEV1 = value;
	} else {
		console.log("Uh Oh unknown identifier " + identifier + " with value: " + value);
	}
}

function startAgain() {
	resetSubjectDetails();
	
	setPage(3);
	setInputsToSubjectDetailsValues();
	
	modelButtonClicked("Airways");
	
	// var asthma_button_div = document.getElementById('asthma_condition');
	// asthmaConditionClicked(asthma_button_div.children[0]);
	
	// var smoking_packs_div = document.getElementById('smoking_packs');
	// smokingPacksClicked(smoking_packs_div.children[0]);
}

function resetViewButtonClicked() {
	zincRenderer.viewAll();
}

function updateSlider(slideAmount) {
	this.zincRenderer.setMorphsTime(slideAmount * 30);
}

function requestFullScreen(element) {
    // Supports most browsers and their versions.
    var requestMethod = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || element.msRequestFullScreen;

    if (requestMethod) { // Native full screen.
        requestMethod.call(element);
    } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
}

require(["js/controller/fev1", 
	"js/controller/dynamic_p_v",
	"js/controller/breathing",
	"js/controller/breathing_blood_air",
	"js/controller/asthma_volume",
	"js/controller/asthma_flow",
	"dojo/domReady!"], function(FEV1, DynamicPV, Breathing, BloodAir, AsthmaVolume, AsthmaFlow){
	
	dynamic_p_v_plot = new DynamicPV();
	fev1_plot = new FEV1();
	breathing_plot = new Breathing();
	breathing_blood_air_plot = new BloodAir();
	asthma_volume_plot = new AsthmaVolume();
	asthma_flow_plot = new AsthmaFlow();
	
	var height_input = document.getElementById('height_input')
	setRepeatOnButtons(height_input);

	resetSubjectDetails();
	initZinc();
	initPlots();

	startAgain();
	setPage(0);
	
	var body = document.body;
	requestFullScreen(body);
});

