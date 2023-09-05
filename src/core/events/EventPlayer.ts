import { CheckingCollision } from "..";
import { Player } from "../../models";
import { Event } from "./event.type";

export class EventPlayer implements Event {
    private gameOver = false;
    private subscribers: Function[] = [];

    constructor(
        private player: Player,
        private checkingCollision: CheckingCollision
    ) {}

    handleEvent = () => {
        document.addEventListener("keydown", (event) => {
            if (this.gameOver) return;
            if (event.key == "ArrowUp") {
                const { collide, restDistance } =
                    this.checkingCollision.isCollideRowToShade("Top");
                collide
                    ? this.player.moveUp(restDistance)
                    : this.player.moveUp();
            } else if (event.key == "ArrowDown") {
                const { collide, restDistance } =
                    this.checkingCollision.isCollideRowToShade("Bottom");
                collide
                    ? this.player.moveDown(restDistance)
                    : this.player.moveDown();
            } else if (event.key == "ArrowLeft") {
                const { collide, restDistance } =
                    this.checkingCollision.isCollideColumnToShade("Left");
                collide
                    ? this.player.moveLeft(restDistance)
                    : this.player.moveLeft();
            } else if (event.key == "ArrowRight") {
                const { collide, restDistance } =
                    this.checkingCollision.isCollideColumnToShade("Right");
                collide
                    ? this.player.moveRight(restDistance)
                    : this.player.moveRight();
            }
            this.runSubscriber();
        });
    };

    setGameOver = () => {
        this.gameOver = true;
    };

    onPlayerMoved = (subscriber: Function | Function[]) => {
        if (subscriber instanceof Array) this.subscribers.push(...subscriber);
        else this.subscribers.push(subscriber);
    };

    reset = () => {
        this.gameOver = false;
    };

    private runSubscriber = () => {
        this.subscribers.forEach((subscriber) => subscriber());
    };
}
