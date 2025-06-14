/**
 * Приклад порушення принципу відкритості/закритості в системі знижок
 *
 * Проблеми:
 * - Великі switch-блоки для кожного типу клієнта
 * - Дублювання логіки між методами
 * - Для додавання нового типу клієнта потрібно змінювати існуючий код
 * - Складно тестувати окремі типи знижок
 */

export enum CustomerType {
    REGULAR = 'regular',
    PREMIUM = 'premium',
    VIP = 'vip',
    STUDENT = 'student',
}

export interface Customer {
    id: string;
    name: string;
    type: CustomerType;
    memberSince: Date;
}

export class DiscountCalculator {
    calculateDiscount(customer: Customer, orderAmount: number): number {
        switch (customer.type) {
            case CustomerType.REGULAR:
                return 0;

            case CustomerType.PREMIUM:
                return orderAmount * 0.1;

            case CustomerType.VIP:
                const membershipYears = this.getYearsSinceMembership(customer.memberSince);
                if (membershipYears >= 2) {
                    return orderAmount * 0.2;
                }
                return orderAmount * 0.15;

            case CustomerType.STUDENT:
                return Math.min(orderAmount * 0.15, 500);

            default:
                throw new Error('Невідомий тип клієнта');
        }
    }

    getDiscountDescription(customer: Customer): string {
        switch (customer.type) {
            case CustomerType.REGULAR:
                return 'Без знижки';

            case CustomerType.PREMIUM:
                return 'Знижка 10% на всі товари';

            case CustomerType.VIP:
                const membershipYears = this.getYearsSinceMembership(customer.memberSince);
                if (membershipYears >= 2) {
                    return 'VIP знижка 20% на всі товари';
                }
                return 'VIP знижка 15% на всі товари';

            case CustomerType.STUDENT:
                return 'Студентська знижка 15% (максимум 500 грн)';

            default:
                throw new Error('Невідомий тип клієнта');
        }
    }

    private getYearsSinceMembership(memberSince: Date): number {
        const now = new Date();
        return now.getFullYear() - memberSince.getFullYear();
    }
}
