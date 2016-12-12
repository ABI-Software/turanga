define([
    "dojo/_base/declare",
	"dojox/charting/Chart",
	"dojox/charting/plot2d/StackedLines",
	"dojox/charting/plot2d/Grid",
	"dojox/charting/themes/Tom",
	"dojox/charting/axis2d/Default",
	"dojox/charting/widget/Legend"
	], function(declare, Chart, StackedLines, Grid, TomTheme, axis2dDefault, Legend){

	return declare("BreathingBloodAirController", null,{

		_plot: undefined,
		
		constructor: function(params){
			dojo.mixin(this, params);
		},
		
		renderPlot: function(){
			if (this._plot != undefined) {
				this._plot.render();
			}
		},
		
		addSeries: function(seriesName, data, colorString) {
			if (this._plot != undefined) {
				this._plot.addSeries(seriesName, data, {stroke: {color: colorString}});
			}
		},
		
		removeSeries: function(seriesName) {
			if (this._plot != undefined) {
				this._plot.removeSeries(seriesName);
			}
		},
		
		createPlot: function(dom, x_axis_name, y_axis_name){
			if (this._plot == undefined) {
				TomTheme.chart.fill="transparent";
				TomTheme.plotarea.fill = "transparent";
				TomTheme.chart.stroke = "transparent";
				var chart = new Chart(dom);
				chart.setTheme(TomTheme);
				chart.addAxis("x", {title:'Amount of <font color="red">blood</font> or <font color="aqua">air</font>', titleGap: 2, titleOrientation: 'away', titleFontColor: 'white', majorTicks: false, majorLabels: false, minorTicks: false, minorLabels: false, microTicks: false,  majorTick: {color: "red", length: 0},});
				chart.addAxis("y", {vertical: true, title:'Lung Height', titleGap: 5, titleFontColor: 'white', majorTicks: false, majorLabels: false, minorTicks: false, minorLabels: false, microTicks: false, majorTick: {color: "red", length: 0},});
	
				this._plot = chart;
			}
		}

	});
});

