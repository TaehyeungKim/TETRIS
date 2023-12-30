import { Game } from "./game/game.js";
const game = new Game();
game.play();
// game.pause();
window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case "p":
            game.pause();
            break;
    }
});
