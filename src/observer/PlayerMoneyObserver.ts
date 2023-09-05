import { RandomMoney } from "../core";
import { Player } from "../models";

export class PlayerMoneyObserver {
    constructor(private player: Player, private randomMoney: RandomMoney) {}

    checkingPlayerAndMoney = () => {
        if (
            this.player.getLeftPosition() <= this.randomMoney.getX() &&
            this.player.getRightPositon() >= this.randomMoney.getX() &&
            this.player.getTopPosition() <= this.randomMoney.getY() &&
            this.player.getBottomPosition() >= this.randomMoney.getY()
        ) {
            this.randomMoney.generate();
        }
    };
}
