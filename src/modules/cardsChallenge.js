class CardsChallenge {
    constructor(refApp, textureName, numberOfCards){
        this.refApp = refApp;
        this.textureName = textureName;
        this.numberOfCards = numberOfCards;
        this.cards = [];
    }

    mountDeck(){
        console.log("entered mount");
        
        let cards = this.cards;
        let app = this.refApp;
        let textureName = this.textureName;

        //create all cards
        //question: better way to do this?
        for (var i = 0; i < this.numberOfCards; i++){
            let cardSprite = new PIXI.Sprite(
                PIXI.loader.resources[textureName].texture
            );
    
            cards.push(cardSprite);
        }
        
        this.cards.forEach(card => {
            app.stage.addChild(card)
        });

        console.log("mounted");     
        
        console.log("app from cards ", app);
    }
}

export { CardsChallenge };

