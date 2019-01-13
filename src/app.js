import { CustomButton } from './modules/customButton';
import { CardsChallenge } from './modules/cardsChallenge';
import { ParticlesChallenge } from './modules/particlesChallenge';


import * as PIXI from 'pixi.js';

//images
import magicCard from './images/magicCard.png';
import fireParticle from './images/fireParticle.png';
import textureButton from './images/textureButton.png';
import textureButtonDown from './images/textureButtonDown.png';
import textureButtonOver from './images/textureButtonOver.png';

//Create a Pixi Application
const app = new PIXI.Application();

let currentChallenge = null;

app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);

document.body.appendChild(app.view);

//load all images now
//question: make an atlas?
PIXI.loader
    .add(textureButton)
    .add(textureButtonDown)
    .add(textureButtonOver)
    .add(fireParticle)
    .add(magicCard)
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

function setparticlesChallenge(){
    let particlesChallenge = new ParticlesChallenge(
        app, fireParticle
    );
    setChallenge(particlesChallenge);
}

function showMainMenu(){
    
    setChallenge(null);

    let cardsButton = new CustomButton(app, setCardsChallenge, textureButton, textureButtonDown, textureButtonOver);
    cardsButton.mount(100, 100, "Cards");

    let particlesButton = new CustomButton(app, setparticlesChallenge, textureButton, textureButtonDown, textureButtonOver);
    particlesButton.mount(500, 100, "Particles");
}

function setChallenge(newChallange){
    
    if(currentChallenge != null){
        currentChallenge.unmount();
    }
    if(newChallange != null){
        newChallange.mount();
    }
    currentChallenge = newChallange;
}

app.sortZorder = () => {
    app.stage.children.sort(function(a,b) { //ver se precisa sortear toda hora
        a.zIndex = a.zIndex || 0;
        b.zIndex = b.zIndex || 0;
        return b.zIndex - a.zIndex
    });
}

function gameLoop(delta){
    if(currentChallenge != null){
        currentChallenge.update(delta);
        // app.sortZorder();
        //console.log("FPS: ",app.ticker.FPS);
    }
}


