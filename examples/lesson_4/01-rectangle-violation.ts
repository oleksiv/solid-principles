class Rectangle {
    protected width: number;
    protected height: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    setWidth(width: number): void {
        this.width = width;
    }

    setHeight(height: number): void {
        this.height = height;
    }

    getWidth(): number {
        return this.width;
    }

    getHeight(): number {
        return this.height;
    }

    getArea(): number {
        return this.width * this.height;
    }
}

class Square extends Rectangle {
    constructor(side: number) {
        super(side, side);
    }

    setWidth(width: number): void {
        this.width = width;
        this.height = width;
    }

    setHeight(height: number): void {
        this.width = height;
        this.height = height;
    }
}
