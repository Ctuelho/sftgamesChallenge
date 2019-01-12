import { MainMenu } from './modules/mainMenu';
import { CardsChallenge } from './modules/cardsChallenge';

import * as PIXI from 'pixi.js';

let type = "WebGL"
if(!PIXI.utils.isWebGLSupported()){
    type = "canvas"
}

PIXI.utils.sayHello(type);

//path of the images used
const CARDIMAGEPATH = require("./images/magicCard.png");
////localStorage.setItem('magicCard', CARDIMAGEPATH);

//Create a Pixi Application
const app = new PIXI.Application();

app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);

document.body.appendChild(app.view);

//load all images now
//question: make an atlas?

PIXI.loader
        .add("https://i.ibb.co/VJ0Q9C5/magic-Card.png")
        .load(setup);

function setup(){
    let cardsChallenge = new CardsChallenge(
        app, "https://i.ibb.co/VJ0Q9C5/magic-Card.png", 10
   );
   
   cardsChallenge.mountDeck();

   console.log("app from app", app);
}


