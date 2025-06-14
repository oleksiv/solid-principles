/**
 * Клас Order, який порушує принцип єдиної відповідальності (SRP)
 *
 * Цей клас має кілька відповідальностей:
 * 1. Управління товарами замовлення
 * 2. Обчислення цін та податків
 * 3. Відправка email підтверджень
 * 4. Логування інформації про замовлення
 *
 * Це поганий приклад - занадто багато причин для зміни цього класу
 */

export class Order {
    private items: Array<{ name: string; price: number; quantity: number }> = [];
    private customerEmail: string;

    constructor(customerEmail: string) {
        this.customerEmail = customerEmail;
    }

    addItem(name: string, price: number, quantity: number): void {
        this.items.push({ name, price, quantity });
    }

    getItems(): Array<{ name: string; price: number; quantity: number }> {
        return [...this.items];
    }

    calculateTotal(): number {
        return this.items.reduce((total, item) => {
            return total + item.price * item.quantity;
        }, 0);
    }

    calculateTax(): number {
        return this.calculateTotal() * 0.2;
    }

    calculateTotalWithTax(): number {
        return this.calculateTotal() + this.calculateTax();
    }

    sendConfirmationEmail(): void {
        const total = this.calculateTotalWithTax();
        const emailBody = `
      Дякуємо за замовлення!
      Товарів: ${this.items.length}
      Загальна сума: ${total} грн
    `;

        this.sendEmail(this.customerEmail, 'Підтвердження замовлення', emailBody);
    }

    private sendEmail(to: string, subject: string, body: string): void {
        console.log(`Sending email to ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`Body: ${body}`);
    }

    logOrder(): void {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] Order created for ${
            this.customerEmail
        }, Total: ${this.calculateTotalWithTax()} грн`;

        this.writeToLogFile(logEntry);
    }

    private writeToLogFile(entry: string): void {
        console.log(`Writing to log: ${entry}`);
    }
}

// Приклад використання
const order = new Order('customer@example.com');
order.addItem('Ноутбук', 25000, 1);
order.addItem('Миша', 500, 2);
order.sendConfirmationEmail();
order.logOrder();
