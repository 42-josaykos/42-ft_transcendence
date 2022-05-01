game: function() {
				if (this.gameplay == true)
				{
					this.runWild();
					if (this.newround == true)
					{
						this.newround = false; // que quand on a fini
						if (this.newpause == true) {
							this.startTime = new Date().getTime();
							console.log(this.startTime);
						}
						else {
							this.waitForPlayers(1500); // ca marche mais on essaie de faire mieux
							var end = new Date().getTime();
							console.log(end);
							this.newpause = false;
						}
					}
					this.update();
					this.clearCanvas();
					this.render();
				}
				return ;
			},