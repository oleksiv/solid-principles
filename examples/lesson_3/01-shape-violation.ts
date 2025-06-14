/**
 * Приклад порушення принципу відкритості/закритості (Open/Closed Principle)
 *
 * Проблеми цього підходу:
 * - Для додавання нової фігури потрібно модифікувати існуючий код у багатьох місцях
 * - Switch-блоки стають величезними при збільшенні кількості фігур
 * - Високий ризик помилок при додаванні нових типів
 * - Порушується принцип єдиної відповідальності - клас знає про всі фігури
 */

export enum ShapeType {
    CIRCLE = 'circle',
    RECTANGLE = 'rectangle',
    TRIANGLE = 'triangle',
}

export interface Circle {
    type: ShapeType.CIRCLE;
    radius: number;
}

export interface Rectangle {
    type: ShapeType.RECTANGLE;
    width: number;
    height: number;
}

export interface Triangle {
    type: ShapeType.TRIANGLE;
    base: number;
    height: number;
}

export type Shape = Circle | Rectangle | Triangle;

export class AreaCalculator {
    calculateArea(shape: Shape): number {
        switch (shape.type) {
            case ShapeType.CIRCLE:
                return Math.PI * Math.pow(shape.radius, 2);

            case ShapeType.RECTANGLE:
                return shape.width * shape.height;

            case ShapeType.TRIANGLE:
                return (shape.base * shape.height) / 2;

            default:
                throw new Error('Невідомий тип фігури');
        }
    }

    calculateTotalArea(shapes: Shape[]): number {
        return shapes.reduce((total, shape) => {
            return total + this.calculateArea(shape);
        }, 0);
    }

    getShapeInfo(shape: Shape): string {
        switch (shape.type) {
            case ShapeType.CIRCLE:
                return `Коло з радіусом ${shape.radius}`;

            case ShapeType.RECTANGLE:
                return `Прямокутник ${shape.width}x${shape.height}`;

            case ShapeType.TRIANGLE:
                return `Трикутник з основою ${shape.base} та висотою ${shape.height}`;

            default:
                throw new Error('Невідомий тип фігури');
        }
    }
}
