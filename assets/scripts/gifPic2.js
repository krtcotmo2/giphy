let peeps = [`Gary Oldman`, `Casey Affleck`, `Leonardo DiCaprio`, `Eddie Redmayne`, `Matthew McConaughey`, `Jean Dujardin`, `Colin Firth`, `Jeff Bridges`, `Forest Whitaker`, `Philip Seymour Hoffman`, `Jamie Foxx`, `Sean Penn`, `Adrien Brody`, `Denzel Washington`, `Russell Crowe`, `Kevin Spacey`, `Roberto Benigni`, `Geoffrey Rush`, `Nicolas Cage`, `Tom Hanks`, `Al Pacino`, `Anthony Hopkins, Sir`, `Jeremy Irons`, `Daniel Day-Lewis`, `Michael Douglas`, `Paul Newman`, `William Hurt`, `F. Murray Abraham`, `Robert Duvall`, `Ben Kingsley`, `Henry Fonda`, `Robert De Niro`, `Dustin Hoffman`, `Jon Voight`, `Richard Dreyfuss`, `Peter Finch`, `Jack Nicholson`, `Art Carney`, `Jack Lemmon`, `Gene Hackman`, `George C. Scott`, `John Wayne`, `Cliff Robertson`, `Rod Steiger`, `Paul Scofield`, `Lee Marvin`, `Rex Harrison`, `Sidney Poitier`, `Gregory Peck`, `Maximilian Schell`, `Burt Lancaster`, `Charlton Heston`, `David Niven`, `Alec Guinness`, `Yul Brynner`, `Ernest Borgnine`, `Marlon Brando`, `William Holden`, `Humphrey Bogart`, `José Ferrer`, `Broderick Crawford`, `Laurence Olivier`, `Ronald Colman`, `Fredric March`, `Ray Milland`, `Bing Crosby`, `Paul Lukas`, `James Cagney`, `Gary Cooper`, `James Stewart`, `Robert Donat`, `Spencer Tracy`, `Paul Muni`, `Victor McLaglen`, `Clark Gable`, `Charles Laugthon`, `Wallace Beery`, `Frederic March`, `Lionel Barrymore`, `George Arliss`, `Warner Baxter`, `Emil Jannings`, `Emma Stone`, `Brie Larson`, `Julianne Moore`, `Cate Blanchett`, `Jennifer Lawrence`, `Natalie Portman`, `Sandra Bullock`, `Kate Winslet`, `Marion Cotillard`, `Helen Mirren Dame`, `Reese Witherspoon`, `Charlize Theron`, `Nicole Kidman`, `Halle Berry`, `Julia Roberts`, `Hilary Swank`, `Gwyneth Paltrow`, `Helen Hunt`, `Frances McDormand`, `Susan Sarandon`, `Jessica Lange`, `Holly Hunter`, `Emma Thompson`, `Kathy Bates`, `Jessica Tandy`, `Jodie Foster`, `Cher`, `Marlee Matlin`, `Geraldine Page`, `Shirley MacLaine`, `Meryl Streep`, `Sissy Spacek`, `Sally Field`, `Diane Keaton`, `Faye Dunaway`, `Louise Fletcher`, `Ellen Burstyn`, `Liza Minnelli`, `Jane Fonda`, `Glenda Jackson`, `Maggie Smith`, `Barbra Streisand`, `Julie Christie`, `Julie Andrews`, `Patricia Neal`, `Anne Bancroft`, `Sophia Loren`, `Elizabeth Taylor`, `Simone Signoret`, `Susan Hayward`, `Joanne Woodward`, `Anna Magnani`, `Grace Kelly`, `Audrey Hepburn`, `Shirley Booth`, `Judy Holliday`, `Jane Wyman`, `Loretta Young`, `Olivia de Havilland`, `Joan Crawford`, `Ingrid Bergman`, `Jennifer Jones`, `Greer Garson`, `Joan Fontaine`, `Ginger Rogers`, `Vivien Leigh`, `Luise Rainer`, `Bette Davis`, `Claudette Colbert`, `Katharine Hepburn`, `Helen Hayes`, `Marie Dressler`, `Norma Shearer`, `Mary Pickford`, `Janet Gaynor`];
let btnList = [];
let favsList = [];

