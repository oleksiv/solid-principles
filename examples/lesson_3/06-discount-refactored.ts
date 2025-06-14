export abstract class DiscountStrategy {
    abstract calculateDiscount(orderAmount: number, memberSince: Date): number;
    abstract getDescription(): string;
}

export class NoDiscountStrategy extends DiscountStrategy {
    calculateDiscount(orderAmount: number, memberSince: Date): number {
        return 0;
    }

    getDescription(): string {
        return 'Без знижки';
    }
}

export class PremiumDiscountStrategy extends DiscountStrategy {
    calculateDiscount(orderAmount: number, memberSince: Date): number {
        return orderAmount * 0.1;
    }

    getDescription(): string {
        return 'Знижка 10% на всі товари';
    }
}

export class VipDiscountStrategy extends DiscountStrategy {
    calculateDiscount(orderAmount: number, memberSince: Date): number {
        const membershipYears = this.getYearsSinceMembership(memberSince);
        if (membershipYears >= 2) {
            return orderAmount * 0.2;
        }
        return orderAmount * 0.15;
    }

    getDescription(): string {
        return 'VIP знижка до 20% на всі товари';
    }

    private getYearsSinceMembership(memberSince: Date): number {
        const now = new Date();
        return now.getFullYear() - memberSince.getFullYear();
    }
}

export class StudentDiscountStrategy extends DiscountStrategy {
    calculateDiscount(orderAmount: number, memberSince: Date): number {
        return Math.min(orderAmount * 0.15, 500);
    }

    getDescription(): string {
        return 'Студентська знижка 15% (максимум 500 грн)';
    }
}

export class SeniorDiscountStrategy extends DiscountStrategy {
    calculateDiscount(orderAmount: number, memberSince: Date): number {
        return orderAmount * 0.12;
    }

    getDescription(): string {
        return 'Знижка для пенсіонерів 12%';
    }
}

export class SeasonalDiscountStrategy extends DiscountStrategy {
    constructor(private seasonalRate: number, private seasonName: string) {
        super();
    }

    calculateDiscount(orderAmount: number, memberSince: Date): number {
        return orderAmount * this.seasonalRate;
    }

    getDescription(): string {
        return `${this.seasonName} знижка ${this.seasonalRate * 100}%`;
    }
}

export class Customer {
    constructor(
        private id: string,
        private name: string,
        private discountStrategy: DiscountStrategy,
        private memberSince: Date
    ) {}

    getId(): string {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    getDiscountStrategy(): DiscountStrategy {
        return this.discountStrategy;
    }

    getMemberSince(): Date {
        return this.memberSince;
    }

    setDiscountStrategy(strategy: DiscountStrategy): void {
        this.discountStrategy = strategy;
    }
}

export class DiscountCalculator {
    calculateDiscount(customer: Customer, orderAmount: number): number {
        return customer
            .getDiscountStrategy()
            .calculateDiscount(orderAmount, customer.getMemberSince());
    }

    getDiscountDescription(customer: Customer): string {
        return customer.getDiscountStrategy().getDescription();
    }

    calculateFinalPrice(customer: Customer, orderAmount: number): number {
        const discount = this.calculateDiscount(customer, orderAmount);
        return orderAmount - discount;
    }

    generateDiscountReport(customer: Customer, orderAmount: number): string {
        const discount = this.calculateDiscount(customer, orderAmount);
        const finalPrice = this.calculateFinalPrice(customer, orderAmount);
        const description = this.getDiscountDescription(customer);

        return `
      Клієнт: ${customer.getName()}
      Сума замовлення: ${orderAmount} грн
      Тип знижки: ${description}
      Розмір знижки: ${discount.toFixed(2)} грн
      До сплати: ${finalPrice.toFixed(2)} грн
    `;
    }
}

const customers = [
    new Customer('1', 'Іван Звичайний', new NoDiscountStrategy(), new Date('2023-01-01')),
    new Customer('2', 'Марія Преміум', new PremiumDiscountStrategy(), new Date('2022-06-15')),
    new Customer('3', 'Олександр VIP', new VipDiscountStrategy(), new Date('2020-03-20')),
    new Customer('4', 'Анна Студентка', new StudentDiscountStrategy(), new Date('2023-09-01')),
    new Customer('5', 'Петро Пенсіонер', new SeniorDiscountStrategy(), new Date('2021-12-10')),
];

const newYearDiscount = new SeasonalDiscountStrategy(0.25, 'Новорічна');
customers.push(new Customer('6', 'Оксана Новорічна', newYearDiscount, new Date('2023-01-15')));

const calculator = new DiscountCalculator();
const orderAmount = 1000;

customers.forEach((customer) => {
    const report = calculator.generateDiscountReport(customer, orderAmount);
    console.log(report);
    console.log('---');
});

const regularCustomer = customers[0];
console.log('До зміни статусу:', calculator.getDiscountDescription(regularCustomer));

regularCustomer.setDiscountStrategy(new VipDiscountStrategy());
console.log('Після отримання VIP:', calculator.getDiscountDescription(regularCustomer));
