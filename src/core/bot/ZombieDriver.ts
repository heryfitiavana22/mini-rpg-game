import { MapGame, Player } from "../../models";
import { AStarFinder, Grid } from "pathfinding";
import { positionToIndex } from "../../utils";

export class ZombieDriver {
    private player: Player;
    private zombie: Player;
    private mapGame: MapGame;
    private finder: AStarFinder;
    private isPlayerMoving = false;
    private subscribers: Function[] = [];

    constructor({ mapGame, player, zombie }: ZombieDriverParams) {
        this.player = player;
        this.zombie = zombie;
        this.mapGame = mapGame;
        this.finder = new AStarFinder();
    }

    findPath = () => {
        const { playerX, playerY, zombieX, zombieY } = this.indexOfPosition();

        return this.pathFindAdapter(
            this.finder.findPath(
                zombieX,
                zombieY,
                playerX,
                playerY,
                this.getGrid()
            )
        );
    };

    playerMoving = () => {
        this.isPlayerMoving = true;
    };

    move = () => {
        let path = this.findPath();
        const shapeSize = this.mapGame.getShapeSize();

        let i = 0;
        let lastNode = path[0];
        const interval = setInterval(() => {
            if (this.isPlayerMoving) {
                this.isPlayerMoving = false;
                const newPath = this.findPath();
                path = newPath;
                i = 0;
            }
            if (i == path.length) {
                clearInterval(interval);
                this.gameOver();
                return console.log("game over");
            }
            const node = path[i];
            if (lastNode.row > node.row) this.zombie.moveLeft(shapeSize);
            else if (lastNode.row < node.row) this.zombie.moveRight(shapeSize);
            else if (lastNode.column > node.column)
                this.zombie.moveUp(shapeSize);
            else if (lastNode.column < node.column)
                this.zombie.moveDown(shapeSize);
            lastNode = node;
            i++;
        }, 100);
    };

    run = () => {
        this.move();
    };

    onGameOver = (subscriber: Function | Function[]) => {
        if (subscriber instanceof Array) this.subscribers.push(...subscriber);
        else this.subscribers.push(subscriber);
    };

    reset = () => {
        this.isPlayerMoving = false;
        setTimeout(() => {
            this.run();
        }, 1000);
    };

    private gameOver = () => {
        this.subscribers.forEach((subscriber) => subscriber());
        const restX =
            this.player.getLeftPosition() - this.zombie.getLeftPosition();
        const restY =
            this.player.getTopPosition() - this.zombie.getTopPosition();
        if (restX > 0) this.zombie.moveRight(restX);
        else this.zombie.moveLeft(restX);
        if (restY > 0) this.zombie.moveUp(-restY);
        else this.zombie.moveDown(restY);
    };

    private indexOfPosition = () => {
        const playerX = positionToIndex(this.player.getLeftPosition());
        const playerY = positionToIndex(this.player.getTopPosition());
        const zombieX = positionToIndex(this.zombie.getLeftPosition());
        const zombieY = positionToIndex(this.zombie.getTopPosition());
        return {
            playerX,
            playerY,
            zombieX,
            zombieY,
        };
    };

    private getGrid = () => {
        return new Grid(this.mapGame.getMapMatrix());
    };

    private pathFindAdapter(path: number[][]) {
        return path.map((p) => ({ row: p[0], column: p[1] }));
    }
}

type ZombieDriverParams = {
    player: Player;
    zombie: Player;
    mapGame: MapGame;
};
