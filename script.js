let orbit1Diameter;
let orbit2Diameter;
let orbit3Diameter;
let orbit4Diameter;

// menu controls -- dat gui
let planetSpeed;
let planetScale;
let colorPaletteButton;
let colorPalette = 1;
let particleConfig;
const MAX_MEMBERS = 5000; // members max displayed on GUI

// constants
const DIAMETER_INCREASE = 0.15;
const ORBIT_1_MULTIPLIER = 2.5;
const ORBIT_2_MULTIPLIER = 3.5;
const ORBIT_3_MULTIPLIER = 4.5;
const ORBIT_4_MULTIPLIER = 5.5;

// sets max particles rendered on load -- overridden by any menu edits
const MAX_PARTICLES_DRAWN = 1000; 

// edit these to create your own color scheme! each one corresponds to an expanding level!
const COLOR_PALETTES = [
  {
    1: { r: 33, g: 5, b: 53, a: 1.0 },
    2: { r: 67, g: 13, b: 75, a: 1.0 },
    3: { r: 123, g: 51, b: 125, a: 1.0 },
    4: { r: 200, g: 116, b: 178, a: 1.0 },
  },
  {
    1: { r: 203, g: 229, b: 142, a: 1.0 },
    2: { r: 161, g: 206, b: 63, a: 1.0 },
    3: { r: 16, g: 126, b: 87, a: 1.0 },
    4: { r: 1, g: 71, b: 96, a: 1.0 }
  }
];

const PLANET_COLOR_OFFSET = 110;

let ORBIT_1_COLOR = COLOR_PALETTES[0][1];
let ORBIT_2_COLOR = COLOR_PALETTES[0][2];
let ORBIT_3_COLOR = COLOR_PALETTES[0][3];
let ORBIT_4_COLOR = COLOR_PALETTES[0][4];
let PLANET_1_COLOR = {
  r: ORBIT_1_COLOR.r + PLANET_COLOR_OFFSET,
  g: ORBIT_1_COLOR.g + PLANET_COLOR_OFFSET,
  b: ORBIT_1_COLOR.b + PLANET_COLOR_OFFSET,
  a: 1.0,
};
let PLANET_2_COLOR = {
  r: ORBIT_2_COLOR.r + PLANET_COLOR_OFFSET,
  g: ORBIT_2_COLOR.g + PLANET_COLOR_OFFSET,
  b: ORBIT_2_COLOR.b + PLANET_COLOR_OFFSET,
  a: 1.0,
};
let PLANET_3_COLOR = {
  r: ORBIT_3_COLOR.r + PLANET_COLOR_OFFSET,
  g: ORBIT_3_COLOR.g + PLANET_COLOR_OFFSET,
  b: ORBIT_3_COLOR.b + PLANET_COLOR_OFFSET,
  a: 1.0,
};
let PLANET_4_COLOR = {
  r: ORBIT_4_COLOR.r + PLANET_COLOR_OFFSET,
  g: ORBIT_4_COLOR.g + PLANET_COLOR_OFFSET,
  b: ORBIT_4_COLOR.b + PLANET_COLOR_OFFSET,
  a: 1.0,
};

class Planet {
  constructor(color, orbitLevel) {
    this.color = color;
    this.orbitLevel = orbitLevel;
    this.startAngleOffset = random(50);
    this.xOffset = random(-20, 20) + randomGaussian();
    this.yOffset = random(-20, 20) + randomGaussian();
  }

  drawPlanet() {
    const angleVector = this.computeVector();
    fill(
      `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a})`
    );
    noStroke();
    circle(
      angleVector.x + this.xOffset,
      angleVector.y + this.yOffset,
      planetScale.scale
    );
  }

