import { timingSafeEqual } from "crypto";

class TextChallenge {
    constructor(refApp, textures, words){
        this.refApp = refApp;
        this.textures = textures;
        this.words = words;
        this.randomize = true;
        this.timeToRandomize = 120;
        this.currentTimer = 0;
        this.minItems = 6;
        this.maxItems = 6;
        this.startY = refApp.renderer.height / 2;
        this.startX = 100;
        this.itemPadding = 30;
        this.items = null;
    }

    mount(){
        
    }

    update(delta){
        if(this.randomize){
            //going to generate new items
            console.log("randomizing");
            this.randomize = false;
            this.items = [];
            let numberOfItems = this.minItems + Math.floor(Math.random() * (this.maxItems - this.minItems));
            for(var i = 0; i < numberOfItems; i++){
                this.items.push(this.createItem());
            }
            this.formatItems();
        } else {
            this.currentTimer += delta; 
            if(this.currentTimer >= this.timeToRandomize){
                this.randomize = true;
                this.currentTimer -= this.timeToRandomize;
                this.unmount();
            }
        }
    }

    formatItems(){
        let totalWidth = (this.items.length - 1) * this.itemPadding;
        for(var i = 0; i < this.items.length; i++){
            totalWidth += this.items[i].width;
        }

        for(var j = 0; j < this.items.length; j++){
            if(j > 0){
                this.items[j].position.set(this.items[j].width/2 + this.items[j-1].x + this.items[j-1].width/2 + this.itemPadding, this.startY);
            } else {
                this.items[j].position.set(this.startX, this.startY);
            }
        }
    }

    createItem(){
        let item = null;

        if(Math.random() > 0.5){
            //make text
            let text = this.words[Math.floor(Math.random() * this.words.length)];
            let fontSize = Math.max(12, Math.floor(Math.random() * 40));
            item = new PIXI.Text(text, {fontFamily : 'Arial', fontSize: fontSize, fill : 0xff1010, align : 'center'});
        } else {
            //make sprite
            let texture = this.textures[Math.floor(Math.random() * this.textures.length)];
            item = new PIXI.Sprite(
                PIXI.loader.resources[texture].texture
            );
        }

        item.pivot.set(item.width/2, item.height/2);

        this.refApp.stage.addChild(item);

        return item;
    }

    removeItem(item){
        this.refApp.stage.removeChild(item);
    }

    unmount(){
        this.items.forEach(item => {
            this.removeItem(item);
        });
    }
}

export { TextChallenge };

