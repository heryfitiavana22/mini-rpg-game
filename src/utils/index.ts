import { CONSTANT } from "../data";

export function positionToIndex(position: number) {
    return Math.floor(position / CONSTANT.shapeSize);
}

export function indexToPosition(index: number) {
    return index * CONSTANT.shapeSize;
}

export function getIdCell(indexRow: number, indexColumn: number) {
    return `index${indexRow}${indexColumn}`;
}
