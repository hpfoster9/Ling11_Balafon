function setup(){
  createCanvas(1000,800);
  B = new Balafon(19, 40, 10, 10, 400, 200);
  B.generatePlanks();
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
		this.synth = new Tone.Synth().toMaster();

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