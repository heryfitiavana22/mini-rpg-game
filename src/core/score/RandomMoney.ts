import { CONSTANT } from "../../data";
import { MapGame } from "../../models";
import { indexToPosition } from "../../utils";

export class RandomMoney {
    private x = 0;
    private y = 0;
    private mapContainer = document.querySelector(
        ".container-game .map"
    ) as HTMLDivElement;
    private scoreHTML = document.querySelector(
        ".container-game .score"
    ) as HTMLSpanElement;
    private indexesRoads: number[][];
    private score = -1;
    private imageURL = "/delivery/money.png";

    constructor(private mapGame: MapGame) {
        this.indexesRoads = this.mapGame.getIndexesRoads();
        this.generate();
    }

    generate = () => {
        const { indexX, indexY } = this.getRandomPosition();
        this.x = indexToPosition(indexX) + CONSTANT.shapeSize / 2;
        this.y = indexToPosition(indexY) + CONSTANT.shapeSize / 2;
        this.score++;
        this.remove();
        this.draw();
    };

    getX = () => {
        return this.x;
    };

    getY = () => {
        return this.y;
    };

    reset = () => {
        this.score = -1
        this.generate()
    }

    private draw = () => {
        const money = document.createElement("div");
        money.classList.add("dot");
        money.classList.add("money");
        money.classList.add("float-item-cell");
        money.style.left = this.x + "px";
        money.style.top = this.y + "px";
        money.innerHTML = `<img src="${this.imageURL}" />`;
        this.mapContainer.insertAdjacentElement("beforeend", money);
        this.scoreHTML.innerHTML = this.score.toString();
    };

    private getRandomPosition = () => {
        const random = Math.floor(Math.random() * this.indexesRoads.length);

        return {
            indexX: this.indexesRoads[random][1],
            indexY: this.indexesRoads[random][0],
        };
    };

    private remove() {
        const money = document.querySelector(".money");
        money && money.remove();
    }
}
