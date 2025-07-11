/**
 * Правильна реалізація принципу розділення інтерфейсів (Interface Segregation Principle)
 *
 * Рішення: Замість одного великого інтерфейсу створюємо кілька маленьких,
 * кожен з яких відповідає за одну конкретну функцію.
 *
 * Переваги:
 * - Кожен клас реалізує тільки потрібні йому методи
 * - Немає зайвих винятків
 * - Легше тестувати та підтримувати
 * - Гнучкість у комбінуванні функцій
 */

export interface Printable {
    print(document: string): void;
}

export interface Scannable {
    scan(document: string): string;
}

export interface Faxable {
    fax(document: string, number: string): void;
}

export interface Photocopiable {
    photocopy(document: string): string;
}

export class SimplePrinter implements Printable {
    print(document: string): void {
        console.log(`Друкую: ${document}`);
    }
}

export class MultiFunctionPrinter implements Printable, Scannable, Faxable {
    print(document: string): void {
        console.log(`Друкую: ${document}`);
    }

    scan(document: string): string {
        console.log(`Сканую: ${document}`);
        return `Скановані дані з ${document}`;
    }

    fax(document: string, number: string): void {
        console.log(`Відправляю факс ${document} на номер ${number}`);
    }
}

// Створюємо екземпляри принтерів
const simplePrinter = new SimplePrinter();
const multiPrinter = new MultiFunctionPrinter();

// Простий принтер може тільки друкувати
simplePrinter.print('Важливий документ');

// Багатофункціональний принтер може робити все, що вміє
multiPrinter.print('Звіт');
multiPrinter.scan('Документ');
multiPrinter.fax('Контракт', '+380501234567');

// Якщо спробувати викликати метод сканування на простому принтері,
// TypeScript покаже помилку компіляції:
// simplePrinter.scan("документ"); // ❌ Помилка компіляції!
