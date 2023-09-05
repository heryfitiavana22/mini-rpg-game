export class OnGameOver {
    private mapContainer = document.querySelector(
        ".container-game > div"
    ) as HTMLDivElement;
    private subscribers: Function[] = [];

    subscribe = (subscriber: Function | Function[]) => {
        if (subscriber instanceof Array) this.subscribers.push(...subscriber);
        else this.subscribers.push(subscriber);
    };

     onGameOver = () => {
        this.mapContainer.insertAdjacentHTML(
            "beforeend",
            `
                <div class="game-over">
					<button class="restart">Restart</button>
				</div>
            `
        );
        const btnRestart = document.querySelector(
            "button.restart"
        ) as HTMLButtonElement;
        btnRestart.onclick = () => {
            const gameover = document.querySelector(".game-over");
            gameover && gameover.remove();
            this.subscribers.forEach((subscriber) => subscriber());
        };
    };
}
