import { InterfaceShape, MapGame, Player, Road } from "../../models";
import { positionToIndex } from "../../utils";

export class CheckingCollision {
    constructor(private player: Player, private mapGame: MapGame) {}

    isCollideRowToShade(direction: TopOrBottom) {
        const nextXPositon =
            direction == "Top"
                ? this.player.getTopPosition() - this.player.getStep()
                : this.player.getBottomPosition() + this.player.getStep();

        const {
            nextShapeXLeft,
            nextShapeXLeftIndex,
            nextShapeXRight,
            nextShapeXRightIndex,
        } = this.getNextVerticalShape(nextXPositon);

        const playerVerticalPosition =
            direction == "Top"
                ? this.player.getTopPosition() - this.mapGame.getShapeSize() // autrement dit row + 1
                : this.player.getBottomPosition();

        if (
            (this.isCollidingToBorder(this.player.getRightPositon()) &&
                nextShapeXLeft instanceof Road) ||
            (this.isCollidingToBorder(this.player.getLeftPosition()) &&
                nextShapeXRight instanceof Road)
        )
            return {
                collide: false,
                restDistance: this.player.getStep(),
            };

        if (!nextShapeXLeft || !nextShapeXRight) {
            // reste par rapport à top
            if (nextShapeXLeftIndex.row <= 0)
                return {
                    collide: true,
                    restDistance: this.player.getTopPosition(),
                };
            // reste par rapport aux limites
            if (nextShapeXLeftIndex.column > this.mapGame.getRowLengthMap())
                return {
                    collide: true,
                    restDistance: this.minDistance(
                        this.restDistance(
                            playerVerticalPosition,
                            this.mapGame.getRowLengthMap()
                        ),
                        this.restDistance(
                            playerVerticalPosition,
                            this.mapGame.getRowLengthMap()
                        )
                    ),
                };
        }

        if (nextShapeXLeft instanceof Road && nextShapeXRight instanceof Road)
            return {
                collide: false,
                restDistance: this.player.getStep(),
            };

        // reste par rapport aux cellules suivant
        return {
            collide: true,
            restDistance: this.minDistance(
                this.restDistance(
                    playerVerticalPosition,
                    nextShapeXLeftIndex.row
                ),
                this.restDistance(
                    playerVerticalPosition,
                    nextShapeXRightIndex.row
                )
            ),
        };
    }

    isCollideColumnToShade(direction: LeftOrRight) {
        // X = left or right
        const nextXPosition =
            direction == "Left"
                ? this.player.getLeftPosition() - this.player.getStep()
                : this.player.getRightPositon() + this.player.getStep();

        const {
            nextShapeBottomX,
            nextShapeBottomXIndex,
            nextShapeTopX,
            nextShapeTopXIndex,
        } = this.getNextHorizontalShape(nextXPosition);

        const playerHorizontalPosition =
            direction == "Left"
                ? this.player.getLeftPosition() - this.mapGame.getShapeSize() // autrement dit column + 1
                : this.player.getRightPositon();

        if (
            (this.isCollidingToBorder(this.player.getBottomPosition()) &&
                nextShapeTopX instanceof Road) ||
            (this.isCollidingToBorder(this.player.getTopPosition()) &&
                nextShapeBottomX instanceof Road)
        )
            return {
                collide: false,
                restDistance: this.player.getStep(),
            };

        if (!nextShapeBottomX || !nextShapeTopX) {
            // reste par rapport à left
            if (nextShapeTopXIndex.column <= 0)
                return {
                    collide: true,
                    restDistance: this.player.getLeftPosition(), // reste par rapport à left
                };
            // reste par rapport aux limites
            if (nextShapeTopXIndex.column > this.mapGame.getColumnLengthMap())
                return {
                    collide: true,
                    restDistance: this.minDistance(
                        this.restDistance(
                            playerHorizontalPosition,
                            this.mapGame.getColumnLengthMap()
                        ),
                        this.restDistance(
                            playerHorizontalPosition,
                            this.mapGame.getColumnLengthMap()
                        )
                    ),
                };
        }

        if (nextShapeTopX instanceof Road && nextShapeBottomX instanceof Road)
            return {
                collide: false,
                restDistance: this.player.getStep(),
            };

        // reste par rapport aux cellules suivant
        return {
            collide: true,
            restDistance: this.minDistance(
                this.restDistance(
                    playerHorizontalPosition,
                    nextShapeTopXIndex.column
                ),
                this.restDistance(
                    playerHorizontalPosition,
                    nextShapeBottomXIndex.column
                )
            ),
        };
    }

    // X = left or right
    private getNextHorizontalShape(nextXPosition: number): NextShapeColumn {
        // shape top left or top Right
        let nextShapeTopXIndex = {
            row: positionToIndex(this.player.getTopPosition()),
            column: positionToIndex(nextXPosition),
        };
        // shape bottom left or bottom Right
        let nextShapeBottomXIndex = {
            row:positionToIndex(this.player.getBottomPosition()),
            column: positionToIndex(nextXPosition),
        };

        const nextShapeTopX = this.mapGame.getShape(
            nextShapeTopXIndex.row,
            nextShapeTopXIndex.column
        );
        const nextShapeBottomX = this.mapGame.getShape(
            nextShapeBottomXIndex.row,
            nextShapeBottomXIndex.column
        );

        return {
            nextShapeTopXIndex,
            nextShapeTopX,
            nextShapeBottomXIndex,
            nextShapeBottomX,
        };
    }

    // X = top or bottom
    private getNextVerticalShape(nextXPositon: number): NextShapeRow {
        // shape top left or bottom left
        const nextShapeXLeftIndex = {
            row: positionToIndex(nextXPositon),
            column: positionToIndex(this.player.getLeftPosition()),
        };
        // shape top right or bottom right
        const nextShapeXRightIndex = {
            row: positionToIndex(nextXPositon),
            column: positionToIndex(this.player.getRightPositon()),
        };

        const nextShapeXLeft = this.mapGame.getShape(
            nextShapeXLeftIndex.row,
            nextShapeXLeftIndex.column
        );
        const nextShapeXRight = this.mapGame.getShape(
            nextShapeXRightIndex.row,
            nextShapeXRightIndex.column
        );

        return {
            nextShapeXLeft,
            nextShapeXLeftIndex,
            nextShapeXRight,
            nextShapeXRightIndex,
        };
    }

    private isCollidingToBorder(position: number) {
        return position % 48 === 0;
    }

    private restDistance(position: number, indexShape: number) {
        return Math.abs(position - indexShape * this.mapGame.getShapeSize());
    }

    private minDistance(...values: number[]) {
        return Math.abs(Math.min(...values));
    }
}

type TopOrBottom = "Top" | "Bottom";
type LeftOrRight = "Left" | "Right";

type IndexShape = {
    column: number;
    row: number;
};

type NextShapeColumn = {
    nextShapeTopXIndex: IndexShape;
    nextShapeTopX: InterfaceShape | null;
    nextShapeBottomXIndex: IndexShape;
    nextShapeBottomX: InterfaceShape | null;
};
type NextShapeRow = {
    nextShapeXLeft: InterfaceShape | null;
    nextShapeXLeftIndex: IndexShape;
    nextShapeXRight: InterfaceShape | null;
    nextShapeXRightIndex: IndexShape;
};
