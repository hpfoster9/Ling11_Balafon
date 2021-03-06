//python -m SimpleHTTPServer
var bg;

var synth = new Tone.Sampler({
    	"A0" : "./Balafon_Soundfonts/Balafon_mp3_files/3_bip.mp3",
      "C1" : "./Balafon_Soundfonts/Balafon_mp3_files/4_bip.mp3",
      "D1" : "./Balafon_Soundfonts/Balafon_mp3_files/5_bip.mp3",
      "F1" : "./Balafon_Soundfonts/Balafon_mp3_files/6_bip.mp3",
      "G#1" : "./Balafon_Soundfonts/Balafon_mp3_files/7_bip.mp3",
      "A1" : "./Balafon_Soundfonts/Balafon_mp3_files/8_bip.mp3",
      "C2" : "./Balafon_Soundfonts/Balafon_mp3_files/9_bip.mp3",
      "D2" : "./Balafon_Soundfonts/Balafon_mp3_files/10_bip.mp3",
      "F2" : "./Balafon_Soundfonts/Balafon_mp3_files/11_bip.mp3",
      "G#2" : "./Balafon_Soundfonts/Balafon_mp3_files/12_bip.mp3",
      "A2" : "./Balafon_Soundfonts/Balafon_mp3_files/13_bip.mp3",
      "C3" : "./Balafon_Soundfonts/Balafon_mp3_files/14_bip.mp3",
      "D3" : "./Balafon_Soundfonts/Balafon_mp3_files/15_bip.mp3",
      "F3" : "./Balafon_Soundfonts/Balafon_mp3_files/16_bip.mp3",
      "G#3" : "./Balafon_Soundfonts/Balafon_mp3_files/17_bip.mp3",
      "A3" : "./Balafon_Soundfonts/Balafon_mp3_files/18_bip.mp3",
      "C4" :"./Balafon_Soundfonts/Balafon_mp3_files/19_bip.mp3",
      "D4" : "./Balafon_Soundfonts/Balafon_mp3_files/20_bip.mp3",
    },  () => {
    	//sampler will repitch the closest sample
    }, ).toMaster();

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
var balafonPhrases = phrases;
var clearQueue = setInterval(function(){ document.getElementById("queue").innerHTML = "" }, 1500);

function insertPhrases() {
  console.log("inserted phrases");
  balafonPhrases.forEach(phrase => {

    // Create an Option object
    var opt = document.createElement("option");
    opt.className = "dropdown-item";
    opt.href = "#!";
    // Assign text and value to Option object
    opt.text = phrase.english;
    opt.onclick = function(){B.autoplay(phrase.notes)};
    document.getElementById("dropdown-menu").appendChild(opt);
  });
}

function updatePhrase(tone){
	clearTimeout(clearQueue);
	let phrase = document.getElementById("queue").innerHTML;
	document.getElementById("queue").innerHTML = phrase+" "+tone;
	checkForCompletePhrase();
	clearQueue = setInterval(function(){ document.getElementById("queue").innerHTML = "" }, 1500);
}

function checkForCompletePhrase(){
	let curr_phrase = document.getElementById("queue").innerHTML;
	let curr_phrase_array = curr_phrase.split(" ");
	let max = -1;
	for(i in curr_phrase_array){
		let note = curr_phrase_array[i].split("");
		let octave = parseInt(note[1]);
		if(octave > max) max = octave;
	}
	print("MAX: "+max);
	var maxString = max.toString();
	var reMax = new RegExp(max.toString(), 'g');
	var reMin = new RegExp((max-1).toString(), 'g');

	normalized_phrase = curr_phrase.replace(reMin, "0").replace(reMax, "1");

	for(p in balafonPhrases){
		let accepted_phrase_multi = balafonPhrases[p].notes.slice();
		let accepted_phrase = [];
		let accepted_phrase_array = [];

		for(n in accepted_phrase_multi){
			console.log("MULTI");
			console.log(accepted_phrase_multi[n]);
			accepted_phrase = accepted_phrase.concat(accepted_phrase_multi[n]);
		}
		console.log(accepted_phrase);
		for(n in accepted_phrase){
			if(accepted_phrase[n] != 1 && accepted_phrase[n] != 2){
				let note = accepted_phrase[n].join("");
				accepted_phrase_array.push(note);
			}
		}
		accepted_phrase_string = accepted_phrase_array.join(" ");
		
		if(normalized_phrase.trim() === accepted_phrase_string.trim()){
			console.log("FOUND A MATCH");
			console.log(balafonPhrases[p].seenku);
			document.getElementById("queue").innerHTML = "You just played: "+balafonPhrases[p].english;
		}
		else{
			console.log("normal: "+normalized_phrase);
			console.log("accepted: "+accepted_phrase_string);
		}
		
	}
}

function setup() {
  let canvas = createCanvas(900,450);
  canvas.parent('sketch-holder');
  bg = loadImage('./light-background.png')
  B = new Balafon(19, 40, 10, 10, 400, 200);
  B.generatePlanks();
  insertPhrases();
}

function draw(){
  clear();
  background(bg);
  B.draw();
}

function mousePressed(){
	B.press();
}

function mouseReleased(){
	B.release();
}

function keyPressed() {
	var key = String.fromCharCode(keyCode).toLowerCase();
	B.key_press(key);
}

