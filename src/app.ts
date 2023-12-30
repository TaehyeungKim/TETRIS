import { Game, GameInterface } from "./game/game.js";

const game: GameInterface = new Game();
game.play();
// game.pause();

window.addEventListener('keydown', (e: KeyboardEvent)=>{
    switch(e.key) {
        case "p":
            game.pause();
            break;
    }
})





