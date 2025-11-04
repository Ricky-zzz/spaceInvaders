export default class SoundManager {
  constructor() {
    this.mainMenuMusic = new Audio("sounds/combat.mp3"); 
    this.combatMusic = new Audio("sounds/theme.mp3");    

    [this.mainMenuMusic, this.combatMusic].forEach((audio) => {
      audio.loop = true;
      audio.volume = 1.0;
    });
  }

  playMainMenuMusic() {
    if (!this.mainMenuMusic.paused) return; 
    this.stopExcept(this.mainMenuMusic);
    this.mainMenuMusic.currentTime = 0;
    this.mainMenuMusic.play();
  }

  playCombatMusic() {
    if (!this.combatMusic.paused) return; 
    this.stopExcept(this.combatMusic);
    this.combatMusic.currentTime = 0;
    this.combatMusic.play();
  }

  stopExcept(audioToKeep) {
    if (this.mainMenuMusic !== audioToKeep) this.mainMenuMusic.pause();
    if (this.combatMusic !== audioToKeep) this.combatMusic.pause();
  }

  fadeOut(audio, duration = 1000) {
    if (!audio || audio.paused) return;
    const fadeInterval = 50;
    const fadeStep = audio.volume / (duration / fadeInterval);
    const fade = setInterval(() => {
      if (audio.volume > fadeStep) {
        audio.volume -= fadeStep;
      } else {
        audio.pause();
        audio.volume = 1.0; 
        clearInterval(fade);
      }
    }, fadeInterval);
  }
}
