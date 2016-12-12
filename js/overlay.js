var loadingPage;

require(["dojo/_base/declare","dojo/dom","dojo/dom-style", "dojo/_base/fx"],
	function(declare, dom, domStyle, fx){
		var _loadingPage = declare(null, {
			overlayNode:null,
			constructor:function() {
				// save a reference to the overlay
				this.overlayNode = dom.byId("loadingOverlay");
				this.messageNode = dom.byId("loadingMessage");
			},
			// called to hide the loading overlay
			endLoading:function() {
				fx.fadeOut({
					node: this.overlayNode,
					onEnd: function(node){
						domStyle.set(node, 'display', 'none');
					}
				}).play();
			},
			beginLoading:function() {
				domStyle.set(this.overlayNode, {"opacity":0.9, 'display': 'initial'});
			},
			setLoadingText:function(text) {
				this.messageNode.innerHTML = text;
			},
		});
		loadingPage = new _loadingPage();
	}
);

