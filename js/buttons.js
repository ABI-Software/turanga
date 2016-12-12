
function gasExchangeClicked() {
	setPage(2);
	modelButtonClicked('Airways');
	rendered_age = 0;
	subjectDetails.asthmaSeverity = 'none';
	subjectDetails.packsPerDay = 0.0;
	updateUniformsWithDetails();
}

function breathingClicked() {
	setPage(1);
	modelButtonClicked('Surface');
	rendered_age = 0;
	subjectDetails.asthmaSeverity = 'none';
	subjectDetails.packsPerDay = 0.0;
	updateUniformsWithDetails();
}

function asthmaClicked() {
	setPage(3);
	modelButtonClicked('Airways');
	setCurrentAge(100);
	subjectDetails.packsPerDay = 0.0;
	var asthma_button_div = document.getElementById('asthma_condition');
	asthmaConditionClicked(asthma_button_div.children[0]);
}

function smokingClicked() {
	setPage(7);
	modelButtonClicked('Airways');
	rendered_age = 25;
	subjectDetails.asthmaSeverity = 'none';
	var smoking_packs_div = document.getElementById('smoking_packs');
	smokingPacksClicked(smoking_packs_div.children[0]);
}

function holdit(btn, action, start, speedup) {
    var t;

    var repeat = function () {
        action(btn);
        t = setTimeout(repeat, start);
        start = start / speedup;
    }

    btn.onmousedown = function() {
        repeat();
    }

    btn.onmouseout = btn.onmouseup = function () {
        clearTimeout(t);
    }
}

function setRepeatOnButtons(element) {
	/* to use */
	var buttons = element.getElementsByClassName('Button');
	var i;
	for (i = 0; i < buttons.length; i++) {
		var button = buttons[i];
		if (button.classList.contains('PlusButton')) {
			holdit(button, addClicked, 1000, 2);
		} else if (button.classList.contains('MinusButton')) {
			holdit(button, subClicked, 1000, 2);
		}
	}
	//holdit(btn, function () { }, 1000, 2); /* x..1000ms..x..500ms..x..250ms..x */
}

function playPauseClicked(sender) {
	if (sender.classList.contains('PlayButton')) {
		sender.classList.remove('PlayButton');
		sender.classList.add('PauseButton');
		zincRenderer.playAnimation = true;
	} else {
		sender.classList.remove('PauseButton');
		sender.classList.add('PlayButton');
		zincRenderer.playAnimation = false;
	}
}

function resetPlayClicked(sender) {
	var base_button = sender.parentNode;
	var play_pause_button = base_button.getElementsByClassName('PlayButton')[0] || base_button.getElementsByClassName('PauseButton')[0];
	if (play_pause_button.classList.contains('PauseButton')) {
		play_pause_button.classList.remove('PauseButton');
		play_pause_button.classList.add('PlayButton');
		zincRenderer.playAnimation = false;
	}
	setRenderedAge(lung_age_display, subjectDetails.age);
}

function setRenderedAge(owner, value) {
	if (owner) {
		var number_display = owner.getElementsByClassName('ValueDisplay')[0];
		number_display.innerHTML = value;
	}
}

function addClicked(owner) {
	var adder_button = owner.parentNode;
	var number_display = adder_button.getElementsByClassName('ValueDisplay')[0];
	if (number_display == undefined) {
		number_display = adder_button.getElementsByClassName('ValueWideDisplay')[0];
	}
	
	var increment = owner.hasAttribute('incrementsize') ? parseFloat(owner.getAttribute('incrementSize')) : 1;
	var precision = owner.hasAttribute('precision') ? precision = owner.getAttribute('precision') : 0;
	var num = +number_display.innerHTML + increment;

	number_display.innerHTML = num.toFixed(precision);
	setSubjectDetailsValue(adder_button.parentNode.id, number_display.innerHTML);
	updateUniformsWithDetails();
	updateUi();
}

function subClicked(owner) {
	var adder_button = owner.parentNode;
	var number_display = adder_button.getElementsByClassName('ValueDisplay')[0];
	if (number_display == undefined) {
		number_display = adder_button.getElementsByClassName('ValueWideDisplay')[0];
	}
	if (number_display.innerHTML > 0) {
		var increment = owner.hasAttribute('incrementsize') ? parseFloat(owner.getAttribute('incrementSize')) : 1;
		var precision = owner.hasAttribute('precision') ? precision = owner.getAttribute('precision') : 0;
		var num = +number_display.innerHTML - increment;
		
		number_display.innerHTML = num.toFixed(precision);
		setSubjectDetailsValue(adder_button.parentNode.id, number_display.innerHTML);
		updateUniformsWithDetails();
	}
	updateUi();
}

function maleClicked(owner) {
	var gender_button = owner.parentNode;
	var gender_display = owner.parentNode.getElementsByClassName('ValueDisplay')[0];
	gender_display.innerHTML = 'M';
	setSubjectDetailsValue(gender_button.parentNode.id, 'Male');
	updateUniformsWithDetails();
	updateUi();
}

function femaleClicked(owner) {
	var gender_button = owner.parentNode;
	var gender_display = owner.parentNode.getElementsByClassName('ValueDisplay')[0];
	gender_display.innerHTML = 'F';
	setSubjectDetailsValue(gender_button.parentNode.id, 'Female');
	updateUniformsWithDetails();
	updateUi();
}

function activateCondition(sender) {
	var parent_node = sender.parentNode;
	var children_count = parent_node.children.length;
	var i;
	for (i = 0; i < children_count; i++) {
		if (!parent_node.children[i].classList.contains('InactiveIcon')) {
			parent_node.children[i].classList.add('InactiveIcon');
		}
	}
	if (sender.classList.contains('InactiveIcon')) {
		sender.classList.remove('InactiveIcon');
	}
}

function asthmaConditionClicked(sender) {
	activateCondition(sender);
	if (sender.classList.contains('GreenIcon')) {
		asthma_flow_plot.setActiveSeries('mild');
		asthma_volume_plot.setActiveSeries('mild');
		subjectDetails.asthmaSeverity = 'Mild';
	} else if (sender.classList.contains('YellowIcon')) {
		asthma_flow_plot.setActiveSeries('moderate');
		asthma_volume_plot.setActiveSeries('moderate');
		subjectDetails.asthmaSeverity = 'Moderate';
	} else if (sender.classList.contains('PinkIcon')) {
		asthma_flow_plot.setActiveSeries('severe');
		asthma_volume_plot.setActiveSeries('severe');
		subjectDetails.asthmaSeverity = 'Severe';
	}
	updateUniformsWithDetails();
}

function smokingPacksClicked(sender) {
	activateCondition(sender);
	if (sender.classList.contains('GreenIcon')) {
		subjectDetails.packsPerDay = 0.0;
	} else if (sender.classList.contains('YellowIcon')) {
		subjectDetails.packsPerDay = 1.0;
	} else if (sender.classList.contains('PinkIcon')) {
		subjectDetails.packsPerDay = 2.0;
	}
	updateUniformsWithDetails();
	updateUi();
}

