define([
    "dojo/_base/declare",
	"dojox/charting/Chart",
	"dojox/charting/plot2d/StackedLines",
	"dojox/charting/plot2d/MarkersOnly",
	"dojox/charting/plot2d/Grid",
	"dojox/charting/themes/Tom",
	"dojox/charting/axis2d/Default",
	"dojox/charting/widget/Legend"
	], function(declare, Chart, StackedLines, MarkersOnly, Grid, TomTheme, axis2dDefault, Legend){

	return declare("BreathingController", null,{

		_plot: undefined,
		_active: undefined,
		
		constructor: function(params){
			dojo.mixin(this, params);
			this._active = false;
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
		
		updateTrace: function(x) {
			// x is expected to be between (0, 1]
			if (plot_data.breathing && this._active) {
				this._plot.removeSeries('point');
				
				var pt = this._determineFunctionPoint(x);
				this._plot.addSeries('point', [pt], {plot: "plot_markers", marker: "m-3,0 c0,-4 6,-4 6,0 m-6,0 c0,4 6,4 6,0", markerStroke: 'white', markerFill: 'white'})
				this._plot.render();
			}
		},
		
		setActive: function(state) {
			this._active = state;
		},
		
		createPlot: function(dom, x_axis_name, y_axis_name){
			if (this._plot == undefined) {
				TomTheme.chart.fill="transparent";
				TomTheme.plotarea.fill = "transparent";
				TomTheme.chart.stroke = "transparent";
				var chart = new Chart(dom);
				chart.setTheme(TomTheme);
				chart.addPlot("plot_markers", { type: MarkersOnly });
				chart.addAxis("x", {title:'Time', titleGap: 2, titleOrientation: 'away', titleFontColor: 'white', majorTicks: false, majorLabels: false, minorTicks: false, minorLabels: false, microTicks: false,  majorTick: {color: "red", length: 0},});
				chart.addAxis("y", {vertical: true, title:'Lung Volume', titleGap: 5, titleFontColor: 'white', majorTicks: false, majorLabels: false, minorTicks: false, minorLabels: false, microTicks: false, majorTick: {color: "red", length: 0},});
	
				this._plot = chart;
			}
		},
		
		_determineFunctionPoint: function(x) {
			// Assume plot data is monotonically increasing in x.
			// Assume plot data is somewhat linearly spaced.
			var breathing_length = plot_data.breathing.length;
			first_point = plot_data.breathing[0];
			last_point = plot_data.breathing[breathing_length - 1];
			
			var x_range = last_point.x - first_point.x;
			var mapped_x = x * x_range + first_point.x;
			
			var index = Math.floor(x * breathing_length + 0.5);
			
			while (0 <= index && index < breathing_length - 1 && plot_data.breathing[index + 1].x < mapped_x) {
				index++;
			}
			while (0 <= index && index < breathing_length - 1 && plot_data.breathing[index].x > mapped_x) {
				index--;
			}
			
			var pt = undefined;
			if (index < 0) {
				pt = first_point;
			} else if (index >= breathing_length - 1) {
				pt = last_point;
			} else {
				var pt1 = plot_data.breathing[index];
				var pt2 = plot_data.breathing[index + 1];
				
				var slope = (pt2.y - pt1.y) / (pt2.x - pt1.x);
				pt = {y: slope * (mapped_x - pt1.x) + pt1.y, x: mapped_x};
			}
			// console.log(pt);
			return pt;
		},

	});
});

