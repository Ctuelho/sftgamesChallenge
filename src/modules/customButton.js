class CustomButton {
    constructor(refApp,  buttonDownFunction, textureButton, textureButtonDown, textureButtonOver){
        this.refApp = refApp;
        this.textureButton = textureButton;
        this.textureButtonDown = textureButtonDown;
        this.textureButtonOver = textureButtonOver;
        this.button = null;
        this.buttonDownFunction = buttonDownFunction;
    }

    mount(x, y, text){

        let textureButton = PIXI.utils.TextureCache[this.textureButton];

        let button = new PIXI.Sprite(
            textureButton
        );

        this.button = button;

        button.x = x;
        button.y = y;

        button.text = text;

        button.buttonMode = true;

        //button.anchor.set(0.5);
        button.pivot.set(32, 32);

        button.interactive = true;
        button.buttonMode = true;

        button
        .on('pointerdown', onButtonDown)
        .on('pointerup', onButtonUp)
        .on('pointerupoutside', onButtonUp)
        .on('pointerover', onButtonOver)
        .on('pointerout', onButtonOut);

        this.refApp.stage.addChild(button);

        button.textureButton       = textureButton;
        button.textureButtonDown   = PIXI.utils.TextureCache[this.textureButtonDown];
        button.textureButtonOver   = PIXI.utils.TextureCache[this.textureButtonOver];
        button.buttonDownFunction  = this.buttonDownFunction;

        function onButtonDown() {
            this.isdown = true;
            this.texture = this.textureButtonDown;
            this.buttonDownFunction();
        }

        function onButtonUp() {
            this.isdown = false;
            if (this.isOver) {
                this.texture = this.textureButtonOver;
            } else {
                this.texture = this.textureButton;
            }
        }
        
        function onButtonOver()   {
            this.isOver = true;
            if (this.isdown) {
                return;
            }
            this.texture = this.textureButtonOver;
        }
        
        function onButtonOut() {
            this.isOver = false;
            if (this.isdown) {
                return;
            }
            this.texture = this.textureButton;
        }
    }
}

export { CustomButton };