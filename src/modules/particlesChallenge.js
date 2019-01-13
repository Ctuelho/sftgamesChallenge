class ParticlesChallenge {
    constructor(refApp, textureName){
        this.refApp = refApp;
        this.textureName = textureName;
        this.maxNumberOfParticles = 10;
        this.emissionRatePerSecond = 15;
        this.emissionRateInFrames = 60/this.emissionRatePerSecond;
        this.effectDuration = 300;
        this.particleLifeSpam = 40;
        this.particleSpeedIsRandom = true;
        this.particleSpeed = 1;
        this.particleMinSpeed = 6.0;
        this.particleMaxSpeed = 7.0;
        this.particlesSize = 1;
        this.particleScaleIsRandom = true;
        this.particleMinScale = 0.9;
        this.particleMaxScale = 1.1;
        //0 - start alpha at first frame
        //1 - at frame 10
        //2 - alpha at frame 10
        //3 - at last frame, 0% alpha
        this.particleAlphaStates = [0, 10, 0.7, 0];
        this.particleRotationIsRandom = true;
        this.particleStartRotation = 0;
        this.particleMinRot = -1;
        this.particleMaxRot = 1;
        this.particleRotateOverTime = true;
        this.particleRotationMinSpeed = -0.05;
        this.particleRotationMaxSpeed = 0.05;
        this.particleRotationSpeed = 0.01;
        this.particleRotationSpeedIsRandom = true;
        this.effectX = refApp.renderer.width/2; //center of app
        this.effectY = refApp.renderer.height/2; //center of app
        this.particleRandomBasePosition = true;
        this.effectWidth = 16;//refApp.renderer.width * 0.03; //20% of app width
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

                //particle.tint = targetAlpha * 0xFFFFFF;
                particle.alpha = targetAlpha;
                particle.zIndex = targetAlpha;

                //change size
                particle.scale.x = 2 - this.particlesSize * particle.orignalScaleX * (particle.lifeSpam/this.particleLifeSpam);
                particle.scale.y = 2 - this.particlesSize * particle.orignalScaleY * (particle.lifeSpam/this.particleLifeSpam);

                //move the particle
                particle.position.set(
                    particle.x + particle.movementX * particle.speed,
                    particle.y + particle.movementY * particle.speed
                );

                if(this.particleRotateOverTime){
                    particle.rotation += particle.rotationSpeed;
                }
            }
        });

        this.refApp.sortZorder();
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

        //poisition
        let x = this.effectX;

        if(this.particleRandomBasePosition){
            x = this.effectX + Math.random() * this.effectWidth/2 - Math.random() * this.effectWidth/2;
        }
        particle.position.set(
            x,
            this.effectY
        );

        //set partciles direction
        let mouseData = this.refApp.renderer.plugins.interaction.mouse.global;
        //let angleRadians = - Math.atan2(mouseData.y - particle.y, mouseData.x - particle.x);

        let direction = [mouseData.x - x, mouseData.y - this.effectY];
        let len = Math.sqrt(direction[0] * direction[0] + direction[1] * direction[1]);
        let normal = [direction[0],direction[1]];
        if(len != 0){
            normal[0] /= len;
            normal[1] /= len;    
        }
        particle.movementX = normal[0];
        particle.movementY = normal[1];

        // console.log("len", len);
        // console.log("direction",direction);
        // console.log("mouseData",mouseData);
        // console.log("normal",normal);

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

        //speed of movement
        if(this.particleSpeedIsRandom){
            particle.speed = Math.random() * (this.particleMaxSpeed - this.particleMinSpeed) + this.particleMinSpeed;
        } else {
            particle.speed = this.particleSpeed;
        }

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

