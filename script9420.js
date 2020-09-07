let orbit1Diameter;
let orbit2Diameter;
let orbit3Diameter;
let orbit4Diameter;

// constants
const DIAMETER_INCREASE = 0.15;
const ORBIT_1_MULTIPLIER = 2.5;
const ORBIT_2_MULTIPLIER = 3.5;
const ORBIT_3_MULTIPLIER = 4.5;
const ORBIT_4_MULTIPLIER = 5.5;

class Planet {
  constructor(
    color,
    memberCount,
    orbitLevel,
    startAngleOffset,
    randomXOffset,
    randomYOffset
  ) {
    this.color = color;
    this.memberCount = memberCount;
    this.orbitLevel = orbitLevel;
    this.startAngleOffset = startAngleOffset;
    this.randomXOffset = randomXOffset;
    this.randomYOffset = randomYOffset;
  }

  drawPlanet(angleVector) {
    fill(this.color);
    noStroke();
    circle(
      angleVector.x + this.randomXOffset,
      angleVector.y + this.randomYOffset,
      10 * this.memberCount
    );
  }

  drawCluster(planets) {
    const angleVector = this.computeVector(tick);
    for (let i = 0; i < planets.length; i++) {
      this.drawPlanet(angleVector);
    }
  }

  computeVector(tick) {
    let diameter = null;
    switch (this.orbitLevel) {
      case 1:
        diameter = orbit1Diameter;
        break;
      case 2:
        diameter = orbit2Diameter;
        break;
      case 3:
        diameter = orbit3Diameter;
        break;
      case 4:
        diameter = orbit4Diameter;
        break;
      default:
        diameter = null;
        console.error("Unable to compute vector -- orbit level is null");
        return;
    }
    return p5.Vector.fromAngle(
      (tick * 0.0003 + this.startAngleOffset) % 360,
      diameter / 2
    );
  }
}

const setupCluster = (digitsArr) => {
  for (let i = 0; i < digitsArr.length; i++) {
    let planets = digitsArr[i];
    if (planets.length != 0) {
      // these two are used to compute the ghost center of the cluster
      let memberCount = planets[0].memberCount;
      let planetsCount = planets.length;
      let radius = 70 / memberCount;
      let degree = (360 / planetsCount);

      let vect = p5.Vector.fromAngle(
        (millis() * 0.0003) % 360,
        orbit1Diameter / 2
      )

      for (let j = 0; j < planets.length; j++) {
        noStroke();
        fill(255 / memberCount, 255 / memberCount, 255 / memberCount);
        circle(
          cos(radians(degree * j + 90)) * radius + vect.x,
          sin(radians(degree * j + 90)) * radius + vect.y,
          6 * memberCount
        );
      }
    }
  }
  // for (const [key, val] of Object.entries(digitsArr)) {
  //   if (val.length != 0) {
  //     console.log(val);
  //   }
  // }
};

const membersAtLevel = [
  {
    members: 0,
    level: 1,
  },
  {
    members: 0,
    level: 2,
  },
  {
    members: 0,
    level: 3,
  },
  {
    members: 19593,
    level: 4,
  },
];

let orbitLevels = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  orbit1Diameter = min(
    windowWidth * ORBIT_1_MULTIPLIER * DIAMETER_INCREASE,
    windowHeight * ORBIT_1_MULTIPLIER * DIAMETER_INCREASE
  );
  orbit2Diameter = min(
    windowWidth * ORBIT_2_MULTIPLIER * DIAMETER_INCREASE,
    windowHeight * ORBIT_2_MULTIPLIER * DIAMETER_INCREASE
  );
  orbit3Diameter = min(
    windowWidth * ORBIT_3_MULTIPLIER * DIAMETER_INCREASE,
    windowHeight * ORBIT_3_MULTIPLIER * DIAMETER_INCREASE
  );
  orbit4Diameter = min(
    windowWidth * ORBIT_4_MULTIPLIER * DIAMETER_INCREASE,
    windowHeight * ORBIT_4_MULTIPLIER * DIAMETER_INCREASE
  );

  for (let i = 0; i < membersAtLevel.length; i++) {
    let members = membersAtLevel[i].members;
    let membersStr = members.toString(); // for example 241 -- all digits in a string
    let tens = membersStr.length; // split into each digit by tens
    let orbitLevel = [];
    for (let j = 0; j < membersStr.length; j++) {
      let planets = [];
      for (let k = 0; k < Number(membersStr[j]); k++) {
        planets.push(
          new Planet(
            `rgba(${random(0)}, ${random(0)}, ${random(255)}, 1)`,
            tens,
            membersAtLevel[i].level,
            random(1),
            0,
            0
          )
        );
      }
      orbitLevel.push(planets);
      tens--;
    }
    orbitLevels.push(orbitLevel);
  }

  // console.log(orbitLevels)
}

const interpolating = false;
let drawCount = 0;

function drawBackground() {
  // background
  translate(windowWidth / 2, windowHeight / 2);
  background(0);
}

function drawSun() {
  // sun
  noStroke();
  fill(255, 204, 0);
  circle(0, 0, 70);
  fill("rgba(255, 204, 0, 0.2)");
  circle(0, 0, 80);
}

function drawOrbitLines() {
  // orbit lines
  noFill();
  stroke("rgba(255, 255, 255, 0.6)");
  circle(0, 0, orbit1Diameter);
  circle(0, 0, orbit2Diameter);
  circle(0, 0, orbit3Diameter);
  circle(0, 0, orbit4Diameter);
}

function draw() {
  if (!interpolating) {
    drawBackground();
    drawSun();
    drawOrbitLines();

    for (let i = 0; i < orbitLevels.length; i++) {
      setupCluster(orbitLevels[i]);
    }
  } else {
    if (drawCount > 500) {
      noLoop();
    }

    drawBackground();
    drawOrbitLines();

    let orbitPos = lerp(
      orbit4Diameter / 2,
      orbit3Diameter / 2,
      drawCount / 500
    );

    fill(255, 0, 255);
    noStroke();
    let planet4Vec = p5.Vector.fromAngle(
      (millis() * 0.0003 + 115) % 360,
      orbitPos
    );
    circle(planet4Vec.x, planet4Vec.y, 45);
    drawCount++;
  }
}

// TODO refactor
function stopAndLerp() {
  while (drawCount < 5000) {
    translate(windowWidth / 2, windowHeight / 2);
    background(0);
    noStroke();
    fill(255, 204, 0);
    // orbit lines
    noFill();
    stroke("rgba(255, 255, 255, 0.6)");
    circle(0, 0, orbit1Diameter);
    circle(0, 0, orbit2Diameter);
    circle(0, 0, orbit3Diameter);
    circle(0, 0, orbit4Diameter);

    let orbitPos = lerp(
      orbit4Diameter / 2,
      orbit3Diameter / 2,
      drawCount / 5000
    );

    fill(255, 0, 255);
    noStroke();
    let planet4Vec = p5.Vector.fromAngle(
      (millis() * 0.0003 + 115) % 360,
      orbitPos
    );
    circle(planet4Vec.x, planet4Vec.y, 70);
    drawCount++;
  }
}
