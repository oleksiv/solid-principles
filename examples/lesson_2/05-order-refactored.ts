// Клас Order - відповідає тільки за управління даними замовлення
export class Order {
    private items: Array<{ name: string; price: number; quantity: number }> = [];

    constructor(private customerEmail: string) {}

    addItem(name: string, price: number, quantity: number): void {
        this.items.push({ name, price, quantity });
    }

    getItems(): Array<{ name: string; price: number; quantity: number }> {
        return [...this.items];
    }

    getCustomerEmail(): string {
        return this.customerEmail;
    }
}

// OrderCalculator - відповідає тільки за обчислення
export class OrderCalculator {
    static calculateTotal(order: Order): number {
        return order.getItems().reduce((total, item) => {
            return total + item.price * item.quantity;
        }, 0);
    }

    static calculateTax(order: Order): number {
        return this.calculateTotal(order) * 0.2;
    }

    static calculateTotalWithTax(order: Order): number {
        return this.calculateTotal(order) + this.calculateTax(order);
    }
}

// OrderEmailService - відповідає тільки за відправку email
export class OrderEmailService {
    static sendConfirmationEmail(order: Order): void {
        const total = OrderCalculator.calculateTotalWithTax(order);
        const emailBody = `
      Дякуємо за замовлення!
      Товарів: ${order.getItems().length}
      Загальна сума: ${total} грн
    `;

        this.sendEmail(order.getCustomerEmail(), 'Підтвердження замовлення', emailBody);
    }

    private static sendEmail(to: string, subject: string, body: string): void {
        console.log(`Sending email to ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`Body: ${body}`);
    }
}

// OrderLogger - відповідає тільки за логування
export class OrderLogger {
    static logOrder(order: Order): void {
        const timestamp = new Date().toISOString();
        const total = OrderCalculator.calculateTotalWithTax(order);
        const logEntry = `[${timestamp}] Order created for ${order.getCustomerEmail()}, Total: ${total} грн`;

        this.writeToLogFile(logEntry);
    }

    private static writeToLogFile(entry: string): void {
        console.log(`Writing to log: ${entry}`);
    }
}

// Створюємо замовлення
const order = new Order('customer@example.com');
order.addItem('Ноутбук', 25000, 1);
order.addItem('Миша', 500, 2);

// Кожен компонент відповідає за свою частину
const total = OrderCalculator.calculateTotalWithTax(order);
console.log(`Total: ${total} грн`);

OrderEmailService.sendConfirmationEmail(order);
OrderLogger.logOrder(order);
