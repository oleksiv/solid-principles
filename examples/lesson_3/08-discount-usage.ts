/**
 * Приклад використання рефакторингованої системи знижок
 *
 * Демонструє:
 * - Створення клієнтів з різними стратегіями знижок
 * - Динамічну зміну стратегії знижки
 * - Легкість додавання нових типів знижок
 */

import {
    Customer,
    DiscountCalculator,
    NoDiscountStrategy,
    PremiumDiscountStrategy,
    VipDiscountStrategy,
    StudentDiscountStrategy,
} from './06-discount-refactored';
import { SeniorDiscountStrategy, SeasonalDiscountStrategy } from './07-discount-extended';

// Створюємо клієнтів з різними стратегіями знижок
const customers = [
    new Customer('1', 'Іван Звичайний', new NoDiscountStrategy(), new Date('2023-01-01')),
    new Customer('2', 'Марія Преміум', new PremiumDiscountStrategy(), new Date('2022-06-15')),
    new Customer('3', 'Олександр VIP', new VipDiscountStrategy(), new Date('2020-03-20')),
    new Customer('4', 'Анна Студентка', new StudentDiscountStrategy(), new Date('2023-09-01')),
    new Customer('5', 'Петро Пенсіонер', new SeniorDiscountStrategy(), new Date('2021-12-10')),
];

// Додаємо клієнта з сезонною знижкою
const newYearDiscount = new SeasonalDiscountStrategy(0.25, 'Новорічна');
customers.push(new Customer('6', 'Оксана Новорічна', newYearDiscount, new Date('2023-01-15')));

// Використовуємо калькулятор знижок
const calculator = new DiscountCalculator();
const orderAmount = 1000;

// Виводимо звіт для кожного клієнта
customers.forEach((customer) => {
    const report = calculator.generateDiscountReport(customer, orderAmount);
    console.log(report);
    console.log('---');
});

// Демонструємо динамічну зміну стратегії знижки
const regularCustomer = customers[0];
console.log('До зміни статусу:', calculator.getDiscountDescription(regularCustomer));

// Клієнт стає VIP
regularCustomer.setDiscountStrategy(new VipDiscountStrategy());
console.log('Після отримання VIP:', calculator.getDiscountDescription(regularCustomer));
