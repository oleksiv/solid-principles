/**
 * Рефакторингована система знижок з дотриманням принципу відкритості/закритості
 *
 * Переваги:
 * - Кожна стратегія знижки інкапсульована в окремому класі
 * - Легко додавати нові типи знижок без зміни існуючого коду
 * - Клієнт може динамічно змінювати свою стратегію знижки
 * - Простіше тестувати кожну стратегію окремо
 */

// Базовий абстрактний клас для всіх стратегій знижок
export abstract class DiscountStrategy {
    abstract calculateDiscount(orderAmount: number, memberSince: Date): number;
    abstract getDescription(): string;
}

// Конкретні стратегії знижок
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

// Клас клієнта тепер містить стратегію знижки
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

// Калькулятор знижок тепер не залежить від конкретних типів клієнтів
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
