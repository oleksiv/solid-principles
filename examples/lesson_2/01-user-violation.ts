/**
 * Клас User, який порушує принцип єдиної відповідальності (SRP)
 *
 * Цей клас має кілька відповідальностей:
 * 1. Зберігання даних користувача
 * 2. Валідація даних користувача
 * 3. Збереження в базу даних
 * 4. Форматування даних для відображення
 *
 * Це поганий приклад - клас повинен мати лише одну причину для зміни
 */

export class User {
    private name: string;
    private email: string;
    private age: number;

    constructor(name: string, email: string, age: number) {
        this.name = name;
        this.email = email;
        this.age = age;
    }

    getName(): string {
        return this.name;
    }

    getEmail(): string {
        return this.email;
    }

    getAge(): number {
        return this.age;
    }

    validateEmail(): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(this.email);
    }

    validateAge(): boolean {
        return this.age >= 0 && this.age <= 120;
    }

    validateName(): boolean {
        return this.name.length >= 2 && this.name.length <= 50;
    }

    saveToDatabase(): void {
        if (this.validateEmail() && this.validateAge() && this.validateName()) {
            console.log(`Saving user ${this.name} to database...`);
            this.executeQuery(
                `INSERT INTO users (name, email, age) VALUES ('${this.name}', '${this.email}', ${this.age})`
            );
        } else {
            throw new Error('Invalid user data');
        }
    }

    private executeQuery(query: string): void {
        console.log(`Executing: ${query}`);
    }

    toDisplayString(): string {
        return `User: ${this.name} (${this.email}), Age: ${this.age}`;
    }

    toJSON(): string {
        return JSON.stringify({
            name: this.name,
            email: this.email,
            age: this.age,
        });
    }
}
