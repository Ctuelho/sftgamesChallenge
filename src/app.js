import { Distance2D } from './modules/mathUtil';

import { MainMenu } from './modules/mainMenu';
import { CardsChallenge } from './modules/cardsChallenge';


import * as PIXI from 'pixi.js';

//images
import magicCard from './images/magicCard.png';

let type = "WebGL"
if(!PIXI.utils.isWebGLSupported()){
    type = "canvas"
}
PIXI.utils.sayHello(type);

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
    .add(magicCard)
    .load(setup);

function setup(){
    let cardsChallenge = new CardsChallenge(
        app, magicCard
    );
    cardsChallenge.mount();

    app.ticker.add(delta => gameLoop(delta));

    currentChallenge = cardsChallenge;
}

let currentChallenge = null;

function setChallenge(newChallange){
    
    if(currentChallenge != null){
        currentChallenge.clear();
    }
    if(newChallange != null){
        newChallange.mount();
    }
    currentChallenge = newChallange;
}

function gameLoop(delta){
    if(currentChallenge != null){
        currentChallenge.update(delta);
        app.stage.children.sort(function(a,b) {
            a.zIndex = a.zIndex || 0;
            b.zIndex = b.zIndex || 0;
            return b.zIndex - a.zIndex
        });
    }
}


