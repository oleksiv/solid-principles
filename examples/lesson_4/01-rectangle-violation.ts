/**
 * Приклад порушення принципу підстановки Лісков (Liskov Substitution Principle)
 *
 * Проблеми цього підходу:
 * - Квадрат змінює поведінку батьківського класу Rectangle
 * - Функції, які працюють з Rectangle, дають непередбачувані результати з Square
 * - Порушується очікувана поведінка - ширина і висота мають встановлюватися незалежно
 * - Доводиться додавати додаткові перевірки типів
 */

export class Rectangle {
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

export class Square extends Rectangle {
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

export function resizeRectangle(rectangle: Rectangle): void {
    rectangle.setWidth(5);
    rectangle.setHeight(4);

    console.log(`Очікувана площа: 20, Реальна площа: ${rectangle.getArea()}`);
}
