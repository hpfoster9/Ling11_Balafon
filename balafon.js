var balafonPhrases = phrases;

function insertPhrases() {
  balafonPhrases.forEach(phrase => {

    // Create an Option object
    var opt = document.createElement("option");
    opt.className = "dropdown-item";
    opt.href = "#!";
    // Assign text and value to Option object
    opt.text = phrase.seenku;

    document.getElementById("dropdown-menu").appendChild(opt);
  });
}

function setup() {
  let canvas = createCanvas(1000,500);
  canvas.parent('sketch-holder');
  B = new Balafon(19, 40, 10, 10, 400, 200);
  B.generatePlanks();
  insertPhrases();
}

function draw(){
  clear();
  background(250);
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

		console.log(height_step);
		console.log("in the generate");
		for(let i=0; i<this.num_planks; i++){
			console.log('IN THE FOR');
			console.log(height_step);
			console.log(curr_height);
			var note = tones[(i%tones.length)]+String(Math.floor(((i-1)/tones.length))+1);
			console.log(note);

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

		if(key_map.indexOf(key) != -1) this.planks[key_map.indexOf(key)].clicked = true;
		console.log(this);
	}

	autoplay(notes){
		for(note in notes){
			console.log(note);
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
		console.log("TONE: "+this.tone);
		this.number = number;
		//this.synth = new Tone.Synth().toMaster();

    // must use "python -m SimpleHTTPServer" in order for these files to load
    this.synth = new Tone.Sampler({
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
      "D4" : "./Balafon_Soundfonts/Balafon_mp3_files/18_bip.mp3",
      "F4" : "./Balafon_Soundfonts/Balafon_mp3_files/19_bip.mp3"
    },  () => {
    	//sampler will repitch the closest sample
    	sampler.triggerAttack("A0")
      sampler.triggerAttack("C1")
      sampler.triggerAttack("D1")
      sampler.triggerAttack("F1")
      sampler.triggerAttack("G#1")
      sampler.triggerAttack("A1")
      sampler.triggerAttack("C2")
      sampler.triggerAttack("D2")
      sampler.triggerAttack("F2")
      sampler.triggerAttack("G#2")
      sampler.triggerAttack("A2")
      sampler.triggerAttack("C3")
      sampler.triggerAttack("D3")
      sampler.triggerAttack("F3")
      sampler.triggerAttack("G#3")
      sampler.triggerAttack("D4")
      sampler.triggerAttack("F4")
    }, ).toMaster()

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
		}
	}

	play_note(){
		//play a middle 'C' for the duration of an 8th note
		this.synth.triggerAttackRelease(this.tone, '16n');
		console.log("CLICK: "+this.tone+" note");
	}

}
