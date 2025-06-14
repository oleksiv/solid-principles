# Скрипт до Уроку 2: Single Responsibility Principle

Привіт! Сьогодні ми поговоримо про перший та найважливіший принцип з акроніма SOLID – це Single Responsibility Principle, або принцип єдиної відповідальності. Якщо ти хочеш писати код, який легко читати, тестувати та підтримувати, то розуміння цього принципу – це твій фундамент.

## Що таке Single Responsibility Principle

Single Responsibility Principle дуже простий у формулюванні: кожен клас повинен мати лише одну причину для зміни. Іншими словами, клас повинен відповідати за одну конкретну річ і робити її добре.

Роберт Мартін, відомий як Uncle Bob, сформулював це так: "A class should have only one reason to change". Але що це означає на практиці?

Коли ми кажемо про "одну відповідальність", ми маємо на увазі, що клас повинен вирішувати одну конкретну задачу, мати єдину чітко визначену мету, і змінюватися лише з однієї причини.

## Як швидко виявити порушення SRP

Перш ніж показати приклади, давай розберемо кілька простих правил, які допоможуть тобі швидко визначити, чи порушує клас принцип єдиної відповідальності.

Перше правило – це правило "І" проти "АБО". Якщо ти описуєш клас і використовуєш сполучники "і", "також", "крім того" – це червоний прапорець. Наприклад: "Клас User зберігає дані користувача І валідує їх І зберігає в базу даних І відправляє email". Це явно занадто багато для одного класу.

Друге правило – запитай себе: "З яких причин може змінюватися цей клас?" Якщо причин більше однієї, клас порушує SRP.

Третє правило – подивися на імпорти. Якщо клас імпортує бібліотеки для бази даних, email-сервісів, валідації та логування одночасно, це сигнал тривоги.

## Приклад порушення SRP

Тепер давай подивимося на конкретний приклад. Ось клас User, який порушує принцип єдиної відповідальності:

```typescript
class User {
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
```

А тепер подивимося, як цей клас використовується:

```typescript
// Створюємо користувача
const user = new User('Олександр', 'alex@example.com', 25);

// Використовуємо всі його "можливості"
console.log(user.getName());
console.log('Email valid:', user.validateEmail());
user.saveToDatabase();
console.log(user.toDisplayString());
```

## Проблеми з цим підходом

Бачиш, що відбувається? Цей клас User намагається робити абсолютно все: зберігати дані, валідувати їх, зберігати в базу даних і навіть форматувати для відображення. Це класичний приклад "God Object" – об'єкта, який знає і робить занадто багато.

Які проблеми це створює? По-перше, цей клас має чотири різні причини для зміни. Якщо ми захочемо змінити правила валідації email, нам доведеться змінювати клас User. Якщо ми захочемо перейти з SQL на NoSQL базу даних, знову зміни в User. Якщо нам потрібен інший формат JSON, знову User.

По-друге, тестування стає кошмаром. Щоб протестувати метод saveToDatabase, нам потрібно мокати базу даних. Щоб протестувати валідацію, нам не потрібна база даних, але вона все одно там є.

По-третє, код стає важко читати та розуміти. Коли ти бачиш клас User, ти не знаєш, чи це просто модель даних, чи це сервіс, чи це щось інше.

## Рефакторинг згідно з SRP

Тепер давай виправимо цю ситуацію, розділивши відповідальності на окремі класи.

Спочатку створимо клас User, який відповідає тільки за зберігання даних користувача:

```typescript
class User {
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
```

Тепер створимо окремий клас для валідації:

```typescript
class UserValidator {
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
```

Далі створимо клас для роботи з базою даних:

```typescript
class UserRepository {
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
```

І нарешті, клас для форматування даних:

```typescript
class UserFormatter {
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
```

## Використання рефакторованого коду

Тепер подивимося, як використовується наш рефакторований код:

```typescript
// Створюємо користувача
const user = new User('Олександр', 'alex@example.com', 25);

// Валідуємо
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
```

## Переваги нового підходу

Що ми отримали від цього рефакторингу? Тепер кожен клас має одну чітку відповідальність. User тільки зберігає дані. UserValidator тільки валідує. UserRepository тільки працює з базою даних. UserFormatter тільки форматує дані.

Це дає нам кілька важливих переваг. По-перше, код стає набагато легше тестувати. Щоб протестувати валідацію email, мені не потрібна база даних. Щоб протестувати збереження в базу даних, мені не потрібно знати деталі форматування.

По-друге, зміни стають локальними. Якщо я хочу змінити правила валідації, я змінюю тільки UserValidator. Якщо я хочу перейти на іншу базу даних, я змінюю тільки UserRepository.

По-третє, код стає більш читабельним. Коли ти бачиш клас UserRepository, ти одразу розумієш, що він робить.

## Другий приклад

Давай розглянемо ще один приклад, щоб закріпити розуміння. Ось клас Order, який також порушує SRP:

