
function initPlots() {
	
	var dynamic_p_v_element = document.getElementById("dynamic_p_v_plot");
	dynamic_p_v_plot.createPlot(dynamic_p_v_element);
	var fev1_plot_element = document.getElementById("fev1_plot");
	fev1_plot.createPlot(fev1_plot_element);
	var breathing_plot_element = document.getElementById("breathing_plot");
	breathing_plot.createPlot(breathing_plot_element);
	var breathing_blood_air_plot_element = document.getElementById("breathing_blood_air_plot");
	breathing_blood_air_plot.createPlot(breathing_blood_air_plot_element);
	var asthma_flow_plot_element = document.getElementById("asthma_flow_plot");
	asthma_flow_plot.createPlot(asthma_flow_plot_element);
	var asthma_volume_plot_element = document.getElementById("asthma_volume_plot");
	asthma_volume_plot.createPlot(asthma_volume_plot_element);

	loadPlotData('inspiration', 'data/inspiration_dynamic_flow.json');
	loadPlotData('expiration', 'data/expiration_dynamic_flow.json');
	loadPlotData('breathing', 'data/breathing.json');
	loadPlotData('breathing_blood', 'data/breathing_blood.json');
	loadPlotData('breathing_air', 'data/breathing_air.json');
	loadPlotData('asthma_volume_normal', 'data/asthma_volume_normal.json');
	loadPlotData('asthma_volume_mild', 'data/asthma_volume_mild.json');
	loadPlotData('asthma_volume_moderate', 'data/asthma_volume_moderate.json');
	loadPlotData('asthma_volume_severe', 'data/asthma_volume_severe.json');
	loadPlotData('asthma_volume_one_second', 'data/asthma_volume_one_second.json');
	loadPlotData('asthma_flow_normal', 'data/asthma_flow_normal.json');
	loadPlotData('asthma_flow_mild', 'data/asthma_flow_mild.json');
	loadPlotData('asthma_flow_moderate', 'data/asthma_flow_moderate.json');
	loadPlotData('asthma_flow_severe', 'data/asthma_flow_severe.json');

	updateFEV1Plot();
};

var onDataLoaded = function(xmlhttp, dataName) {
	return function() {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			var viewData = JSON.parse(xmlhttp.responseText);
			plot_data[dataName] = viewData;
			showData(dataName);
		}
	};
}

function loadPlotData(data_name, data_location) {
	var xmlhttp = new XMLHttpRequest();	
	xmlhttp.onreadystatechange = onDataLoaded(xmlhttp, data_name);
	xmlhttp.open("GET", data_location, true);
	xmlhttp.send();
}
	
function updateFEV1Plot() {
	var asthmaScaling = asthmaLevel[subjectDetails.asthmaSeverity];
	var age = Math.floor(+subjectDetails.age + 0.5);
	var fevData = calculateFEVData(age, subjectDetails.gender.toLowerCase(),
		age - subjectDetails.ageStartedSmoking, subjectDetails.packsPerDay, subjectDetails.height, subjectDetails.FEV1, asthmaScaling);
		fev1_plot.removeSeries("normal");
	fev1_plot.removeSeries("you");
	fev1_plot.removeSeries("you smoking");
	fev1_plot.addSeries("normal", fevData[0], "blue");
	fev1_plot.addSeries("you", fevData[1], "green");
	fev1_plot.addSeries("you smoking", fevData[2], "red");
	fev1_plot.renderPlot();
}

function plotBreathingData(data) {
	breathing_plot.removeSeries('a');
	breathing_plot.addSeries('a', data, "purple");
	breathing_plot.renderPlot();
}

function plotBreathingBloodData(data) {
	breathing_blood_air_plot.removeSeries('blood');
	breathing_blood_air_plot.addSeries('blood', data, "red");
	breathing_blood_air_plot.renderPlot();
}

function plotBreathingAirData(data) {
	breathing_blood_air_plot.removeSeries('air');
	breathing_blood_air_plot.addSeries('air', data, "cyan");
	breathing_blood_air_plot.renderPlot();
}

function getColourForSeverity(severity) {
	colour = 'white';
	if (severity == 'normal') {
		colour = 'blue';
	} else if (severity == 'mild') {
		colour = 'green';
	} else if (severity == 'moderate') {
		colour = 'yellow';
	} else if (severity == 'severe') {
		colour = 'pink'
	}
	
	return colour;
}

function plotInspirationData(data) {
	dynamic_p_v_plot.removeSeries('inspiration');
	dynamic_p_v_plot.addSeries('inspiration', data, 'blue');
	dynamic_p_v_plot.renderPlot();
}
function plotExpirationData(data) {
	dynamic_p_v_plot.removeSeries('expiration');
	dynamic_p_v_plot.addSeries('expiration', data, 'red');
	dynamic_p_v_plot.renderPlot();
}
function plotAsthmaVolumeData(data, severity) {
	asthma_volume_plot.removeSeries(severity);
	asthma_volume_plot.addSeries(severity, data, getColourForSeverity(severity));
	asthma_volume_plot.renderPlot();
}

function plotAsthmaFlowData(data, severity) {
	asthma_flow_plot.removeSeries(severity);
	asthma_flow_plot.addSeries(severity, data, getColourForSeverity(severity));
	asthma_flow_plot.renderPlot();
}

function showData(dataName) {
	var currentData = plot_data[dataName];
	if (dataName == 'breathing') {
		plotBreathingData(currentData);
	} else if (dataName == 'inspiration') {
		plotInspirationData(currentData);
	} else if (dataName == 'expiration') {
		plotExpirationData(currentData);
	} else if (dataName == 'breathing_blood') {
		plotBreathingBloodData(currentData);
	} else if (dataName == 'breathing_air') {
		plotBreathingAirData(currentData);
	} else if (dataName == 'asthma_volume_normal') {
		plotAsthmaVolumeData(currentData, 'normal');
	} else if (dataName == 'asthma_volume_mild') {
		plotAsthmaVolumeData(currentData, 'mild');
	} else if (dataName == 'asthma_volume_moderate') {
		plotAsthmaVolumeData(currentData, 'moderate');
	} else if (dataName == 'asthma_volume_severe') {
		plotAsthmaVolumeData(currentData, 'severe');
	} else if (dataName == 'asthma_volume_one_second') {
		plotAsthmaVolumeData(currentData, 'one_second');
	} else if (dataName == 'asthma_flow_normal') {
		plotAsthmaFlowData(currentData, 'normal');
	} else if (dataName == 'asthma_flow_mild') {
		plotAsthmaFlowData(currentData, 'mild');
	} else if (dataName == 'asthma_flow_moderate') {
		plotAsthmaFlowData(currentData, 'moderate');
	} else if (dataName == 'asthma_flow_severe') {
		plotAsthmaFlowData(currentData, 'severe');
	}
}

