class CustomButton {
    constructor(refApp,  buttonDownFunction, textureButton, textureButtonDown, textureButtonOver){
        this.refApp = refApp;
        this.textureButton = textureButton;
        this.textureButtonDown = textureButtonDown;
        this.textureButtonOver = textureButtonOver;
        this.button = null;
        this.buttonDownFunction = buttonDownFunction;
    }

    mount(){
        
        this.textureButton      = PIXI.utils.TextureCache[this.textureButton];
        this.textureButtonDown  = PIXI.utils.TextureCache[this.textureButtonDown];
        this.textureButtonOver  = PIXI.utils.TextureCache[this.textureButtonOver];

        let button = new PIXI.Sprite(
            this.textureButton
        );
        this.button = button;

        button.buttonMode = true;

        button.anchor.set(0.5);
        button.x = 200;
        button.y = 200;

        button.interactive = true;
        button.buttonMode = true;

        button
        .on('pointerdown', onButtonDown)
        .on('pointerup', onButtonUp)
        .on('pointerupoutside', onButtonUp)
        .on('pointerover', onButtonOver)
        .on('pointerout', onButtonOut);

        this.refApp.stage.addChild(button);

        button.textureButton       = this.textureButton;
        button.textureButtonDown   = this.textureButtonDown;
        button.textureButtonOver   = this.textureButtonOver;
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