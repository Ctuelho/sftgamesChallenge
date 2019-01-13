import { CustomButton } from './modules/customButton';
import { CardsChallenge } from './modules/cardsChallenge';
import { TextChallenge } from './modules/textChallenge';
import { ParticlesChallenge } from './modules/particlesChallenge';

import * as PIXI from 'pixi.js';

//images
import magicCard from './images/magicCard.png';
import fireParticle from './images/fireParticle.png';
import textureButton from './images/textureButton.png';
import textureButtonDown from './images/textureButtonDown.png';
import textureButtonOver from './images/textureButtonOver.png';
import thinking from './images/thinking.png'; 
import shocked from './images/shocked.png';

//Create a Pixi Application
const app = new PIXI.Application();

let currentChallenge = null;

let cardsButton = null;
let textButton = null;
let particlesButton = null;
let backButton = null;
let fps = new PIXI.Text('FPS',{fontFamily : 'Arial', fontSize: 24, fill : 0xff1010, align : 'center'});
let words = [
    "sun", "moon", "happy", "soft", "games", "pokemon", "zelda", "dark", "souls", "dragon", "gold", "diamond",
    "good", "evil", "wow", "flower", "sword", "love"
];

app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";

document.body.appendChild(app.view);

//load all images now
//question: make an atlas?
PIXI.loader
    .add(textureButton)
    .add(textureButtonDown)
    .add(textureButtonOver)
    .add(fireParticle)
    .add(magicCard)
    .add(thinking)
    .add(shocked)
    .load(setup);

function setup(){
    app.ticker.add(delta => gameLoop(delta));
    showMainMenu();
}

function setCardsChallenge(){
    let cardsChallenge = new CardsChallenge(
        app, magicCard
    );
    setChallenge(cardsChallenge);
}

function setTextchallenge(){
    let textChallenge = new TextChallenge(
        app, [thinking, shocked], words
    );
    setChallenge(textChallenge);
}

function setparticlesChallenge(){
    let particlesChallenge = new ParticlesChallenge(
        app, fireParticle
    );
    setChallenge(particlesChallenge);
}

function showBackButton(){

    if(backButton == null) {
        backButton = new CustomButton(app, showMainMenu, textureButton, textureButtonDown, textureButtonOver);
        backButton.mount(700, 500, "Back");
    } else {
        app.stage.addChild(backButton.button);
    }

    hideMainMenu();
}

function showMainMenu(){
    
    setChallenge(null);

    if(cardsButton == null) {
        cardsButton = new CustomButton(app, setCardsChallenge, textureButton, textureButtonDown, textureButtonOver);
        cardsButton.mount(100, 100, "Cards");
    } else {
        app.stage.addChild(cardsButton.button);
    }
    
    if(textButton == null){
        textButton = new CustomButton(app, setTextchallenge, textureButton, textureButtonDown, textureButtonOver);
        textButton.mount(400, 100, "Text");
    } else {
        app.stage.addChild(textButton.button);
    }

    if(particlesButton == null){
        particlesButton = new CustomButton(app, setparticlesChallenge, textureButton, textureButtonDown, textureButtonOver);
        particlesButton.mount(700, 100, "Particles");
    } else {
        app.stage.addChild(particlesButton.button);
    }

    hideBackButton(0);
}

function hideMainMenu(){
    if(cardsButton != null){
        app.stage.removeChild(cardsButton.button);
    }
    if(textButton != null){
        app.stage.removeChild(textButton.button);
    }
    if(particlesButton != null){
        app.stage.removeChild(particlesButton.button);
    }

    app.stage.addChild(fps);
}

function hideBackButton(){
    if(backButton != null){
        app.stage.removeChild(backButton.button);
    } 

    app.stage.removeChild(fps);
}

function setChallenge(newChallange){
    
    if(currentChallenge != null){
        currentChallenge.unmount();
    }
    if(newChallange != null){
        newChallange.mount();
        showBackButton();
    }
    currentChallenge = newChallange;
}

app.sortZorder = () => {
    app.stage.children.sort(function(a,b) {
        a.zIndex = a.zIndex || 0;
        b.zIndex = b.zIndex || 0;
        return b.zIndex - a.zIndex
    });
}

function gameLoop(delta){
    if(currentChallenge != null){
        currentChallenge.update(delta);
    }
    fps.text = "FPS " + app.ticker.FPS.toFixed(2);
}


