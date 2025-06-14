/**
 * Правильна реалізація принципу інверсії залежностей (DIP)
 *
 * Переваги цього підходу:
 * - OrderService залежить від абстракції (PaymentProcessor), а не від конкретної реалізації
 * - Легко додавати нові способи оплати без зміни OrderService
 * - Легко тестувати з мок-об'єктами
 * - Дотримується принципу відкритості/закритості
 * - Використовується Dependency Injection для передачі залежностей ззовні
 */

// ✅ Крок 1: Створюємо абстракцію (інтерфейс)
export interface PaymentProcessor {
    processPayment(amount: number): boolean;
}

// ✅ Крок 2: Конкретні реалізації залежать від абстракції
export class PayPalPayment implements PaymentProcessor {
    processPayment(amount: number): boolean {
        console.log(`Обробляю ${amount} грн через PayPal`);
        return true;
    }
}

export class StripePayment implements PaymentProcessor {
    processPayment(amount: number): boolean {
        console.log(`Обробляю ${amount} грн через Stripe`);
        return true;
    }
}

export class BankCardPayment implements PaymentProcessor {
    processPayment(amount: number): boolean {
        console.log(`Обробляю ${amount} грн через банківську карту`);
        return true;
    }
}

// ✅ Крок 3: Високорівневий клас залежить від абстракції
export class OrderService {
    private paymentProcessor: PaymentProcessor;

    // Залежність передається ззовні (Dependency Injection)
    constructor(paymentProcessor: PaymentProcessor) {
        this.paymentProcessor = paymentProcessor;
    }

    processOrder(amount: number): void {
        console.log('Обробляю замовлення...');

        // Працюємо з абстракцією, не знаючи конкретної реалізації
        const success = this.paymentProcessor.processPayment(amount);

        if (success) {
            console.log('Замовлення успішно оплачено!');
        }
    }
}

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
