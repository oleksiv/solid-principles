/**
 * Приклад використання рефакторених класів Order
 *
 * Це демонструє, як використовувати розділені класи
 * Кожен клас має свою відповідальність і може використовуватися незалежно
 */

import { Order, OrderCalculator, OrderEmailService, OrderLogger } from './05-order-refactored';

// Створюємо нове замовлення
const order = new Order('customer@example.com');

// Додаємо товари до замовлення
order.addItem('Ноутбук', 25000, 1);
order.addItem('Миша', 500, 2);

// Обчислюємо загальну суму з податком
const total = OrderCalculator.calculateTotalWithTax(order);
console.log(`Total: ${total} грн`);

// Відправляємо email підтвердження
OrderEmailService.sendConfirmationEmail(order);

// Логуємо замовлення
OrderLogger.logOrder(order);
