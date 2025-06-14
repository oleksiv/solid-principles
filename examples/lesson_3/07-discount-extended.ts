/**
 * Демонстрація розширення системи знижок новими стратегіями
 *
 * Додаємо нові типи знижок без зміни існуючого коду
 */

import { DiscountStrategy } from './06-discount-refactored';

// Знижка для пенсіонерів
export class SeniorDiscountStrategy extends DiscountStrategy {
    calculateDiscount(orderAmount: number, memberSince: Date): number {
        return orderAmount * 0.12;
    }

    getDescription(): string {
        return 'Знижка для пенсіонерів 12%';
    }
}

// Сезонна знижка з налаштовуваним відсотком
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
