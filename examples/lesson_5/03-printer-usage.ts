/**
 * Приклад використання рефакторених класів принтерів
 *
 * Демонструє як працюють класи, що дотримуються принципу розділення інтерфейсів.
 * Кожен клас має тільки ті методи, які йому потрібні, без зайвих винятків.
 */

import { SimplePrinter, MultiFunctionPrinter } from './02-printer-refactored';

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
