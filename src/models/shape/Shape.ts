import { CONSTANT } from "../../data";
import { InterfaceShape } from "./shape.type";

export class Shape implements InterfaceShape {
    private size = CONSTANT.shapeSize;
    constructor(private imageURL: string) {}

    getImgURL = () => {
        return this.imageURL;
    }

    getSize = () => {
        return this.size;
    }
}
