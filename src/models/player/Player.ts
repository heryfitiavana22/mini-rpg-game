import { ImagesPlayer } from "./player.type";

export class Player {
    private currentImageURL: string;
    private playerHTML = {} as HTMLImageElement;
    private index = 1;
    private width: number;
    private height: number;
    private top = 0;
    private initialTop = 0;
    private left = 0;
    private initialLeft = 0;
    private step = 21;
    private imagesURL: ImagesPlayer;
    private id = "";

    constructor({ height, imagesURL, left, top, width }: PlayerParams) {
        this.imagesURL = imagesURL;
        this.currentImageURL = imagesURL.top;
        this.width = width;
        this.left = left;
        this.initialLeft = left;
        this.top = top;
        this.initialTop = top;
        this.height = height;
    }

    drawPlayer = () => {
        const container = document.querySelector(`.grid.map`)!;
        this.playerHTML = container.insertAdjacentElement(
            "beforeend",
            this.getPlayerHTML()
        ) as HTMLImageElement;
        this.playerHTML.style.width = this.width + "px";
        this.playerHTML.style.height = this.height + "px";
        this.updatePositionHTML();
    };

    updatePositionHTML = () => {
        this.playerHTML.style.top = this.top + "px";
        this.playerHTML.style.left = this.left + "px";
        this.playerHTML.src = this.currentImageURL + this.getIndexImage();
    };

    removePlayerHTML = () => {
        this.playerHTML.remove();
    };

    getTopPosition = () => {
        return this.top;
    };

    getBottomPosition = () => {
        return this.top + this.height;
    };

    getLeftPosition = () => {
        return this.left;
    };

    getRightPositon = () => {
        return this.left + this.width;
    };

    getStep = () => {
        return this.step;
    };

    moveUp(step = this.step) {
        this.currentImageURL = this.imagesURL.top;

        this.index++;
        this.top -= step;
        this.updatePositionHTML();

        return this.top;
    }

    moveDown(step = this.step) {
        this.currentImageURL = this.imagesURL.bottom;
        this.index++;
        this.top += step;
        this.updatePositionHTML();
        return this.top;
    }

    moveLeft(step = this.step) {
        this.currentImageURL = this.imagesURL.left;

        this.index++;
        this.left -= step;
        this.updatePositionHTML();

        return this.left;
    }

    moveRight(step = this.step) {
        this.currentImageURL = this.imagesURL.right;
        this.index++;
        this.left += step;
        this.updatePositionHTML();
        return this.left;
    }

    reset = () => {
        this.left = this.initialLeft;
        this.top = this.initialTop;
        this.removeHTML()
        this.drawPlayer();
    };

    removeHTML = () => {
        const player = document.querySelector(`#${this.id}`)
        player && player.remove()
    }

    private getPlayerHTML = () => {
        const img = document.createElement("img");
        img.src = this.currentImageURL + this.getIndexImage();
        img.className = "player transition float-item-cell";
        this.id = `player-${Math.round(Math.random() * 99)}`;
        img.id = this.id
        return img;
    };

    private getIndexImage = () => {
        return (this.index % 4) + 1 + ".png";
    };
}

type PlayerParams = {
    top: number;
    left: number;
    imagesURL: ImagesPlayer;
    width: number;
    height: number;
};
