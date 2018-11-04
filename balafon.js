

function setup(){
  createCanvas(1000,800);
  B = new Balafon(19, 40, 10, 10, 400, 200);
  B.generatePlanks();
  console.log(B);
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

var sampler = new Tone.Sampler({
	"C3" : "./Balafon_Soundfonts/Balafon/samples/Audio 1_bip.mp3",
	"D#3" : "./Balafon_Soundfonts/Balafon/samples/Audio 2_bip.mp3",
	"F#3" : "./Balafon_Soundfonts/Balafon/samples/Audio 3_bip.mp3",
	"A3" : "./Balafon_Soundfonts/Balafon/samples/Audio 4_bip.mp3",
  "A3" : "./Balafon_Soundfonts/Balafon/samples/Audio 5_bip.mp3",
  "A3" : "./Balafon_Soundfonts/Balafon/samples/Audio 6_bip.mp3",
  "A3" : "./Balafon_Soundfonts/Balafon/samples/Audio 7_bip.mp3",
  "A3" : "./Balafon_Soundfonts/Balafon/samples/Audio 8_bip.mp3",
  "A3" : "./Balafon_Soundfonts/Balafon/samples/Audio 9_bip.mp3",
  "A3" : "./Balafon_Soundfonts/Balafon/samples/Audio 10_bip.mp3",
  "A3" : "./Balafon_Soundfonts/Balafon/samples/Audio 11_bip.mp3",
  "A3" : "./Balafon_Soundfonts/Balafon/samples/Audio 12_bip.mp3",
  "A3" : "./Balafon_Soundfonts/Balafon/samples/Audio 13_bip.mp3",
  "A3" : "./Balafon_Soundfonts/Balafon/samples/Audio 14_bip.mp3",
  "A3" : "./Balafon_Soundfonts/Balafon/samples/Audio 15_bip.mp3",
  "A3" : "./Balafon_Soundfonts/Balafon/samples/Audio 16_bip.mp3",
  "A3" : "./Balafon_Soundfonts/Balafon/samples/Audio 17_bip.mp3",
  "A3" : "./Balafon_Soundfonts/Balafon/samples/Audio 18_bip.mp3",
  "A3" : "./Balafon_Soundfonts/Balafon/samples/Audio 19_bip.mp3",
  "A3" : "./Balafon_Soundfonts/Balafon/samples/Audio 20_bip.mp3",
}, function(){
	//sampler will repitch the closest sample
	sampler.triggerAttack("C3")
  sampler.triggerAttack("D#3")
  sampler.triggerAttack("F#3")
  sampler.triggerAttack("A3")
  sampler.triggerAttack("D3")
  sampler.triggerAttack("D3")
  sampler.triggerAttack("D3")
  sampler.triggerAttack("D3")
  sampler.triggerAttack("D3")
  sampler.triggerAttack("D3")
  sampler.triggerAttack("D3")
  sampler.triggerAttack("D3")
  sampler.triggerAttack("D3")
  sampler.triggerAttack("D3")
  sampler.triggerAttack("D3")
  sampler.triggerAttack("D3")
  sampler.triggerAttack("D3")
  sampler.triggerAttack("D3")
})

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

		console.log(height_step);
		console.log("in the generate");
		for(let i=0; i<this.num_planks; i++){
			console.log('IN THE FOR');
			console.log(height_step);
			console.log(curr_height);
			var note = tones[(i%tones.length)]+String(Math.floor(((i-1)/tones.length))+1);
			console.log(note);

			this.planks.push(new Plank(curr_x, curr_y, end_x, end_y, note, i));

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

}

class Plank{
	constructor(start_x, start_y, end_x, end_y, tone, number){
		this.start_x = start_x;
		this.start_y = start_y;
		this.end_x = end_x;
		this.end_y = end_y;
		this.tone = tone;
		console.log("TONE: "+this.tone);
		this.number = number;
		this.synth = new Tone.Synth().toMaster();

		if((number+1)%5==0){
			this.color = {
				R: Math.floor((Math.random() * 30) + 70)*1.75,
				G: Math.floor((Math.random() * 20) + 30)*1.75,
				B: Math.floor((Math.random() * 20) + 30)*1.75
			}
		}
		else{
			this.color = {
				R: Math.floor((Math.random() * 30) + 70),
				G: Math.floor((Math.random() * 20) + 30),
				B: Math.floor((Math.random() * 20) + 30)
			}
		}
		this.clicked = false;
	}
	mouseInRect(){
		return (mouseX > this.start_x && mouseX < this.end_x && mouseY > this.start_y && mouseY < this.end_y);
	}

	draw(){
		noStroke();
		if(this.mouseInRect()){
			if(this.clicked){
				fill(this.color.R/2, this.color.G/2, this.color.B/2);
				this.play_note();
				this.clicked=false;
			}
			else{
				fill(this.color.R/1.3, this.color.G/1.3, this.color.B/1.3);
			}
			console.log("in! "+this.start_x);

		}
		else{
			fill(this.color.R, this.color.G, this.color.B);
		}
		rect(this.start_x, this.start_y, this.end_x-this.start_x, this.end_y-this.start_y, 5);

		fill(255);
  		text(this.number, this.start_x+this.plank_width-10, this.end_y-10);
	}

	press(){
		if(this.mouseInRect){
			this.clicked = true;
		}
	}

	play_note(){
		//play a middle 'C' for the duration of an 8th note
		this.synth.triggerAttackRelease(this.tone, '8n');
		console.log("CLICK: "+this.tone+" note");
	}


}
