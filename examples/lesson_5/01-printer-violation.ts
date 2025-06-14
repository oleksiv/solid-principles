/**
 * Порушення принципу розділення інтерфейсів (Interface Segregation Principle)
 *
 * Проблема: Великий інтерфейс AllInOnePrinter змушує всі класи реалізовувати
 * методи, які їм не потрібні. SimplePrinter вимушений кидати помилки для
 * методів, які він не підтримує.
 *
 * Це призводить до:
 * - Заплутаного коду
 * - Помилок під час виконання
 * - Складності підтримки та розширення
 */

export interface AllInOnePrinter {
    print(document: string): void;
    scan(document: string): string;
    fax(document: string, number: string): void;
    photocopy(document: string): string;
}

export class SimplePrinter implements AllInOnePrinter {
    print(document: string): void {
        console.log(`Друкую: ${document}`);
    }

    scan(document: string): string {
        throw new Error('Цей принтер не може сканувати!');
    }

    fax(document: string, number: string): void {
        throw new Error('Цей принтер не може відправляти факс!');
    }

    photocopy(document: string): string {
        throw new Error('Цей принтер не може копіювати!');
    }
}
