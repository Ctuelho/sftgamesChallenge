class ParticlesChallenge {
    constructor(refApp, textureName){
        this.refApp = refApp;
        this.textureName = textureName;
        this.maxNumberOfParticles = 10;
        this.emissionRatePerSecond = 10;
        this.emissionRateInFrames = 60/this.emissionRatePerSecond;
        this.effectDuration = 300;
        this.particleLifeSpam = 60;
        this.particleSpeedIsRandom = true;
        this.particleSpeed = 1;
        this.particleMinSpeed = 1.6;
        this.particleMaxSpeed = 3.0;
        this.particlesSize = 2;
        this.particleScaleIsRandom = true;
        this.particleMinScale = 0.9;
        this.particleMaxScale = 1.1;
        //0 - start alpha at frame 0
        //1 - at frame 10, 60% alpha
        //3 - at last frame, 0% alpha
        this.particleAlphaStates = [0, 10, 0.7, 0];
        this.particleRotationIsRandom = true;
        this.particleStartRotation = 0;
        this.particleMinRot = -1;
        this.particleMaxRot = 1;
        this.particleRotateOverTime = true;
        this.particleRotationMinSpeed = -0.01;
        this.particleRotationMaxSpeed = 0.01;
        this.particleRotationSpeed = 0.01;
        this.particleRotationSpeedIsRandom = true;
        this.effectX = refApp.renderer.width/2; //center of app
        this.effectY = refApp.renderer.height/2; //center of app
        this.effectWidth = 32;//refApp.renderer.width * 0.03; //20% of app width
        this.repeat = true;
        this.currentTime = 0;
        this.totalDuration = 0;
        this.particles = [];
    }

    mount(){     
    }

    update(delta){

        //clear from dead particles
        this.particles = this.particles.filter(item => item.lifeSpam > 0);

        let makeParticle = this.repeat || this.totalDuration <= this.effectDuration;
        if(makeParticle){
            this.currentTime += delta;
            if(!this.reapeat) {this.totalDuration += delta;}
            
            if(this.particles.length < this.maxNumberOfParticles){ //has space to create another particle right now
                if(this.currentTime >= this.emissionRateInFrames){ //can create another particle because of time
                    this.currentTime -= this.emissionRateInFrames;

                    //create another particle here
                    let particle = this.createParticle();

                    this.particles.push(particle);

                    this.refApp.stage.addChild(particle);
                }
            }
        }

        //iterate trhough particles to animate them
        this.particles.forEach( particle => {
            particle.lifeSpam -= delta;
            if(particle.lifeSpam <= 0){
                this.removeParticle(particle);
            }
            else
            {
                //the particle stills alive

                //change size
                particle.scale.x = this.particlesSize * particle.orignalScaleX * (particle.lifeSpam/this.particleLifeSpam);
                particle.scale.y = this.particlesSize * particle.orignalScaleY * (particle.lifeSpam/this.particleLifeSpam);

                //change alpha
                let targetAlpha = 0;
                if(this.particleLifeSpam - particle.lifeSpam <= this.particleAlphaStates[1]){
                    targetAlpha = 
                        this.particleAlphaStates[2] *
                        (this.particleLifeSpam - particle.lifeSpam) / this.particleAlphaStates[1];
                    //console.log("particle lifespam is young",targetAlpha);
                } else {
                    targetAlpha = 
                    Math.min(
                        this.particleAlphaStates[2],
                        particle.lifeSpam / this.particleLifeSpam
                    );
                    //console.log("particle lifespam is old", targetAlpha);
                }
                particle.alpha = targetAlpha;
                
                //move the particle
                particle.position.set(
                    particle.x + particle.movementX * particle.speed,
                    particle.y - particle.movementY * particle.speed
                );

                if(this.particleRotateOverTime){
                    particle.rotation += particle.rotationSpeed;
                }
            }
        });
    }   

    createParticle(){
        //console.log("creating particle");

        let particle = new PIXI.Sprite(
            PIXI.loader.resources[this.textureName].texture
        );

        //fill particles properties

        //start alpha
        particle.alpha = this.particleAlphaStates[0];

        //pivot
        particle.pivot.set(32, 44);

        //rotation
        if(this.particleRotationIsRandom){
            particle.rotation = Math.random() * this.particleMinRot + Math.random() * this.particleMaxRot;
        } else {
            particle.rotation = this.particleStartRotation;
        }
        
        //rotation speed
        if(this.particleRotationSpeedIsRandom)
        {
            particle.rotationSpeed = Math.random() * this.particleRotationMinSpeed + Math.random() * this.particleRotationMaxSpeed;
        } else {
            particle.rotationSpeed = this.particleRotationSpeed;
        }

        //scale
        if(this.particleScaleIsRandom){
            particle.scale.x = (this.particleMaxScale - this.particleMinScale) * Math.random() + this.particleMinScale;
            particle.scale.y = (this.particleMaxScale - this.particleMinScale) * Math.random() + this.particleMinScale;
            particle.orignalScaleX = particle.scale.x;
            particle.orignalScaleY = particle.scale.y;
        }

        //timers
        particle.lifeSpam = this.particleLifeSpam;

        //poisition
        if(this.particleRandomBasePosition){
            particle.position.set(
                this.effectX + Math.random() * this.effectWidth/2 - Math.random() * this.effectWidth/2,
                this.effectY
            );
        } else {
            particle.position.set(
                this.effectX,
                this.effectY
            );
        }

        //speed direction of movement
        if(this.particleSpeedIsRandom){
            particle.speed = Math.random() * (this.particleMaxSpeed - this.particleMinSpeed) + this.particleMinSpeed;
        } else {
            particle.speed = this.particleSpeed;
        }
        particle.movementX = 0;
        particle.movementY = 1;

        return particle;

    }

    removeParticle(particle){
        this.refApp.stage.removeChild(particle);
    }

    unmount(){
        this.particles.forEach(particle => {
            this.removeParticle(particle);
        });
        this.particles = null;
    }
}

export { ParticlesChallenge };