  computeVector() {
    let diameter = null;
    switch (this.orbitLevel) {
      case 1:
        diameter = orbit1Diameter - 90;
        break;
      case 2:
        diameter = orbit2Diameter - 70;
        break;
      case 3:
        diameter = orbit3Diameter - 60;
        break;
      case 4:
        diameter = orbit4Diameter - 50;
        break;
      default:
        diameter = null;
        console.error("Unable to compute vector -- orbit level is null");
        return;
    }
    return p5.Vector.fromAngle(
      ((millis() * planetSpeed.speed) % 360) + this.startAngleOffset,
      diameter / 2
    );
  }
}
// NB: third key ORBIT_LEVEL_MEMBERS is used to make the GUI more descriptive and is displayed on the tooltip. The members key will modify on user input
let membersAtLevel = [
  {
    members: 68,
    level: 1,
    orbitLevelOneMembers: 68,
  },
  {
    members: 24,
    level: 2,
    orbitLevelTwoMembers: 24,
  },
  {
    members: 400,
    level: 3,
    orbitLevelThreeMembers: 400,
  },
  {
    members: 5000,
    level: 4,
    orbitLevelFourMembers: 5000,
  },
];

let planets = [];

function setProportions(membersAtLevel) {
  const members = [];
  for (let i = 0; i < membersAtLevel.length; i++) {
    members.push(membersAtLevel[i].members);
  }

  let overMaxParticles = false;
  let max = members[0];
  let maxIndex = 0;

  for (let i = 0; i < members.length; i++) {
    if (members[i] > MAX_PARTICLES_DRAWN) overMaxParticles = true;
    // fetch max number and max index
    if (members[i] > max) {
      maxIndex = i;
      max = members[i];
    }
  }

  if (overMaxParticles) {
    const originalProportions = [];
    for (let i = 0; i < members.length; i++) {
      originalProportions.push(members[i] / max);
    }

    // put in proportions capped at MAX_PARTICLES_DRAWN and reload how many members are in the group
    for (let i = 0; i < originalProportions.length; i++) {
      membersAtLevel[i].proportionMembers = Math.round(
        MAX_PARTICLES_DRAWN * originalProportions[i]
      );
    }
  }

  return membersAtLevel;
}

function setupPlanets() {
  // membersAtLevel = setProportions(membersAtLevel);
  for (let i = 0; i < membersAtLevel.length; i++) {
    const members = membersAtLevel[i];
    const memberCount = members.proportionMembers
      ? members.proportionMembers
      : members.members;
    let color;
    if (members.level == 1) {
      color = PLANET_1_COLOR;
    } else if (members.level == 2) {
      color = PLANET_2_COLOR;
    } else if (members.level == 3) {
      color = PLANET_3_COLOR;
    } else if (members.level == 4) {
      color = PLANET_4_COLOR;
    } else {
      color = { r: 255, g: 255, b: 255, a: 1.0 };
    }

    const orbitLevel = [];
    for (let j = 0; j < Math.min(memberCount, particleConfig.maxParticlesDrawn); j++) {
      orbitLevel.push(new Planet(color, members.level));
    }
    planets.push(orbitLevel);
  }
}

class PlanetSpeed {
  constructor() {
    this.speed = 0.00005;
  }
}

class PlanetScale {
  constructor() {
    this.scale = 3;
  }
}

class ParticleConfig {
  constructor () {
    this.maxParticlesDrawn = MAX_PARTICLES_DRAWN;
  }
}

var colorScheme = {
  isGreenPalette: false,
};

