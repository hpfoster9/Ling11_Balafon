
function setup(){
  createCanvas(1000,800);
  B = new Balafon(20, 30, 10, 10, 400, 200);
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
		console.log(height_step);
		console.log("in the generate");
		for(let i=0; i<this.num_planks; i++){
			console.log('IN THE FOR');
			console.log(height_step);
			console.log(curr_height);
			this.planks.push(new Plank(curr_x, curr_y, end_x, end_y, "A2"));
			
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
	constructor(start_x, start_y, end_x, end_y, tone){
		this.start_x = start_x;
		this.start_y = start_y;
		this.end_x = end_x;
		this.end_y = end_y;
		this.tone = tone;
		this.color = {
			R: Math.floor((Math.random() * 30) + 70),
			G: Math.floor((Math.random() * 20) + 30),
			B: Math.floor((Math.random() * 20) + 30)
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
	}

	press(){
		if(this.mouseInRect){
			this.clicked = true;
		}
	}

		
}