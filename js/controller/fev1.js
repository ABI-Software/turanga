define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/dom-class",	
	"dojo/topic",
	"dojox/charting/Chart",
	"dojox/charting/plot2d/StackedLines",
	"dojox/charting/plot2d/Grid",
	"dojox/charting/themes/Tom",
	"dojox/charting/axis2d/Default",
	"dojox/charting/widget/Legend"
	], function(declare, lang, domClass, topic, Chart, StackedLines, Grid, TomTheme, axis2dDefault, Legend){

	return declare("FEV1Controller", null,{

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
				chart.addAxis("x", {min: 0, max: 100, title:'Age (years)', titleGap: 5, titleOrientation: 'away', titleFontColor: 'white'});
				chart.addAxis("y", {vertical: true, min: 0, max: 140, title:'Lung function (FEV1)', titleGap: 5, titleFontColor: 'white'});
	
				this._plot = chart;
			}
		}

	});
});

