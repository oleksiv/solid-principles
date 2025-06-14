/**
 * Правильна реалізація принципу інверсії залежностей (DIP) для системи логування
 *
 * Переваги цього підходу:
 * - UserService залежить від абстракції (Logger), а не від конкретної реалізації
 * - Можемо легко змінювати спосіб логування (консоль, файл, віддалений сервер)
 * - Легко тестувати з мок-логерами
 * - Бізнес-логіка відокремлена від технічних деталей логування
 * - Можемо використовувати різні логери для різних середовищ (розробка, тестування, продакшн)
 */

// ✅ Абстракція для логування
export interface Logger {
    log(message: string): void;
}

// ✅ Різні реалізації логування
export class ConsoleLogger implements Logger {
    log(message: string): void {
        console.log(`[CONSOLE]: ${message}`);
    }
}

export class FileLogger implements Logger {
    log(message: string): void {
        console.log(`[FILE]: Записую в файл - ${message}`);
        // Тут була б логіка запису у файл
    }
}

export class RemoteLogger implements Logger {
    log(message: string): void {
        console.log(`[REMOTE]: Відправляю на сервер - ${message}`);
        // Тут була б логіка відправки на віддалений сервер
    }
}

// ✅ UserService тепер залежить від абстракції
export class UserService {
    private logger: Logger;

    constructor(logger: Logger) {
        this.logger = logger;
    }

    createUser(name: string, email: string): void {
        // Бізнес-логіка створення користувача
        this.logger.log(`Створюю користувача ${name}`);

        // Використовуємо абстракцію для логування
        this.logger.log(`Користувач ${name} створений успішно`);
    }

    deleteUser(id: string): void {
        // Бізнес-логіка видалення
        this.logger.log(`Видаляю користувача з ID: ${id}`);

        // Використовуємо абстракцію для логування
        this.logger.log(`Користувач ${id} видалений`);
    }
}

// Створюємо різні типи логерів
const consoleLogger = new ConsoleLogger();
const fileLogger = new FileLogger();
const remoteLogger = new RemoteLogger();

// Створюємо UserService з різними логерами для різних середовищ
const userServiceDev = new UserService(consoleLogger); // Для розробки
const userServiceProd = new UserService(remoteLogger); // Для продакшену
const userServiceTest = new UserService(fileLogger); // Для тестування

console.log('=== Тестування різних систем логування ===');

console.log('\n1. Розробка (консольний логер):');
userServiceDev.createUser('Іван', 'ivan@example.com');
userServiceDev.deleteUser('user123');

console.log('\n2. Продакшн (віддалений логер):');
userServiceProd.createUser('Марія', 'maria@example.com');
userServiceProd.deleteUser('user456');

console.log('\n3. Тестування (файловий логер):');
userServiceTest.createUser('Петро', 'petro@example.com');
userServiceTest.deleteUser('user789');

// Приклад створення мок-логера для юніт-тестів
class MockLogger implements Logger {
    private logs: string[] = [];

    log(message: string): void {
        this.logs.push(message);
        console.log(`[MOCK]: ${message}`);
    }

    getLogs(): string[] {
        return [...this.logs];
    }

    clearLogs(): void {
        this.logs = [];
    }
}

console.log('\n4. Тестування з мок-логером:');
const mockLogger = new MockLogger();
const userServiceMock = new UserService(mockLogger);

userServiceMock.createUser('Тестовий Користувач', 'test@example.com');
console.log('Записані логи:', mockLogger.getLogs());
