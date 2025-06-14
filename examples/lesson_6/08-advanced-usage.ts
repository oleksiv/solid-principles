/**
 * Розширений приклад застосування принципу інверсії залежностей
 *
 * Цей файл демонструє:
 * - Комбінування кількох абстракцій в одному класі
 * - Створення складніших бізнес-сценаріїв
 * - Використання Dependency Injection для кількох залежностей
 * - Реальні приклади застосування DIP в бізнес-логіці
 */

import { PaymentProcessor, PayPalPayment, StripePayment } from './02-payment-refactored';
import { Logger, ConsoleLogger, FileLogger } from './05-logging-refactored';

// Розширений сервіс замовлень, який використовує кілька абстракцій
export class AdvancedOrderService {
    constructor(private paymentProcessor: PaymentProcessor, private logger: Logger) {}

    processOrder(customerName: string, amount: number): boolean {
        this.logger.log(`Початок обробки замовлення для ${customerName} на суму ${amount} грн`);

        try {
            // Валідація замовлення
            if (amount <= 0) {
                this.logger.log(`Помилка: Некоректна сума замовлення ${amount}`);
                return false;
            }

            // Обробка платежу
            this.logger.log(`Обробляю платіж на суму ${amount} грн`);
            const paymentSuccess = this.paymentProcessor.processPayment(amount);

            if (paymentSuccess) {
                this.logger.log(`Платіж успішно оброблено для ${customerName}`);
                this.logger.log(`Замовлення завершено успішно`);
                return true;
            } else {
                this.logger.log(`Помилка обробки платежу для ${customerName}`);
                return false;
            }
        } catch (error) {
            this.logger.log(`Критична помилка при обробці замовлення: ${error}`);
            return false;
        }
    }

    refundOrder(customerName: string, amount: number): boolean {
        this.logger.log(`Початок повернення коштів для ${customerName} на суму ${amount} грн`);

        // В реальному додатку тут була б логіка повернення коштів
        this.logger.log(`Кошти в розмірі ${amount} грн повернено ${customerName}`);
        return true;
    }
}

// Фабрика для створення сервісів з різними конфігураціями
export class OrderServiceFactory {
    static createDevelopmentService(): AdvancedOrderService {
        return new AdvancedOrderService(new PayPalPayment(), new ConsoleLogger());
    }

    static createProductionService(): AdvancedOrderService {
        return new AdvancedOrderService(new StripePayment(), new FileLogger());
    }

    static createTestService(
        paymentProcessor: PaymentProcessor,
        logger: Logger
    ): AdvancedOrderService {
        return new AdvancedOrderService(paymentProcessor, logger);
    }
}

// Демонстрація використання
console.log('=== Розширений приклад застосування DIP ===');

// 1. Сервіс для розробки
console.log('\n1. Конфігурація для розробки:');
const devService = OrderServiceFactory.createDevelopmentService();
devService.processOrder('Іван Петренко', 1500);

// 2. Сервіс для продакшену
console.log('\n2. Конфігурація для продакшену:');
const prodService = OrderServiceFactory.createProductionService();
prodService.processOrder('Марія Іваненко', 2500);

// 3. Тестова конфігурація з мок-об'єктами
console.log('\n3. Тестова конфігурація:');

class TestPaymentProcessor implements PaymentProcessor {
    constructor(private shouldSucceed: boolean = true) {}

    processPayment(amount: number): boolean {
        console.log(`[TEST] Тестую платіж на ${amount} грн`);
        return this.shouldSucceed;
    }
}

class TestLogger implements Logger {
    private logs: string[] = [];

    log(message: string): void {
        this.logs.push(message);
        console.log(`[TEST LOG]: ${message}`);
    }

    getLogs(): string[] {
        return [...this.logs];
    }
}

const testPayment = new TestPaymentProcessor(true);
const testLogger = new TestLogger();
const testService = OrderServiceFactory.createTestService(testPayment, testLogger);

const result = testService.processOrder('Тестовий Клієнт', 1000);
console.log(`Результат тесту: ${result ? 'Успіх' : 'Помилка'}`);
console.log(`Кількість логів: ${testLogger.getLogs().length}`);

// 4. Тест з помилкою платежу
console.log('\n4. Тест з помилкою платежу:');
const failingPayment = new TestPaymentProcessor(false);
const failingService = OrderServiceFactory.createTestService(failingPayment, testLogger);
const failResult = failingService.processOrder('Клієнт з Помилкою', 500);
console.log(`Результат тесту з помилкою: ${failResult ? 'Успіх' : 'Помилка'}`);

console.log('\n=== Переваги такого підходу ===');
console.log("✅ Легко тестувати з мок-об'єктами");
console.log('✅ Можна змінювати конфігурацію для різних середовищ');
console.log('✅ Код гнучкий та легко розширюваний');
console.log('✅ Бізнес-логіка відокремлена від технічних деталей');
console.log('✅ Дотримується принципу відкритості/закритості');
