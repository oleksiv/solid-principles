/**
 * Клас User, який порушує принцип єдиної відповідальності (SRP)
 *
 * Цей клас має кілька відповідальностей:
 * 1. Управління даними користувача (getName, getEmail, getAge)
 * 2. Валідація даних (validateEmail, validateAge, validateName)
 * 3. Збереження в базу даних (saveToDatabase, executeQuery)
 * 4. Форматування даних для відображення (toDisplayString, toJSON)
 *
 * Це поганий приклад - занадто багато причин для зміни цього класу
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

    // Відповідальність 1: Управління даними користувача
    getName(): string {
        return this.name;
    }

    getEmail(): string {
        return this.email;
    }

    getAge(): number {
        return this.age;
    }

    // Відповідальність 2: Валідація даних
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

    // Відповідальність 3: Збереження в базу даних
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

    // Відповідальність 4: Форматування даних для відображення
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

// Приклад використання
// Створюємо користувача
const user = new User('Олександр', 'alex@example.com', 25);

// Використовуємо всі його "можливості"
console.log(user.getName());
console.log('Email valid:', user.validateEmail());
user.saveToDatabase();
console.log(user.toDisplayString());
