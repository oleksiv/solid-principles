/**
 * Приклад використання рефакторованої системи логування
 *
 * Демонструє гнучкість системи - можемо використовувати різні логери
 * для різних середовищ без зміни основного коду UserService
 */

import {
    Logger,
    ConsoleLogger,
    FileLogger,
    RemoteLogger,
    UserService,
} from './05-logging-refactored';

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
