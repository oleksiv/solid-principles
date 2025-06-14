/**
 * Приклад використання рефакторингованої системи фігур
 *
 * Демонструє, як правильно працювати з різними фігурами
 * через спільний інтерфейс без порушення принципу Лісков
 */

import { Rectangle, Square, calculateArea } from './02-rectangle-refactored';

// Створюємо фігури
const rectangle = new Rectangle(5, 4);
const square = new Square(3);

// Використовуємо функцію, яка працює з інтерфейсом Shape
calculateArea(rectangle); // Площа фігури: 20
calculateArea(square); // Площа фігури: 9

// Демонструємо, що кожна фігура має свою логіку
console.log('\n--- Робота з прямокутником ---');
console.log(`Початкові розміри: ${rectangle.getWidth()}x${rectangle.getHeight()}`);
rectangle.setWidth(10);
rectangle.setHeight(2);
console.log(`Нові розміри: ${rectangle.getWidth()}x${rectangle.getHeight()}`);
console.log(`Площа: ${rectangle.getArea()}`);

console.log('\n--- Робота з квадратом ---');
console.log(`Початкова сторона: ${square.getSide()}`);
square.setSide(7);
console.log(`Нова сторона: ${square.getSide()}`);
console.log(`Площа: ${square.getArea()}`);

// Масив різних фігур - всі працюють через інтерфейс Shape
const shapes = [new Rectangle(3, 4), new Square(5), new Rectangle(2, 8), new Square(6)];

console.log('\n--- Обчислення площ різних фігур ---');
shapes.forEach((shape, index) => {
    console.log(`Фігура ${index + 1}: площа = ${shape.getArea()}`);
});