class Balafon{
	constructor(num_planks, plank_width, start_x, start_y, max_height, min_height){
		this.num_planks = num_planks;
		this.plank_width = plank_width;
		this.start_x = start_x;
		this.start_y = start_y;
		this.max_height = max_height;
		this.min_height = min_height;
		this.planks = [];
	}

	generatePlanks(){
		var height_step = (this.max_height-this.min_height)/this.num_planks;
		var curr_height = this.max_height;
		var curr_x = this.start_x;
		var curr_y = this.start_y;
		var end_x = this.start_x+this.plank_width;
		var end_y = this.start_y+curr_height;
		var tones = ["A", "C", "D", "F", "G#"];
		var key_map = ["q","w","e","r","t","y","u","i","o","p","a","s","d","f","g","h","j","k","l"];

		for(let i=0; i<this.num_planks; i++){
			var note = tones[(i%tones.length)]+String(Math.floor(((i-1)/tones.length))+1);

			this.planks.push(new Plank(curr_x, curr_y, end_x, end_y, note, i, key_map[i]));

			curr_height = curr_height-height_step;

		  curr_y = curr_y + height_step/2;
			curr_x = curr_x + this.plank_width+5;
			end_x = curr_x + this.plank_width;
			end_y = end_y - height_step/2;


		}
	}

	draw(){
		for(var p in this.planks){
			this.planks[p].draw();
		}
	}

	press(){
		for(var p in this.planks){
			this.planks[p].press();
		}
	}

	release(){
		for(var p in this.planks){
			this.planks[p].clicked = false;
		}
	}

	key_press(key){
		var key_map = ["q","w","e","r","t","y","u","i","o","p","a","s","d","f","g","h","j","k","l"];

		if(key_map.indexOf(key) != -1){
			this.planks[key_map.indexOf(key)].clicked = true;
			updatePhrase(this.planks[key_map.indexOf(key)].tone);
		}

	}

	clickPlank(tone){
		for(var p in this.planks){
			console.log(p);
			if(this.planks[p].tone == tone){
				this.planks[p].clicked = true;
			}
		}
	}

	async autoplay(notes){
		updatePhrase("Notes: ");
		for(var i=0; i<notes.length; i++){
			let note_group = notes[i];
			let num_notes = note_group[0]
			if(num_notes == 1){
				let note = note_group[1];
				let letter = note[0]
				let octave = note[1]+2;
				let tone = letter+octave.toString();

				console.log("AUTOPLAYED");
				console.log(tone);
				this.clickPlank(tone);
				updatePhrase(tone);
				await sleep(200);
			}
			else{
				console.log(num_notes);
				let note1 = note_group[1];
				let letter1 = note1[0]
				let octave1 = note1[1]+2;
				let tone1 = letter1+octave1.toString();

				let note2 = note_group[2];
				let letter2 = note2[0]
				let octave2 = note2[1]+2;
				let tone2 = letter2+octave2.toString();

				this.clickPlank(tone1);
				updatePhrase(tone1);
				await sleep(100);
				this.clickPlank(tone2);
				updatePhrase(tone2);
				await sleep(200);

			}
			// let letter = note[1];
			// let octave = note[2]+2;
			// let tone = letter+octave.toString();
			// console.log("AUTOPLAYED");
			// this.clickPlank(tone);
			// await sleep(200);
		}
	}
}

class Plank{
	constructor(start_x, start_y, end_x, end_y, tone, number, key){
		this.start_x = start_x;
		this.start_y = start_y;
		this.end_x = end_x;
		this.end_y = end_y;
		this.tone = tone;
		this.key = key;
		this.number = number;
		//this.synth = new Tone.Synth().toMaster();



		if((number+1)%5==0){
			this.color = {
				R: Math.floor((Math.random() * 30) + 70)*2,
				G: Math.floor((Math.random() * 20) + 30)*2,
				B: Math.floor((Math.random() * 20) + 30)*2
			}
		}
		else{
			this.color = {
				R: Math.floor((Math.random() * 30) + 70)*1.3,
				G: Math.floor((Math.random() * 20) + 30)*1.3,
				B: Math.floor((Math.random() * 20) + 30)*1.3
			}
		}
		this.clicked = false;
	}
	mouseInRect(){
		return (mouseX > this.start_x && mouseX < this.end_x && mouseY > this.start_y && mouseY < this.end_y);
	}

	draw(){
		noStroke();

		if(this.clicked){
			fill(this.color.R/.5, this.color.G/.5, this.color.B/.5);
			this.play_note();
			this.clicked=false;
		}
		else if(this.mouseInRect()){
			fill(this.color.R/1.3, this.color.G/1.3, this.color.B/1.3);
		}
		else{
			fill(this.color.R, this.color.G, this.color.B);
		}
		rect(this.start_x, this.start_y, this.end_x-this.start_x, this.end_y-this.start_y, 5);

		fill(255);
		textSize(20);

		textAlign(CENTER);

		//Key
  		text(String(this.key), this.start_x, this.end_y-30, this.end_x-this.start_x, 30);

  		//Number
  		text(String(this.tone), this.start_x, this.end_y-60, this.end_x-this.start_x, 30);


	}

	press(){
		if(this.mouseInRect()){
			this.clicked = true;
			updatePhrase(this.tone);
		}
	}

	play_note(){
		//play a middle 'C' for the duration of an 8th note
		synth.triggerAttackRelease(this.tone, '16n');
		console.log("CLICK: "+this.tone+" note");
	}

}