// load in google font
let interFont;
function preload() {
  interFont = loadFont('assets/Inter-VariableFont_slnt,wght.ttf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // gui
  let gui = new dat.GUI();
  planetSpeed = new PlanetSpeed();
  planetScale = new PlanetScale();
  particleConfig = new ParticleConfig();

  gui.add(planetSpeed, "speed", 0.00005, 0.0002, 0.00001);
  gui.add(planetScale, "scale", 2, 5, 1);
  gui
    .add(colorScheme, "isGreenPalette")
    .onChange((val) => changeColorPalette(val));
  gui
    .add(membersAtLevel[0], "orbitLevelOneMembers", 0, MAX_MEMBERS, 1)
    .onChange((val) => changeOrbitAmount(0, val));
  gui
    .add(membersAtLevel[1], "orbitLevelTwoMembers", 0, MAX_MEMBERS, 1)
    .onChange((val) => changeOrbitAmount(1, val));
  gui
    .add(membersAtLevel[2], "orbitLevelThreeMembers", 0, MAX_MEMBERS, 1)
    .onChange((val) => changeOrbitAmount(2, val));
  gui
    .add(membersAtLevel[3], "orbitLevelFourMembers", 0, MAX_MEMBERS, 1)
    .onChange((val) => changeOrbitAmount(3, val));
  gui
    .add(particleConfig, "maxParticlesDrawn", 250, 2500, 1)

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

  setupPlanets();
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
  fill(0);
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

function drawOortCloud(startDiameter, rgb, endDiameter) {
  let opacity = 0.0;
  strokeWeight(10);
  for (let i = 0; i < 50; i++) {
    let oortDiameter = startDiameter - (startDiameter / 50) * i;
    if (oortDiameter <= endDiameter) break;
    if (i > 25) {
      opacity = max(opacity - 0.008, 0.0);
    } else {
      opacity += 0.008;
    }
    stroke(`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`);
    noFill();
    circle(0, 0, oortDiameter);
  }
}

function changeOrbitAmount(level, members) {
  membersAtLevel[level].members = members;
  planets = [];
  setupPlanets();
}
// toggle planet colors
function changeColorPalette(colorPalette) {
  if (colorPalette) {
    ORBIT_1_COLOR = COLOR_PALETTES[1][1];
    ORBIT_2_COLOR = COLOR_PALETTES[1][2];
    ORBIT_3_COLOR = COLOR_PALETTES[1][3];
    ORBIT_4_COLOR = COLOR_PALETTES[1][4];
    PLANET_1_COLOR = {
      r: ORBIT_1_COLOR.r + PLANET_COLOR_OFFSET,
      g: ORBIT_1_COLOR.g + PLANET_COLOR_OFFSET,
      b: ORBIT_1_COLOR.b + PLANET_COLOR_OFFSET,
      a: 1.0,
    };
    PLANET_2_COLOR = {
      r: ORBIT_2_COLOR.r + PLANET_COLOR_OFFSET,
      g: ORBIT_2_COLOR.g + PLANET_COLOR_OFFSET,
      b: ORBIT_2_COLOR.b + PLANET_COLOR_OFFSET,
      a: 1.0,
    };
    PLANET_3_COLOR = {
      r: ORBIT_3_COLOR.r + PLANET_COLOR_OFFSET,
      g: ORBIT_3_COLOR.g + PLANET_COLOR_OFFSET,
      b: ORBIT_3_COLOR.b + PLANET_COLOR_OFFSET,
      a: 1.0,
    };
    PLANET_4_COLOR = {
      r: ORBIT_4_COLOR.r + PLANET_COLOR_OFFSET,
      g: ORBIT_4_COLOR.g + PLANET_COLOR_OFFSET,
      b: ORBIT_4_COLOR.b + PLANET_COLOR_OFFSET,
      a: 1.0,
    };
    colorPalette = 2;
  } else {
    ORBIT_1_COLOR = COLOR_PALETTES[0][1];
    ORBIT_2_COLOR = COLOR_PALETTES[0][2];
    ORBIT_3_COLOR = COLOR_PALETTES[0][3];
    ORBIT_4_COLOR = COLOR_PALETTES[0][4];
    PLANET_1_COLOR = {
      r: ORBIT_1_COLOR.r + PLANET_COLOR_OFFSET,
      g: ORBIT_1_COLOR.g + PLANET_COLOR_OFFSET,
      b: ORBIT_1_COLOR.b + PLANET_COLOR_OFFSET,
      a: 1.0,
    };
    PLANET_2_COLOR = {
      r: ORBIT_2_COLOR.r + PLANET_COLOR_OFFSET,
      g: ORBIT_2_COLOR.g + PLANET_COLOR_OFFSET,
      b: ORBIT_2_COLOR.b + PLANET_COLOR_OFFSET,
      a: 1.0,
    };
    PLANET_3_COLOR = {
      r: ORBIT_3_COLOR.r + PLANET_COLOR_OFFSET,
      g: ORBIT_3_COLOR.g + PLANET_COLOR_OFFSET,
      b: ORBIT_3_COLOR.b + PLANET_COLOR_OFFSET,
      a: 1.0,
    };
    PLANET_4_COLOR = {
      r: ORBIT_4_COLOR.r + PLANET_COLOR_OFFSET,
      g: ORBIT_4_COLOR.g + PLANET_COLOR_OFFSET,
      b: ORBIT_4_COLOR.b + PLANET_COLOR_OFFSET,
      a: 1.0,
    };

    colorPalette = 1;
  }
  planets = [];
  setupPlanets();
}

function computeTooltips() {
  const centerWidth = windowWidth / 2;
  const centerHeight = windowHeight / 2;
  // orbit level 1
  if (dist(mouseX, mouseY, centerWidth, centerHeight) < orbit1Diameter / 2) {
    drawTooltip(
      centerWidth,
      centerHeight,
      membersAtLevel[0].orbitLevelOneMembers
    );
  } else if (
    dist(mouseX, mouseY, centerWidth, centerHeight) < orbit2Diameter / 2 &&
    dist(mouseX, mouseY, centerWidth, centerHeight) > orbit1Diameter / 2
  ) {
    drawTooltip(
      centerWidth,
      centerHeight,
      membersAtLevel[1].orbitLevelTwoMembers
    );
  } else if (
    dist(mouseX, mouseY, centerWidth, centerHeight) < orbit3Diameter / 2 &&
    dist(mouseX, mouseY, centerWidth, centerHeight) > orbit2Diameter / 2
  ) {
    drawTooltip(
      centerWidth,
      centerHeight,
      membersAtLevel[2].orbitLevelThreeMembers
    );
  } else if (
    dist(mouseX, mouseY, centerWidth, centerHeight) < orbit4Diameter / 2 &&
    dist(mouseX, mouseY, centerWidth, centerHeight) > orbit3Diameter / 2
  ) {
    drawTooltip(
      centerWidth,
      centerHeight,
      membersAtLevel[3].orbitLevelFourMembers
    );
  }
}

// hover tooltip that displays member count for each orbit level
function drawTooltip(centerWidth, centerHeight, txt) {
  fill("#000000");
  rect(mouseX - centerWidth, mouseY - centerHeight, 180, 50, 10);
  fill(255);
  textFont(interFont);
  textSize(24);
  text(
    "Members: " + txt,
    mouseX - centerWidth + 10,
    mouseY - centerHeight + 30
  );
}

function drawOrganizationTitle (orgName) {
  fill(255);
  push();
  translate(-windowWidth / 2, -windowHeight / 2);
  textFont(interFont);
  textSize(72);
  text(orgName, windowWidth * .005, windowHeight * .1)
  pop();
}

function draw() {
  drawBackground();
  drawOortCloud(orbit4Diameter, ORBIT_4_COLOR, orbit3Diameter);
  drawOortCloud(orbit3Diameter, ORBIT_3_COLOR, orbit2Diameter);
  drawOortCloud(orbit2Diameter, ORBIT_2_COLOR, orbit1Diameter);
  drawOortCloud(orbit1Diameter, ORBIT_1_COLOR, 0);
  drawSun();
  drawOrganizationTitle("MY COMMUNITY")
  computeTooltips();

  for (let i = 0; i < planets.length; i++) {
    let ring = planets[i];
    for (let j = 0; j < ring.length; j++) {
      let planet = planets[i][j];
      planet.drawPlanet();
    }
  }
}

