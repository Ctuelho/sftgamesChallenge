class CardsChallenge {
    constructor(refApp, textureName){
        this.refApp = refApp;
        this.textureName = textureName;
        this.numberOfCards = 144;
        this.cards = [];
        this.stackStartX = 200;
        this.stackStartY = refApp.renderer.height - 200;
        this.stackEndX = 500;
        this.stackEndY = refApp.renderer.height - 200;
        this.stackPaddingX = 0;
        this.stackPaddingY = 0.5;
        this.intervalToMoveCards = 60;
        this.cardMovementDuration = 120;
        this.currentTime = 0;
        this.currentCardIndex = 0;
        this.complete = false;
    }

    mount(){
        //create all cards
        //question: better way to do this?
        for (var i = 0; i < this.numberOfCards; i++){
            let cardSprite = new PIXI.Sprite(
                PIXI.loader.resources[this.textureName].texture
            );

            cardSprite.position.set(
                this.stackStartX + this.cards.length * this.stackPaddingX,
                this.stackStartY - this.cards.length * this.stackPaddingY
            );
    
            cardSprite.moving = false;
            cardSprite.move = (fromX, fromY, toX, toY, duration) => {

                cardSprite.fromX = fromX;
                cardSprite.fromY = fromY;
                cardSprite.toX = toX;
                cardSprite.toY = toY;
                cardSprite.duration = duration;
                cardSprite.currentFrame = 0;
                cardSprite.amountX = (toX - fromX) / duration; //calculate this
                cardSprite.amountY = (toY - fromY) / duration; ; //calculate this
                cardSprite.moving = true;
            }
            this.cards.push(cardSprite);
        }
        
        this.cards.forEach( card => {
            this.refApp.stage.addChild(card)
        });

        //console.log("create cards", this.cards.length);
    }

    update(delta){
        this.currentTime += delta;
        // console.log(this.currentTime);
        if(!this.complete && this.currentTime >= this.intervalToMoveCards){
            this.currentTime -= this.intervalToMoveCards;
            //console.log("move another card");

            this.currentCardIndex++;

            let currentCardThatWillMove = this.numberOfCards - this.currentCardIndex;

            this.cards[currentCardThatWillMove].move(
                this.cards[currentCardThatWillMove].x, //currentX
                this.cards[currentCardThatWillMove].y, //currentY
                this.cards[currentCardThatWillMove].toX = this.stackEndX + this.currentCardIndex * this.stackPaddingX, //endX
                this.cards[currentCardThatWillMove].toY = this.stackEndY - this.currentCardIndex * this.stackPaddingY, //endY
                this.cards[currentCardThatWillMove].duration = this.cardMovementDuration,
            );
            if(this.currentCardIndex >= this.numberOfCards){
                this.complete = true;
            }

            this.refApp.sortZorder();

        }
        this.cards.forEach(card => {
            //translate each card if it is moving
            if(card.moving){    
                card.currentFrame++;
                if(card.currentFrame >= card.duration){
                    //it ended the animation
                    card.moving = false;
                    card.position.set(card.toX, card.toY);
                } else {
                    //calc new translated position for this card
                    var tX = card.x + card.amountX;
                    var tY = card.y + card.amountY;
                    card.position.set(tX, tY);
                    card.zIndex = this.numberOfCards - this.currentCardIndex;                    
                }
            }
        });
    }

    unmount(){
    }
}

export { CardsChallenge };

