function ThunderBolt(start, end) {
  this.segments = [new LineSegment(start, end)]
  this.depth = 2;
  this.midpointOffset = 0.3;
  
  this.Draw = function() {
    for(var i=0; i<this.segments.length; ++i) {
      this.segments[i].Draw()
    }
  }
  
  this.Iterate = function() {
    var midpointOffset = this.midpointOffset;
    for(var i = 0; i<this.depth; ++i) {
      var newSegments = []
      for(var j=0; j<this.segments.length; ++j) {
        var ls = this.segments[j];
        var midpoint = ls.GetMidpoint();
        var normal = ls.GetNormal();
        normal.mult(random(-midpointOffset, midpointOffset));
        midpoint.add(normal);
        newSegments.push(new LineSegment(ls.Start, midpoint));
        newSegments.push(new LineSegment(midpoint, ls.End));
        
        if(random(1) < 0.5) {
          var direction = p5.Vector.sub(midpoint, ls.End);
          direction.rotate(random(5, 95));
          var splitEnd = p5.Vector.add(
            p5.Vector.mult(
              direction,
              random(0.3, 0.7)),
            ls.End);
          newSegments.push(new LineSegment(midpoint, splitEnd));
        }
      }
      this.segments = newSegments;
      midpointOffset /= 1.2;
    }
  }
}

function LineSegment(start, end) {
  this.Start = start;
  this.End = end;
  
  this.GetMidpoint = function() {
    return new p5.Vector.mult(p5.Vector.add(this.Start, this.End), 0.5);
  }
  
  this.GetNormal = function() {
    var diffVec = p5.Vector.sub(this.Start, this.End);
    return createVector(-diffVec.y, diffVec.x);
  }
  
  this.Draw = function() {
    line(this.Start.x, this.Start.y, this.End.x, this.End.y);
  }
}

var bolt;

function setup() {
  createCanvas(600, 600);
  frameRate(10);
  background(0)
}

function draw() {
 if(frameCount % 20 == 1) {
   pStart = createVector(random(50, width - 50), 50);
   pEnd = createVector(random(50, width - 50), height - 50);
   bolt = new ThunderBolt(pStart, pEnd);
 }
 if(frameCount % 5 == 1) {
    background(color(0, random(10), random(100)));
    stroke(color(random(200, 255), random(200, 255), random(200, 255)));
    bolt.Iterate();
    bolt.Draw();
 }
}