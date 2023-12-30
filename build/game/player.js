export class Player {
    constructor() {
        this._timer = 0;
        this._score = 0;
        this._time = 0;
    }
    get time() {
        return this._time;
    }
    get score() {
        return this._score;
    }
    incrementTime() {
        this._time += 1;
    }
    startTimer(layoutTg) {
        this._timer = setInterval(() => {
            this.incrementTime();
            layoutTg.textContent = this.renderTime();
        }, 1000);
    }
    endTimer() {
        clearInterval(this._timer);
    }
    renderTime() {
        const [hour, min, sec] = [(this._time - this._time % (60 * 60)) / 60 * 60, (this._time - this._time % 60) / 60, this._time % 60];
        const locales = 'en-US';
        const rop = {
            minimumIntegerDigits: 2
        };
        return hour.toLocaleString(locales, rop) + ":"
            + min.toLocaleString(locales, rop) + ":"
            + sec.toLocaleString(locales, rop);
    }
    updateScore(score, layoutTg) {
        this._score += score;
        layoutTg.textContent = this._score.toString();
    }
}
