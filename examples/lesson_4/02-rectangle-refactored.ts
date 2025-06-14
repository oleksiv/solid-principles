/**
 * Правильна реалізація принципу підстановки Лісков
 *
 * Переваги цього підходу:
 * - Кожен клас має свою логіку без порушення контракту
 * - Використання інтерфейсів замість наслідування
 * - Передбачувана поведінка коду
 * - Легко додавати нові типи фігур
 */

export interface Shape {
    getArea(): number;
}

export class Rectangle implements Shape {
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

export class Square implements Shape {
    private side: number;

    constructor(side: number) {
        this.side = side;
    }

    setSide(side: number): void {
        this.side = side;
    }

    getSide(): number {
        return this.side;
    }

    getArea(): number {
        return this.side * this.side;
    }
}

export function calculateArea(shape: Shape): void {
    console.log(`Площа фігури: ${shape.getArea()}`);
}
