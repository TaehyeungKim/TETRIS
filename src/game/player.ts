export interface PlayerInterface {
    startTimer(layoutTg: HTMLElement): void;
    endTimer(): void;
    updateScore(score: number, layoutTg: HTMLElement): void;
    renderTime(): string;
}

export class Player implements PlayerInterface{
    private _score: number;
    private _time: number;

    private _timer: number = 0;

    constructor() {
        this._score = 0;
        this._time = 0;
    }

    get time() {
        return this._time
    }

    get score() {
        return this._score
    }

    private incrementTime() {
        this._time += 1;
    }

    startTimer(layoutTg: HTMLElement) {
        this._timer = setInterval(()=>{
            this.incrementTime()
            layoutTg.textContent = this.renderTime();
        }, 1000);
    }

    endTimer() {
        clearInterval(this._timer)
    }

    renderTime(): string {
        const [hour, min, sec] = [(this._time - this._time%(60*60))/60*60, (this._time - this._time%60)/60, this._time%60]
        const locales: string = 'en-US'
        const rop:Intl.NumberFormatOptions = {
            minimumIntegerDigits: 2
        }
        return hour.toLocaleString(locales, rop) + ":" 
        + min.toLocaleString(locales, rop) + ":" 
        + sec.toLocaleString(locales, rop)
    }

    updateScore(score: number, layoutTg: HTMLElement) {
        this._score += score
        layoutTg.textContent = this._score.toString();
    }

}