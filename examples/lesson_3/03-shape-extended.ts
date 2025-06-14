/**
 * Демонстрація розширення системи новими фігурами
 *
 * Зверніть увагу: ми додаємо нові класи без зміни існуючого коду!
 * Це і є принцип відкритості/закритості в дії.
 */

import { Shape } from './02-shape-refactored';

// Додаємо нові фігури без зміни старого коду
export class Square extends Shape {
    constructor(private side: number) {
        super();
    }

    calculateArea(): number {
        return this.side * this.side;
    }

    getInfo(): string {
        return `Квадрат зі стороною ${this.side}`;
    }

    getSide(): number {
        return this.side;
    }
}

export class Ellipse extends Shape {
    constructor(private majorAxis: number, private minorAxis: number) {
        super();
    }

    calculateArea(): number {
        return Math.PI * this.majorAxis * this.minorAxis;
    }

    getInfo(): string {
        return `Еліпс з півосями ${this.majorAxis} та ${this.minorAxis}`;
    }
}
