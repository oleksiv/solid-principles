/**
 * Рефакторені класи User, які дотримуються принципу єдиної відповідальності (SRP)
 *
 * Кожен клас тепер має єдину відповідальність:
 * - User: Тільки зберігає дані користувача
 * - UserValidator: Тільки валідує дані користувача
 * - UserRepository: Тільки обробляє операції з базою даних
 * - UserFormatter: Тільки форматує дані користувача для відображення
 *
 * Це хороший приклад - кожен клас має лише одну причину для зміни
 */

// Клас User - відповідає тільки за зберігання даних користувача
export class User {
    constructor(private name: string, private email: string, private age: number) {}

    getName(): string {
        return this.name;
    }

    getEmail(): string {
        return this.email;
    }

    getAge(): number {
        return this.age;
    }
}

// UserValidator - відповідає тільки за валідацію
export class UserValidator {
    static validateEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static validateAge(age: number): boolean {
        return age >= 0 && age <= 120;
    }

    static validateName(name: string): boolean {
        return name.length >= 2 && name.length <= 50;
    }

    static validateUser(user: User): boolean {
        return (
            this.validateEmail(user.getEmail()) &&
            this.validateAge(user.getAge()) &&
            this.validateName(user.getName())
        );
    }
}

// UserRepository - відповідає тільки за операції з базою даних
export class UserRepository {
    saveUser(user: User): void {
        if (!UserValidator.validateUser(user)) {
            throw new Error('Invalid user data');
        }

        console.log(`Saving user ${user.getName()} to database...`);
        const query = `INSERT INTO users (name, email, age) VALUES ('${user.getName()}', '${user.getEmail()}', ${user.getAge()})`;
        this.executeQuery(query);
    }

    private executeQuery(query: string): void {
        console.log(`Executing: ${query}`);
    }
}

// UserFormatter - відповідає тільки за форматування даних користувача
export class UserFormatter {
    static toDisplayString(user: User): string {
        return `User: ${user.getName()} (${user.getEmail()}), Age: ${user.getAge()}`;
    }

    static toJSON(user: User): string {
        return JSON.stringify({
            name: user.getName(),
            email: user.getEmail(),
            age: user.getAge(),
        });
    }
}
