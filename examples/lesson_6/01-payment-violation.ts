/**
 * Приклад порушення принципу інверсії залежностей (DIP)
 *
 * Проблеми цього коду:
 * - OrderService жорстко прив'язаний до PayPalPayment
 * - Щоб додати Stripe або банківську карту, треба переписувати OrderService
 * - Складно тестувати — не можемо підставити мок-об'єкт
 * - Порушується принцип відкритості/закритості (OCP)
 * - Високорівневий клас залежить від конкретної реалізації, а не від абстракції
 */

export class PayPalPayment {
    processPayment(amount: number): boolean {
        console.log(`Обробляю ${amount} грн через PayPal`);
        return true;
    }
}

export class OrderService {
    private paymentProcessor: PayPalPayment;

    constructor() {
        // 🚨 Проблема: жорстка залежність від конкретної реалізації
        this.paymentProcessor = new PayPalPayment();
    }

    processOrder(amount: number): void {
        console.log('Обробляю замовлення...');
        const success = this.paymentProcessor.processPayment(amount);
        if (success) {
            console.log('Замовлення успішно оплачено!');
        }
    }
}
