//Aliases:
let Container = PIXI.Container
let autoDetectRenderer = PIXI.autoDetectRenderer;
let loader = PIXI.loader;
let TextureCache = PIXI.utils.TextureCache;
let resources = PIXI.loader.resources;
let Sprite = PIXI.Sprite;

//build WEBGL or Canvas renderer:
let scene = new Container();

let renderer = autoDetectRenderer(256, 356);
renderer.resize(window.innerWidth * (2 / 3), window.innerHeight / 2);

/*
renderer.backgroundColor = 0x061639;
*/

let canvasEl = document.getElementById('canvas');
canvasEl.appendChild(renderer.view);


//load an image and run `setup` function when it's done:

loader
    .add("natureImage", 'img/nature-q-c-640-480-10.jpg')
    .add("img/wsj_iconography.json")
    .add('gameSprite', 'img/tileset.png')
    .add("chipImage", 'img/BN-UW287_2M3uT_G_20170829105455.jpg')
    .add('vid/australia_boom_banner_full_lq.mp4')
    .on("progress", loadProgressHandler)
    .load(setup);

var dungeon, explorer, state, treasure, door, id;

function setup() {
    //attempt to load video:
    var videoTexture = PIXI.Texture.fromVideo('vid/australia_boom_banner_full_lq.mp4');
    var videoSprite = new Sprite(videoTexture);
    scene.addChild(videoSprite);

    //load & resize just an image:
    var chips = new Sprite(resources.chipImage.texture);
    chips.position.set(600, 400);
    chips.width = 450;
    chips.height = 300;
    chips.scale.set(0.3, 0.3);
    //Note: Changing anchor position resets the images position over the anchor (top L corner):
    chips.anchor.x = 0.5;
    chips.anchor.y = 0.5;
    chips.rotation = 0.5;

    //game stuff:
    //shorthand the id loader:
    let id = PIXI.loader.resources["img/wsj_iconography.json"].textures;

    //create rectangular frame for sprite:
    var rectangle = new PIXI.Rectangle(192, 128, 64, 64);
    var explorerImg = id['explorer.png'];

    //explorerImg.frame = rectangle;
    explorer = new Sprite(explorerImg);
    explorer.position.set(32, 32);
    //velocity vals:
    explorer.vx = 0;
    explorer.vy = 0;
    scene.addChild(explorer);
    scene.addChild(chips);
    //buttons:

    //Capture the keyboard arrow keys
    var left = keyboard(37),
        up = keyboard(38),
        right = keyboard(39),
        down = keyboard(40);

    //Left arrow key `press` method
    left.press = function() {

        //Change the cat's velocity when the key is pressed
        explorer.vx = -5;
        explorer.vy = 0;
    };

    //Left arrow key `release` method
    left.release = function() {

        //If the left arrow has been released, and the right arrow isn't down,
        //and the explorer isn't moving vertically:
        //Stop the explorer
        if (!right.isDown && explorer.vy === 0) {
            explorer.vx = 0;
        }
    };

    //Up
    up.press = function() {
        explorer.vy = -5;
        explorer.vx = 0;
    };
    up.release = function() {
        if (!down.isDown && explorer.vx === 0) {
            explorer.vy = 0;
        }
    };

    //Right
    right.press = function() {
        explorer.vx = 5;
        explorer.vy = 0;
    };
    right.release = function() {
        if (!left.isDown && explorer.vy === 0) {
            explorer.vx = 0;
        }
    };

    //Down
    down.press = function() {
        explorer.vy = 5;
        explorer.vx = 0;
    };
    down.release = function() {
        if (!up.isDown && explorer.vx === 0) {
            explorer.vy = 0;
        }
    };

    renderer.render(scene);
    //set the game state:
    state = play;

    //Start the game loop

    gameLoop();

};

//KEYBOARD HANDLER (needs to be modularized and imported):

function keyboard(keyCode) {
    var key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = function(event) {
        if (event.keyCode === key.code) {
            if (key.isUp && key.press) key.press();
            key.isDown = true;
            key.isUp = false;
        }
        event.preventDefault();

    };

    //The `upHandler`
    key.upHandler = function(event) {
        if (event.keyCode === key.code) {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
        }
        event.preventDefault();
    };
    //Attach event listeners
    window.addEventListener(
        "keydown", key.downHandler.bind(key), false
    );
    window.addEventListener(
        "keyup", key.upHandler.bind(key), false
    );
    return key;
}



//LOOPS AND STATE:
function gameLoop() {

    //Loop this function at 60 frames per second
    requestAnimationFrame(gameLoop);

    state();

    //Render the stage to see the animation
    renderer.render(scene);
};

function play() {

    //Move the cat 1 pixel to the right each frame

    explorer.x += explorer.vx;
    explorer.y += explorer.vy;
};


function loadProgressHandler(loader, resource) {

    //This is really cool, could use this as the basis for creating a loading progress animation...
    console.log("loading:", resource.url, loader.progress + "%");
    /*    console.log("objs:", resource, loader);*/
};