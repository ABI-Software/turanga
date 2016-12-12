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

	return declare("DynamicPVController", null,{

		_plot: undefined,
		_active: undefined,
		
		constructor: function(params){
			dojo.mixin(this, params);
			this._active = false;
			this._resistance = 1.0;
			this._min_y = 0.0;
			this._max_y = 0.0;
		},

		setActive: function(state) {
			this._active = state;
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
		
		updateTrace: function(breath, time) {
			// time is expected to be between (0, 1]
			// breath is expected to be either 1 or 2
			if (plot_data.inspiration && plot_data.expiration && this._active) {
				this._plot.removeSeries('point');

				var pt = this._determineFunctionPoint(breath, time);
				this._plot.addSeries('point', [pt], {plot: "plot_markers", marker: "m-3,0 c0,-4 6,-4 6,0 m-6,0 c0,4 6,4 6,0", markerStroke: 'white', markerFill: 'white'})
				this._plot.render();
			}
		},

		createPlot: function(dom, x_axis_name, y_axis_name){
			if (this._plot == undefined) {
				TomTheme.chart.fill="transparent";
				TomTheme.plotarea.fill = "transparent";
				TomTheme.chart.stroke = "transparent";
				var chart = new Chart(dom);
				chart.setTheme(TomTheme);
				chart.addPlot("plot_markers", { type: MarkersOnly });
				chart.addAxis("x", {title:'Pressure (cm H2O)', titleGap: 2, titleOrientation: 'away', titleFontColor: 'white', majorTicks: true, majorLabels: true, minorTicks: false, minorLabels: false, microTicks: false,  majorTick: {color: "red", length: 0},});
				chart.addAxis("y", {vertical: true, title:'Volume (L)', titleGap: 5, titleFontColor: 'white', majorTicks: false, majorLabels: false, minorTicks: false, minorLabels: false, microTicks: false,});
				this._plot = chart;
			}
		},

		_determineFunctionPoint: function(breath, time) {
			// 0.0006011 x - 0.03912 x + 0.8304 x - 6.068 x + 15.22 x + 18.11
			// Assume plot data is monotonically increasing in time.
			// Assume plot data is somewhat linearly spaced.
			var active_data = undefined;
			var first_point = undefined;
			var last_point = undefined;
			var data_length = undefined;
			//var pt = {'x': 0.0, 'y': 0.0};
			if (breath == 1) {
				active_data = plot_data.inspiration;
				data_length = active_data.length;
				first_point = active_data[0];
				last_point = active_data[data_length - 1];
			} else {
				active_data = plot_data.expiration;
				data_length = active_data.length;
				first_point = active_data[data_length - 1];
				last_point = active_data[0];
			}

			var x_range = last_point.x - first_point.x;
			var mapped_x = time * x_range + first_point.x;

			//var x_1 = mapped_x;
			//var x_2 = x_1 * x_1;
			//var x_3 = x_2 * x_1;
			//var x_4 = x_2 * x_2;
			//var x_5 = x_3 * x_2;

			//pt.x = mapped_x;
			//pt.y = 0.0006011 * x_5 - 0.03912 * x_4 + 0.8304 * x_3 - 6.068 * x_2 + 15.22 * x_1 + 18.11;

			//return pt;
			var index = Math.floor(time * data_length + 0.5);

			while (0 <= index && index < data_length - 1 && active_data[index + 1].x < mapped_x) {
				index++;
			}
			while (0 <= index && index < data_length - 1 && active_data[index].x > mapped_x) {
				index--;
			}

			var pt = undefined;
			if (index < 0) {
				pt = first_point;
			} else if (index >= data_length - 1) {
				pt = last_point;
			} else {
				var pt1 = active_data[index];
				var pt2 = active_data[index + 1];

				var slope = (pt2.y - pt1.y) / (pt2.x - pt1.x);
				pt = {y: slope * (mapped_x - pt1.x) + pt1.y, x: mapped_x};
			}
			// console.log(pt);
			return pt;
		},


	});
});

