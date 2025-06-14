/**
 * Приклад використання рефакторованої системи платежів
 *
 * Демонструє гнучкість системи - можемо легко вибирати різні способи оплати
 * без зміни основного коду OrderService
 */

import {
    PaymentProcessor,
    PayPalPayment,
    StripePayment,
    BankCardPayment,
    OrderService,
} from './02-payment-refactored';

// ✅ Використання - гнучко вибираємо спосіб оплати
const paypalProcessor = new PayPalPayment();
const stripeProcessor = new StripePayment();
const bankCardProcessor = new BankCardPayment();

const orderWithPaypal = new OrderService(paypalProcessor);
const orderWithStripe = new OrderService(stripeProcessor);
const orderWithCard = new OrderService(bankCardProcessor);

// Демонстрація роботи з різними платіжними системами
console.log('=== Тестування різних платіжних систем ===');

console.log('\n1. Оплата через PayPal:');
orderWithPaypal.processOrder(100);

console.log('\n2. Оплата через Stripe:');
orderWithStripe.processOrder(200);

console.log('\n3. Оплата банківською карткою:');
orderWithCard.processOrder(150);

// Приклад створення мок-об'єкта для тестування
class MockPaymentProcessor implements PaymentProcessor {
    processPayment(amount: number): boolean {
        console.log(`[MOCK] Імітую обробку платежу на ${amount} грн`);
        return true;
    }
}

console.log("\n4. Тестування з мок-об'єктом:");
const mockProcessor = new MockPaymentProcessor();
const orderWithMock = new OrderService(mockProcessor);
orderWithMock.processOrder(500);
