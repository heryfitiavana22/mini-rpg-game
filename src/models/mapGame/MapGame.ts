import { getIdCell } from "../../utils";
import { InterfaceShape, Road } from "..";

export class MapGame {
    private mapHTML = document.querySelector(".map")!;
    constructor(private shapesData: InterfaceShape[][]) {}

    drawMap = () => {
        this.shapesData.forEach((shapesRow, i) => {
            shapesRow.forEach((shape, j) => {
                this.mapHTML.insertAdjacentHTML(
                    "beforeend",
                    `
                        <div class="cell" id="${getIdCell(i, j)}">
                            <img src="${shape.getImgURL()}" alt="" class="shape"  />
                            <span class="float-item-cell"></span>
                        </div>
                    `
                );
            });
        });
        return this;
    }

    removeMap = () => {
        this.mapHTML.innerHTML = "";
        return this;
    }

    getShapesData = () => {
        return this.shapesData;
    }

    getColumnLengthMap = () => {
        const columnLength = this.shapesData[0].length;
        this.shapesData.forEach((shapesRow, i) => {
            if (shapesRow.length !== columnLength)
                throw Error(
                    `Chaque colonne devra avoir la même longueur. Vérifier la colonne à la ligne ${i} et 0`
                );
        });
        return columnLength;
    }

    getRowLengthMap = () => {
        return this.shapesData.length;
    }

    getShapeSize = () => {
        return this.shapesData[0][0].getSize();
    }

    getShape(row: number, column: number) {
        if (
            row < 0 ||
            column < 0 ||
            row >= this.getRowLengthMap() ||
            column >= this.getColumnLengthMap()
        )
            return null;

        return this.shapesData[this.correctMaxIndex(row, "Row")][
            this.correctMaxIndex(column, "Column")
        ];
    }

    // 0 = road
    // 1 = shape
    getMapMatrix = () => {
        const matrix: number[][] = [];
        this.shapesData.forEach((shapesRow, i) => {
            matrix[i] = [];
            shapesRow.forEach((el) => {
                if (el instanceof Road) matrix[i].push(0);
                else matrix[i].push(1);
            });
        });

        return matrix;
    }

    // index des chemins disponibles
    getIndexesRoads = () => {
        const matrix = this.getMapMatrix();

        return matrix.reduce<number[][]>((acc, currentRow, i) => {
            currentRow.forEach((current, j) => {
                if (current == 0) acc.push([i, j]);
            });
            return acc;
        }, []);
    }

    private correctMaxIndex(value: number, type: ColumnOrRow) {
        if (type == "Column")
            return value >= this.getColumnLengthMap()
                ? this.getColumnLengthMap() - 1
                : value;

        return value >= this.getRowLengthMap()
            ? this.getRowLengthMap() - 1
            : value;
    }
}

type ColumnOrRow = "Column" | "Row";
