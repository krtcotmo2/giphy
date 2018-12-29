let peeps = [`Gary Oldman`, `Casey Affleck`, `Leonardo DiCaprio`, `Eddie Redmayne`, `Matthew McConaughey`, `Jean Dujardin`, `Colin Firth`, `Jeff Bridges`, `Forest Whitaker`, `Philip Seymour Hoffman`, `Jamie Foxx`, `Sean Penn`, `Adrien Brody`, `Denzel Washington`, `Russell Crowe`, `Kevin Spacey`, `Roberto Benigni`, `Geoffrey Rush`, `Nicolas Cage`, `Tom Hanks`, `Al Pacino`, `Anthony Hopkins, Sir`, `Jeremy Irons`, `Daniel Day-Lewis`, `Michael Douglas`, `Paul Newman`, `William Hurt`, `F. Murray Abraham`, `Robert Duvall`, `Ben Kingsley`, `Henry Fonda`, `Robert De Niro`, `Dustin Hoffman`, `Jon Voight`, `Richard Dreyfuss`, `Peter Finch`, `Jack Nicholson`, `Art Carney`, `Jack Lemmon`, `Gene Hackman`, `George C. Scott`, `John Wayne`, `Cliff Robertson`, `Rod Steiger`, `Paul Scofield`, `Lee Marvin`, `Rex Harrison`, `Sidney Poitier`, `Gregory Peck`, `Maximilian Schell`, `Burt Lancaster`, `Charlton Heston`, `David Niven`, `Alec Guinness`, `Yul Brynner`, `Ernest Borgnine`, `Marlon Brando`, `William Holden`, `Humphrey Bogart`, `José Ferrer`, `Broderick Crawford`, `Laurence Olivier`, `Ronald Colman`, `Fredric March`, `Ray Milland`, `Bing Crosby`, `Paul Lukas`, `James Cagney`, `Gary Cooper`, `James Stewart`, `Robert Donat`, `Spencer Tracy`, `Paul Muni`, `Victor McLaglen`, `Clark Gable`, `Charles Laugthon`, `Wallace Beery`, `Frederic March`, `Lionel Barrymore`, `George Arliss`, `Warner Baxter`, `Emil Jannings`, `Emma Stone`, `Brie Larson`, `Julianne Moore`, `Cate Blanchett`, `Jennifer Lawrence`, `Natalie Portman`, `Sandra Bullock`, `Kate Winslet`, `Marion Cotillard`, `Helen Mirren Dame`, `Reese Witherspoon`, `Charlize Theron`, `Nicole Kidman`, `Halle Berry`, `Julia Roberts`, `Hilary Swank`, `Gwyneth Paltrow`, `Helen Hunt`, `Frances McDormand`, `Susan Sarandon`, `Jessica Lange`, `Holly Hunter`, `Emma Thompson`, `Kathy Bates`, `Jessica Tandy`, `Jodie Foster`, `Cher`, `Marlee Matlin`, `Geraldine Page`, `Shirley MacLaine`, `Meryl Streep`, `Sissy Spacek`, `Sally Field`, `Diane Keaton`, `Faye Dunaway`, `Louise Fletcher`, `Ellen Burstyn`, `Liza Minnelli`, `Jane Fonda`, `Glenda Jackson`, `Maggie Smith`, `Barbra Streisand`, `Julie Christie`, `Julie Andrews`, `Patricia Neal`, `Anne Bancroft`, `Sophia Loren`, `Elizabeth Taylor`, `Simone Signoret`, `Susan Hayward`, `Joanne Woodward`, `Anna Magnani`, `Grace Kelly`, `Audrey Hepburn`, `Shirley Booth`, `Judy Holliday`, `Jane Wyman`, `Loretta Young`, `Olivia de Havilland`, `Joan Crawford`, `Ingrid Bergman`, `Jennifer Jones`, `Greer Garson`, `Joan Fontaine`, `Ginger Rogers`, `Vivien Leigh`, `Luise Rainer`, `Bette Davis`, `Claudette Colbert`, `Katharine Hepburn`, `Helen Hayes`, `Marie Dressler`, `Norma Shearer`, `Mary Pickford`, `Janet Gaynor`];
let btnList = [];
let gifSetter = {
	getGifs: function (arg) {
		//URL for gif - paramter for query at end
		arg = arg.replace(" ", "+");
		var queryURL = `https://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&limit=10&q=${arg}`;
		
		//AJAX CALL
		$.ajax({
			url: queryURL,
			method: "GET"
		}).then(function (response) {
			//repalce a + with space in teh event the URL has a + in it - adds to teh screen as a header for the section
			let grpHolder = $("<div>").append(`<h5>${arg.replace("+", " ")}</h5>`);
			response.data.forEach(function (o) {
				//creates image, sets class name and sets the ani and still data values with urls of the two images
				let img = $("<img>").attr("data-ani", o.images.fixed_height_small.url)
				.attr("class", "aGif")
				.attr("data-playing", "false")
				.attr("data-still", o.images.fixed_height_small_still.url)
				.attr("src", o.images.fixed_height_small_still.url);
				//adds gif to the holder
				
				let theDiv = $("<div>");
				let ref = $("<a class='btn btn-danger' role='button'>Download</a>");				
				ref.attr("href", `${o.images["480w_still"].url.split(`?`)[0]}`);
				ref.attr("download", `${arg}.${o.images["480w_still"].url.split(`?`)[0].split("/").pop().split(".").pop()}`);
				
				theDiv.append(img);
				theDiv.append(ref);
				
				grpHolder.append(theDiv);
				$(".gifHolder").prepend(grpHolder);
			});
		}).catch(function (response) {
			//error if the giphy api fails
			$(".modal-body").html("There was an error attempting to get information from Giphy.com.");
			$('#theModal').modal();
		});
	},
	offerOptions: function (arg) {
		//if more than one option matches search criteria add instructions
		$(".modal-body").html("")
		let inst = $("<p>").text(`Several options could match your request. Click one of the buttons below to add the actor/actress or click ok to clsoe the options.`);		
		$(".modal-body").append(inst);
		//loop though the optoions and create abutton for each
		for(let d =0; d<arg.length;d++){			
			let btn = $(`<button class='oneOfMany'>${arg[d]}</button>`);
			$(".modal-body").append(btn);
		}
		//open modal
		$('#theModal').modal();
	},
	addButton: function (nameOnbtn) {
		//creates a button for the check name and game start function
		let btn = $(`<button class='btnActor'>${nameOnbtn}</button>`);
		btn.attr("data-name", nameOnbtn);		
		btnList.push(nameOnbtn);
		return btn;
	},
	checkName: function (theName, match,  callback) {
		let potentail = [];
		peeps.forEach(function (o) {
			//loops thorugh the peeps array and looks for any string that contains the search criteria - match boolean is a trigger to prevent from running
			if (o.toLowerCase().includes(theName) && !match) {
				potentail.push(o);
				person = o;
			}
			//loops thorugh the peeps array and looks for the exact match for the search criteria - match boolean is a trigger to prevent from running
			if (o.toLowerCase() == theName && match) {
				potentail.push(o);
				person = o;
			}
		});
		if (potentail.length == 0) {
			//handle if there is no response
			$(".modal-body").html("")
			let inst = $("<p>").text(`No one with a name similar to ${$("#tboxActor").val().trim()} has won an Oscar`);		
			$(".modal-body").append(inst);
			$('#theModal').modal();
			return;
		} else if (potentail.length > 1) {
			//handle response if there is more than 1 search result
			this.offerOptions(potentail);
			return;
		}
		
		//check to see if the option we are searching for already exists in our list
		if (btnList.indexOf(potentail[0]) > -1) {
			//person exists
			$(".modal-body").html("")
			let inst = $("<p>").text(`Results for ${$("#tboxActor").val().trim()} are already in your list`);		
			$(".modal-body").append(inst);
			$('#theModal').modal();
		} else {
			//person does not exist
			callback(potentail[0]);
			$(".btnHolder").append(this.addButton(potentail[0]));
			$("#tboxActor").val("");
		}
	},
	startBtnList: function () {
		//add 10 buttons from the aray of oscar winners
		for (let d = 0; d < 10; d++) {
			let nameIndex = Math.floor(Math.random() * peeps.length);
			let btn = this.addButton(peeps[nameIndex]);
			$(".btnHolder").append(btn);
			peeps.splice(nameIndex, 1);
		}
	}
}