let gifSetter = {
	showingFav: false,
	gifHolder: $(".gifHolder"),

	startBtnList: function () {
		//add 10 buttons from the aray of oscar winners
		for (let d = 0; d < 10; d++) {
			let nameIndex = Math.floor(Math.random() * peeps.length);
			let btn = this.addButton(peeps[nameIndex], 0);
			$(".btnHolder").append(btn);
			peeps.splice(nameIndex, 1);
		}
	},
	addButton: function (nameOnbtn, index) {
		//creates a button for the check name and game start function
		let btn = $(`<button class='btnActor'>${nameOnbtn}</button>`);
		btn.attr({"data-name":nameOnbtn,  "data-page":index});		
		btnList.push(nameOnbtn);
		return btn;
	},
	placeObject: function(arr, reset){
		this.getFavs();
		if(reset || (!reset && this.showingFav == true)){
			this.showingFav = reset;
			this.gifHolder.html("");
			arr = !reset ? arr:favsList;
		}		
		let grpHolder;	
		let obj = this;
		if(arr.length <1 && reset){
			$(".modal-body").html("You do not have any favorites saved.");
			$('#theModal').modal();
			return;
		}
		arr.forEach(function(o, i){
			if(i == 0 || o.actor != arr[i-1].actor){
				grpHolder = $("<div>").append(`<h5>${o.actor}</h5>`);			
			}
			let img = $("<img>").attr("data-ani", o.motion)
				.attr("class", "aGif")
				.attr("data-playing", "false")
				.attr("data-still", o.still)
				.attr("src", o.still);
			//adds gif to the holder
			let isAFav = obj.checkFavs(o.still);
			let theDiv = $("<div class='singleGif'>");				
			let heart = $("<div class='favs'>");
			if(isAFav){
				$(heart).addClass("liked");
			}
			theDiv.append(img);
			theDiv.append(heart);
			grpHolder.append(theDiv);
			//grpHolder.append(img);
			$(".gifHolder").prepend(grpHolder);
		})
	},
	checkFavs: function(url){	
		return favsList.filter(function(o){
			return o.still==url;
		}).length;
	},
	addToFavs: function(btn){
		let favGif = {
			actor: $(btn).parent().parent().find("h5").text(),
			still: $(btn).parent().find("img").data("still"),
			motion: $(btn).parent().find("img").data("ani")
		}
		if(!$(btn).hasClass("liked")){
			favsList = favsList.filter(function(o){
				return o.still != favGif.still;
			})
		}else{
			favsList.push(favGif);
		}
		localStorage.setItem("favItems", JSON.stringify(favsList));
		let s="";
	},
	getFavs: function(){
		favsList = localStorage.getItem("favItems") == undefined ? [] :JSON.parse(localStorage.getItem("favItems"));
		favsList.sort(function(a,b){
			if(a.actor > b.actor){
				return -1;
			}
			if(a.actor < b.actor){
				return 1;
			}
		})		
	}
}

let apiCaller = {
	getGifs: function (arg, offset, holderObj) {
		let limit = 10;
		arg = arg.replace(" ", "+");
		//URL for gif - paramter for query at end
		var queryURL = `https://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&limit=${limit}&offset=${offset*limit}&q=${arg}`;
		//AJAX CALL
		$.ajax({
			url: queryURL,
			method: "GET"
		}).then(function (response) {
			//repalce a + with space in teh event the URL has a + in it - adds to teh screen as a header for the section
			let grpHolder = $("<div>").append(`<h5>${arg.replace("+", " ")}</h5>`);
			let retVal = [];
			response.data.forEach(function (o) {
				//creates object
				let gif = {
					actor: arg.replace("+", " "),
					still: o.images.fixed_height_small_still.url,
					motion: o.images.fixed_height_small.url
				}
				retVal.push(gif);
			});
			//fire function to place objects
			holderObj.placeObject(retVal, false);
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
	checkName: function (theName, match,  callback, holderObj) {
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
			callback(potentail[0], 0, holderObj);
			$(".btnHolder").append(holderObj.addButton(potentail[0], 1));
			$("#tboxActor").val("");
		}
	}
}