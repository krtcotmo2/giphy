let peeps = [`Gary Oldman`, `Casey Affleck`, `Leonardo DiCaprio`, `Eddie Redmayne`, `Matthew McConaughey`, `Jean Dujardin`, `Colin Firth`, `Jeff Bridges`, `Forest Whitaker`, `Philip Seymour Hoffman`, `Jamie Foxx`, `Sean Penn`, `Adrien Brody`, `Denzel Washington`, `Russell Crowe`, `Kevin Spacey`, `Roberto Benigni`, `Geoffrey Rush`, `Nicolas Cage`, `Tom Hanks`, `Al Pacino`, `Anthony Hopkins, Sir`, `Jeremy Irons`, `Daniel Day-Lewis`, `Michael Douglas`, `Paul Newman`, `William Hurt`, `F. Murray Abraham`, `Robert Duvall`, `Ben Kingsley`, `Henry Fonda`, `Robert De Niro`, `Dustin Hoffman`, `Jon Voight`, `Richard Dreyfuss`, `Peter Finch`, `Jack Nicholson`, `Art Carney`, `Jack Lemmon`, `Gene Hackman`, `George C. Scott`, `John Wayne`, `Cliff Robertson`, `Rod Steiger`, `Paul Scofield`, `Lee Marvin`, `Rex Harrison`, `Sidney Poitier`, `Gregory Peck`, `Maximilian Schell`, `Burt Lancaster`, `Charlton Heston`, `David Niven`, `Alec Guinness`, `Yul Brynner`, `Ernest Borgnine`, `Marlon Brando`, `William Holden`, `Humphrey Bogart`, `José Ferrer`, `Broderick Crawford`, `Laurence Olivier`, `Ronald Colman`, `Fredric March`, `Ray Milland`, `Bing Crosby`, `Paul Lukas`, `James Cagney`, `Gary Cooper`, `James Stewart`, `Robert Donat`, `Spencer Tracy`, `Paul Muni`, `Victor McLaglen`, `Clark Gable`, `Charles Laugthon`, `Wallace Beery`, `Frederic March`, `Lionel Barrymore`, `George Arliss`, `Warner Baxter`, `Emil Jannings`, `Emma Stone`, `Brie Larson`, `Julianne Moore`, `Cate Blanchett`, `Jennifer Lawrence`, `Natalie Portman`, `Sandra Bullock`, `Kate Winslet`, `Marion Cotillard`, `Helen Mirren Dame`, `Reese Witherspoon`, `Charlize Theron`, `Nicole Kidman`, `Halle Berry`, `Julia Roberts`, `Hilary Swank`, `Gwyneth Paltrow`, `Helen Hunt`, `Frances McDormand`, `Susan Sarandon`, `Jessica Lange`, `Holly Hunter`, `Emma Thompson`, `Kathy Bates`, `Jessica Tandy`, `Jodie Foster`, `Cher`, `Marlee Matlin`, `Geraldine Page`, `Shirley MacLaine`, `Meryl Streep`, `Sissy Spacek`, `Sally Field`, `Diane Keaton`, `Faye Dunaway`, `Louise Fletcher`, `Ellen Burstyn`, `Liza Minnelli`, `Jane Fonda`, `Glenda Jackson`, `Maggie Smith`, `Barbra Streisand`, `Julie Christie`, `Julie Andrews`, `Patricia Neal`, `Anne Bancroft`, `Sophia Loren`, `Elizabeth Taylor`, `Simone Signoret`, `Susan Hayward`, `Joanne Woodward`, `Anna Magnani`, `Grace Kelly`, `Audrey Hepburn`, `Shirley Booth`, `Judy Holliday`, `Jane Wyman`, `Loretta Young`, `Olivia de Havilland`, `Joan Crawford`, `Ingrid Bergman`, `Jennifer Jones`, `Greer Garson`, `Joan Fontaine`, `Ginger Rogers`, `Vivien Leigh`, `Luise Rainer`, `Bette Davis`, `Claudette Colbert`, `Katharine Hepburn`, `Helen Hayes`, `Marie Dressler`, `Norma Shearer`, `Mary Pickford`, `Janet Gaynor`];
let btnList = [];
let gifSetter = {
	getGifs: function (arg) {
		arg = arg.replace(" ", "+");
		var queryURL = `https://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&limit=10&q=${arg}`;
		$.ajax({
			url: queryURL,
			method: "GET"
		}).then(function (response) {
			let grpHolder = $("<div>").append(`<h5>${arg.replace("+", " ")}</h5>`);
			response.data.forEach(function (o) {
				let img = $("<img>").attr("data-ani", o.images.fixed_height_small.url)
				.attr("data-playing", "false")
				.attr("data-still", o.images.fixed_height_small_still.url)
				.attr("src", o.images.fixed_height_small_still.url)
				.attr("class", "aGif");
				grpHolder.append(img)
				$(".gifHolder").prepend(grpHolder);
				img.on("click", function () {					
					if($(this).data("playing") === false){
						$(this).data("playing", true);
						$(this).attr("src", $(this).data("ani"));
					}else{
						$(this).data("playing", false);
						$(this).attr("src", $(this).data("still"));
					}
				});
			});
		}).catch(function (response) {
			$(".modal-body").html("There was an error attempting to get information from Giphy.com.");
			$('#theModal').modal();
		});
	},
	offerOptions: function (arg) {
		$(".modal-body").html("")
		let inst = $("<p>").text(`Several options could match your request. Click one of the buttons below to add the actor/actress or click ok to clsoe the options.`);		
		$(".modal-body").append(inst);
		for(let d =0; d<arg.length;d++){			
			let btn = $(`<button class='oneOfMany'>${arg[d]}</button>`);
			$(".modal-body").append(btn);
		}
		let instance = this;
		$(".oneOfMany").on("click", function(){
			instance.checkName(this.innerText.toLowerCase(), true, instance.getGifs);
			peeps = peeps.filter( x => x != this.innerText)
			$('#theModal').modal('hide');
		})
		$('#theModal').modal();
	},
	addButton: function (nameOnbtn) {
		let btn = $(`<button class='btnActor'>${nameOnbtn}</button>`);
		btn.attr("data-name", nameOnbtn);
		
		btnList.push(nameOnbtn);
		return btn;
	},
	checkName: function (theName, match,  callback) {
		let potentail = [];
		peeps.forEach(function (o) {
			if (o.toLowerCase().includes(theName) && !match) {
				potentail.push(o);
				person = o;
			}
			if (o.toLowerCase() == theName && match) {
				potentail.push(o);
				person = o;
			}
		});
		if (potentail.length == 0) {
			$(".modal-body").html("")
			let inst = $("<p>").text(`No one with a name similar to ${$("#tboxActor").val().trim()} has won an Oscar`);		
			$(".modal-body").append(inst);
			$('#theModal').modal();
			return;
		} else if (potentail.length > 1) {
			this.offerOptions(potentail);
			return;
		}
		if (btnList.indexOf(potentail[0]) > -1) {
			$(".modal-body").html("")
			let inst = $("<p>").text(`Results for ${$("#tboxActor").val().trim()} are already in your list`);		
			$(".modal-body").append(inst);
			$('#theModal').modal();
		} else {
			callback(potentail[0]);
			$(".btnHolder").append(this.addButton(potentail[0]));
			$("#tboxActor").val("");
		}
	},
	startBtnList: function () {
		let instance = this;
		for (let d = 0; d < 10; d++) {
			let nameIndex = Math.floor(Math.random() * peeps.length);
			let btn = this.addButton(peeps[nameIndex]).on("click", function(){
				instance.getGifs(this.innerText);
				$("#tboxActor").val("");
			});
			$(".btnHolder").append(btn);
			peeps.splice(nameIndex, 1);
		}
	}
}