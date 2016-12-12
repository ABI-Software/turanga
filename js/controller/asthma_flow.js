define([
    "dojo/_base/declare",
	"dojox/charting/Chart",
	"dojox/charting/plot2d/StackedLines",
	"dojox/charting/plot2d/Grid",
	"dojox/charting/themes/Tom",
	"dojox/charting/axis2d/Default",
	"dojox/charting/widget/Legend"
	], function(declare, Chart, StackedLines, Grid, TomTheme, axis2dDefault, Legend){

	return declare("AsthmaFlowController", null,{

		_plot: undefined,
		_toggle_series: undefined,
		_colour_series: undefined,
		_waiting_for_data: undefined,
		
		constructor: function(params){
			dojo.mixin(this, params);
			this._toggle_series = ['mild', 'moderate', 'severe'];
			this._colour_series = {};
			this._waiting_for_data = '';
		},
		
		renderPlot: function(){
			if (this._plot != undefined) {
				this._plot.render();
			}
		},
		
		addSeries: function(seriesName, data, colorString) {
			if (this._plot != undefined) {
				if (this._toggle_series.includes(seriesName)) {
					this._colour_series[seriesName] = colorString;
					if (this._waiting_for_data == seriesName) {
						this._plot.addSeries(seriesName, data, {stroke: {color: colorString}});
						this._waiting_for_data = '';
					}
				} else {
					this._plot.addSeries(seriesName, data, {stroke: {color: colorString}});
				}
			}
		},
		
		removeSeries: function(seriesName) {
			if (this._plot != undefined) {
				this._plot.removeSeries(seriesName);
			}
		},
		
		setActiveSeries: function(seriesName) {
			if (this._plot != undefined) {
				var i;
				var toggle_series_length = this._toggle_series.length;
				for (i = 0; i < toggle_series_length; i++) {
					this._plot.removeSeries(this._toggle_series[i]);
				}
				var data = undefined;
				if (seriesName == 'mild') {
					data = plot_data.asthma_flow_mild;
				} else if (seriesName == 'moderate') {
					data = plot_data.asthma_flow_moderate;
				} else if (seriesName == 'severe') {
					data = plot_data.asthma_flow_severe;
				}
				if (data == undefined) {
					this._waiting_for_data = seriesName;
				} else {
					this._plot.addSeries(seriesName, data, {stroke: {color: this._colour_series[seriesName]}});
					this._plot.render();
				}
			}
		},
		
		createPlot: function(dom, x_axis_name, y_axis_name){
			if (this._plot == undefined) {
				TomTheme.chart.fill="transparent";
				TomTheme.plotarea.fill = "transparent";
				TomTheme.chart.stroke = "transparent";
				var chart = new Chart(dom);
				chart.setTheme(TomTheme);
				chart.addAxis("x", {title:'Volume out of the Lungs', titleGap: 2, titleOrientation: 'away', titleFontColor: 'white', majorTicks: false, majorLabels: false, minorTicks: false, minorLabels: false, microTicks: false,  majorTick: {color: "red", length: 0},});
				chart.addAxis("y", {vertical: true, title:'Flow out of the Lungs', titleGap: 5, titleFontColor: 'white', majorTicks: false, majorLabels: false, minorTicks: false, minorLabels: false, microTicks: false, majorTick: {color: "red", length: 0},});
	
				this._plot = chart;
			}
		}

	});
});

