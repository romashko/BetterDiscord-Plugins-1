//META{"name":"GuildSeperators"}*//

class GuildSeperators {
	getName() {
		return "Guild Seperators";
	}
	getDescription() {
		return "Add Guild Seperators with a button in the context menu.";
	}
	getVersion() {
		return "1.4";
	}
	getAuthor() {
		return "Zerthox";
	}
	getSettingsPanel() {
		return null;
	}
	start() {
		BdApi.injectCSS("GuildSeperators", this.css());
		this.guilds = bdPluginStorage.get(this.getName(), "guilds");
		if (this.guilds === null) {
			this.guilds = [];
		}
		this.loadGuilds();
		console.log("[GuildSeperators] Started");
	}
	stop() {
		BdApi.clearCSS("GuildSeperators");
		this.saveGuilds();
	}
	observer(e) {
		if ($(e.addedNodes[0]).hasClass("context-menu") && $(".context-menu .item .add-seperator").length === 0) {
			var html = '<div class="item-group"><div class="item item-toggle"><span class="add-seperator">Add Seperator</span>';
				html += '<div class="checkbox"><div class="checkbox-inner"><input type="checkbox" value="on"><span></span></div><span></span></div>';
				html += '</div></div>';
			var c = $(".context-menu"),
				r = c[0].getBoundingClientRect();
			if (c.hasClass("invertX")) {
				var x = r.right;
			}
			else {
				var x = r.left;
			}
			if (c.hasClass("invertY")) {
				var y = r.bottom;
			}
			else {
				var y = r.top;
			}
			var g = $(document.elementFromPoint(x, y)).parents(".guild");
			if (g.length > 0) {
				var gs = this;
				c.append(html).promise().done(function() {
					var i = $(".add-seperator").parents(".item");
					i.click(function() {
						if (g[0].hasAttribute("seperator")) {
							g.removeAttr("seperator");
							$(this).find("input").prop("checked", false);
						}
						else {
							g.attr("seperator", "");
							$(this).find("input").prop("checked", true);
						}
						gs.saveGuilds();
					});
					if (g[0].hasAttribute("seperator")) {
						i.find("input").prop("checked", true);
					}
					var p = c[0].getBoundingClientRect();
					if (p.bottom > window.innerHeight) {
						c.css({top: p.top - c.height()});
						c.addClass("invertY");
					}
				});
			}
		}
		else if ($(".guild[seperator]").length != this.guilds.length) {
			this.loadGuilds();
		}
	}
	saveGuilds() {
		var a = [];
		$(".guild[seperator]").each(function() {
			a.push($(this).find("a").attr("href"));
		});
		this.guilds = a;
		bdPluginStorage.set(this.getName(), "guilds", this.guilds);
	}
	loadGuilds() {
		for (var i = 0; i < this.guilds.length; i++) {
			$(".guilds a[href='" + this.guilds[i] + "']").parents(".guild").attr("seperator", "");
		}
	}
	css() {
		var r = `/* Guild Seperators CSS */
		.guild[seperator] {
			margin-bottom: 32px
		}
		.guild[seperator]::after {
			content: "";
			position: absolute;
			bottom: -16px;
			left: 20%;
			right: 20%;
			height: 2px;
			background: #2f3136;
		}`;
		return r;
	}
	onMessage() {}
	onSwitch() {}
	load() { }
	unload() {}
}
