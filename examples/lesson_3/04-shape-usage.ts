/**
 * Приклад використання рефакторингованої системи фігур
 *
 * Демонструє, як легко працювати з різними типами фігур
 * через єдиний інтерфейс
 */

import { Shape, Circle, Rectangle, Triangle, AreaCalculator } from './02-shape-refactored';
import { Square, Ellipse } from './03-shape-extended';

// Створюємо масив різних фігур
const shapes: Shape[] = [
    new Circle(5),
    new Rectangle(4, 6),
    new Triangle(3, 8),
    new Square(4),
    new Ellipse(3, 2),
];

// Використовуємо калькулятор
const calculator = new AreaCalculator();

// Виводимо інформацію про кожну фігуру
shapes.forEach((shape) => {
    console.log(`${shape.getInfo()}: площа = ${shape.calculateArea().toFixed(2)}`);
});

// Виводимо статистику
console.log(calculator.getAreaStatistics(shapes));
