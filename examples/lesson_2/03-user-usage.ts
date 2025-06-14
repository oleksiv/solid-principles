/**
 * Приклад використання рефакторених класів User
 *
 * Це демонструє, як використовувати розділені класи
 * Кожен клас має свою відповідальність і може використовуватися незалежно
 */

import { User, UserValidator, UserRepository, UserFormatter } from './02-user-refactored';

// Створюємо нового користувача
const user = new User('Олександр', 'alex@example.com', 25);

// Валідуємо користувача
const isValid = UserValidator.validateUser(user);
console.log('User is valid:', isValid);

// Зберігаємо в базу даних
const repository = new UserRepository();
repository.saveUser(user);

// Форматуємо для відображення
const displayString = UserFormatter.toDisplayString(user);
const jsonString = UserFormatter.toJSON(user);

console.log(displayString);
console.log(jsonString);
