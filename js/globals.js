var zincRenderer = undefined;
var subjectDetails = undefined; /* new person(11, 152, "Male"); */
var dataController = undefined;

var container = document.getElementById( "zinc_window" );
var myLoadingPage = document.getElementById("loadingOverlay");
var lung_age_display = document.getElementById("play_pause_button");
var rendered_age = 0;
var currentBreathingTime = 0.0;
var currentDate = undefined;
var breath = 1;

var dynamic_p_v_plot = undefined;
var fev1_plot = undefined;
var breathing_plot = undefined;
var breathing_blood_air_plot = undefined;
var asthma_flow_plot = undefined;
var asthma_volume_plot = undefined;

var plot_data = new dataSet();

function person(age, height, gender) {
	this.age = age;
	this.height = height // cm
	this.resistance = 17;
	this.gender = gender;
	this.asthmaSeverity = "none";
	this.ageStartedSmoking = 25;
	this.packsPerDay = 0.0;
	this.FEV1 = 2.7;
};

function dataSet() {
	this.test = undefined;
	this.inspiration = undefined;
	this.expiration = undefined;
	this.breathing = undefined;
	this.breathing_blood = undefined;
	this.breathing_air = undefined;
	this.asthma_volume_normal = undefined;
	this.asthma_volume_mild = undefined;
	this.asthma_volume_moderate = undefined;
	this.asthma_volume_severe = undefined;
	this.asthma_volume_one_second = undefined;
	this.asthma_flow_normal = undefined;
	this.asthma_flow_mild = undefined;
	this.asthma_flow_moderate = undefined;
	this.asthma_flow_severe = undefined;
}

/* According to studies, asthma severity affects percentage FEV1 */
var asthmaLevel = {
	"none" : 1.0,
	"Mild" : 0.8,
	"Moderate" : 0.7,
	"Severe": 0.6	
};

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
};

var lungsStatus = {
	"scene": undefined,
	"initialised": false,
	"download": {
		"progress": 0,
		"total": 0,
	},
};

var cellUniforms= THREE.UniformsUtils.merge( [
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
		"tarDensity":  { type: "f", value: 0.0175},
		"breathing_cycle": { type: "f", value: 0.0 },
		"surfaceAlpha": { type: "f", value: 0.5 }
	}
] );

var flowUniforms= THREE.UniformsUtils.merge( [
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
	"severity": { type: "f", value: 1.0 },
	"height": { type: "f", value: 160.0 },
	"weight": { type: "f", value: 70.0 },
	"breathing_cycle": { type: "f", value: 0.0 },
	"asthmaSeverity": { type: "f", value: 1.0 }
} ] );