```typescript
class Order {
    private items: Array<{ name: string; price: number; quantity: number }> = [];
    private customerEmail: string;

    constructor(customerEmail: string) {
        this.customerEmail = customerEmail;
    }

    // Відповідальність 1: Управління товарами
    addItem(name: string, price: number, quantity: number): void {
        this.items.push({ name, price, quantity });
    }

    getItems(): Array<{ name: string; price: number; quantity: number }> {
        return [...this.items];
    }

    // Відповідальність 2: Обчислення вартості
    calculateTotal(): number {
        return this.items.reduce((total, item) => {
            return total + item.price * item.quantity;
        }, 0);
    }

    calculateTax(): number {
        return this.calculateTotal() * 0.2;
    }

    calculateTotalWithTax(): number {
        return this.calculateTotal() + this.calculateTax();
    }

    // Відповідальність 3: Відправка email
    sendConfirmationEmail(): void {
        const total = this.calculateTotalWithTax();
        const emailBody = `
      Дякуємо за замовлення!
      Товарів: ${this.items.length}
      Загальна сума: ${total} грн
    `;

        this.sendEmail(this.customerEmail, 'Підтвердження замовлення', emailBody);
    }

    private sendEmail(to: string, subject: string, body: string): void {
        console.log(`Sending email to ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`Body: ${body}`);
    }

    // Відповідальність 4: Логування
    logOrder(): void {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] Order created for ${
            this.customerEmail
        }, Total: ${this.calculateTotalWithTax()} грн`;

        this.writeToLogFile(logEntry);
    }

    private writeToLogFile(entry: string): void {
        console.log(`Writing to log: ${entry}`);
    }
}
```

Використання цього класу виглядає так:

```typescript
const order = new Order('customer@example.com');
order.addItem('Ноутбук', 25000, 1);
order.addItem('Миша', 500, 2);

// Клас робить абсолютно все
console.log('Total:', order.calculateTotalWithTax());
order.sendConfirmationEmail();
order.logOrder();
```

Знову ж таки, цей клас намагається робити занадто багато: управляти товарами, обчислювати вартість, відправляти email та вести логи.

## Рефакторинг другого прикладу

Давай розділимо відповідальності:

```typescript
class Order {
    private items: Array<{ name: string; price: number; quantity: number }> = [];

    constructor(private customerEmail: string) {}

    addItem(name: string, price: number, quantity: number): void {
        this.items.push({ name, price, quantity });
    }

    getItems(): Array<{ name: string; price: number; quantity: number }> {
        return [...this.items];
    }

    getCustomerEmail(): string {
        return this.customerEmail;
    }
}
```

```typescript
class OrderCalculator {
    static calculateTotal(order: Order): number {
        return order.getItems().reduce((total, item) => {
            return total + item.price * item.quantity;
        }, 0);
    }

    static calculateTax(order: Order): number {
        return this.calculateTotal(order) * 0.2;
    }

    static calculateTotalWithTax(order: Order): number {
        return this.calculateTotal(order) + this.calculateTax(order);
    }
}
```

```typescript
class OrderEmailService {
    static sendConfirmationEmail(order: Order): void {
        const total = OrderCalculator.calculateTotalWithTax(order);
        const emailBody = `
      Дякуємо за замовлення!
      Товарів: ${order.getItems().length}
      Загальна сума: ${total} грн
    `;

        this.sendEmail(order.getCustomerEmail(), 'Підтвердження замовлення', emailBody);
    }

    private static sendEmail(to: string, subject: string, body: string): void {
        console.log(`Sending email to ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`Body: ${body}`);
    }
}
```

```typescript
class OrderLogger {
    static logOrder(order: Order): void {
        const timestamp = new Date().toISOString();
        const total = OrderCalculator.calculateTotalWithTax(order);
        const logEntry = `[${timestamp}] Order created for ${order.getCustomerEmail()}, Total: ${total} грн`;

        this.writeToLogFile(logEntry);
    }

    private static writeToLogFile(entry: string): void {
        console.log(`Writing to log: ${entry}`);
    }
}
```

Використання рефакторованого коду:

```typescript
// Створюємо замовлення
const order = new Order('customer@example.com');
order.addItem('Ноутбук', 25000, 1);
order.addItem('Миша', 500, 2);

// Кожен компонент відповідає за свою частину
const total = OrderCalculator.calculateTotalWithTax(order);
console.log(`Total: ${total} грн`);

OrderEmailService.sendConfirmationEmail(order);
OrderLogger.logOrder(order);
```

## Аналогія з реального життя

Щоб краще зрозуміти принцип, подумай про ресторан. Уяви, що один офіціант одночасно приймає замовлення, готує їжу, миє посуд, веде бухгалтерію та прибирає зал. Це було б абсолютно неефективно!

Натомість, у ресторані кожен має свою роль: офіціант приймає замовлення, кухар готує, касир працює з грошима. Кожен робить свою роботу і робить її добре. Так само повинно бути і в коді.

## Підсумок

Single Responsibility Principle – це не просто теоретичний принцип. Це практичний інструмент, який допомагає писати код, який легко читати, тестувати та підтримувати.

Запам'ятай: кожен клас повинен мати лише одну причину для зміни. Якщо ти можеш назвати кілька різних причин, чому клас може змінитися, це сигнал, що пора рефакторити.

Перегляди свій код і запитай себе: "Скільки різних речей робить цей клас?" Якщо відповідь "більше однієї", то це твій кандидат на рефакторинг.

У наступному уроці ми розглянемо Open/Closed Principle – принцип, який навчить тебе робити код відкритим для розширення, але закритим для модифікацій. До зустрічі!
