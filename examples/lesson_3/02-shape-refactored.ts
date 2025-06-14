/**
 * Приклад правильної реалізації з дотриманням принципу відкритості/закритості
 *
 * Переваги цього підходу:
 * - Легко додавати нові фігури без зміни існуючого коду
 * - Кожна фігура інкапсулює свою логіку
 * - Немає великих switch-блоків
 * - Код відкритий для розширення, але закритий для модифікації
 */

// Базовий абстрактний клас для всіх фігур
export abstract class Shape {
    abstract calculateArea(): number;
    abstract getInfo(): string;
}

// Конкретні реалізації фігур
export class Circle extends Shape {
    constructor(private radius: number) {
        super();
    }

    calculateArea(): number {
        return Math.PI * Math.pow(this.radius, 2);
    }

    getInfo(): string {
        return `Коло з радіусом ${this.radius}`;
    }

    getRadius(): number {
        return this.radius;
    }
}

export class Rectangle extends Shape {
    constructor(private width: number, private height: number) {
        super();
    }

    calculateArea(): number {
        return this.width * this.height;
    }

    getInfo(): string {
        return `Прямокутник ${this.width}x${this.height}`;
    }

    getWidth(): number {
        return this.width;
    }

    getHeight(): number {
        return this.height;
    }
}

export class Triangle extends Shape {
    constructor(private base: number, private height: number) {
        super();
    }

    calculateArea(): number {
        return (this.base * this.height) / 2;
    }

    getInfo(): string {
        return `Трикутник з основою ${this.base} та висотою ${this.height}`;
    }

    getBase(): number {
        return this.base;
    }

    getHeight(): number {
        return this.height;
    }
}

// Калькулятор площі тепер не залежить від конкретних типів фігур
export class AreaCalculator {
    calculateArea(shape: Shape): number {
        return shape.calculateArea();
    }

    calculateTotalArea(shapes: Shape[]): number {
        return shapes.reduce((total, shape) => {
            return total + shape.calculateArea();
        }, 0);
    }

    getShapeInfo(shape: Shape): string {
        return shape.getInfo();
    }

    getAreaStatistics(shapes: Shape[]): string {
        const totalArea = this.calculateTotalArea(shapes);
        const shapeCount = shapes.length;
        const averageArea = totalArea / shapeCount;

        return `Загальна площа: ${totalArea.toFixed(
            2
        )}, Кількість фігур: ${shapeCount}, Середня площа: ${averageArea.toFixed(2)}`;
    }
}
