# Сценарій відеоуроку: Single Responsibility Principle

Привіт! Сьогодні ми з тобою розберемо перший і, мабуть, найважливіший принцип з акроніма SOLID. Це Single Responsibility Principle або, простіше кажучи, Принцип єдиної відповідальності.

Знаєш, коли я вперше почув про цей принцип, то подумав — ну що тут складного? Один клас — одна відповідальність. Але насправді це один з тих принципів, які легко зрозуміти, але складно правильно застосовувати. Сьогодні я покажу тобі, як навчитися бачити порушення цього принципу в коді та як їх виправляти.

Отже, що ж таке цей Single Responsibility Principle? Роберт Мартін, якого всі знають як Uncle Bob, сформулював це так: клас повинен мати лише одну причину для зміни. Звучить просто, правда? Але давай розберемося, що це означає на практиці.

Уяви собі швейцарський ніж. Класна штука — і ножиці там є, і відкривачка, і пилочка, і ще купа всього. Але чи зручно ним користуватися? Якщо тобі потрібно просто порізати хліб, то набагато зручніше взяти звичайний кухонний ніж. Так само і з класами в коді — коли клас намагається робити все одразу, він стає незручним у використанні та підтримці.

Давай одразу подивимося на реальний приклад. Ось типовий клас User, який можна зустріти в багатьох проєктах:

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
```

На перший погляд виглядає нормально, правда? Клас User, який працює з даними користувача. Але давай подивимося уважніше. Що робить цей клас? По-перше, він зберігає дані користувача — ім'я, email, вік. По-друге, він валідує ці дані — перевіряє правильність email, допустимість віку. По-третє, він зберігає дані в базу даних. І по-четверте, він форматує дані для відображення.

Бачиш проблему? Цей клас робить аж чотири різні речі! І кожна з них може змінюватися з різних причин. Наприклад, якщо ми захочемо змінити правила валідації email — доведеться змінювати клас User. Якщо захочемо перейти з SQL на MongoDB — знову змінюємо User. Якщо потрібен новий формат відображення — і знову ліземо в той самий клас.

Це як якби в ресторані один працівник одночасно був офіціантом, кухарем, прибиральником і бухгалтером. Неефективно і заплутано!

Давай я покажу тобі кілька простих правил, які допоможуть швидко визначити, чи порушує твій клас принцип єдиної відповідальності.

Перше правило — це правило "І". Якщо ти описуєш клас і використовуєш слова "і", "також", "крім того" — це червоний прапорець. Наприклад: "Клас User зберігає дані користувача І валідує їх І зберігає в базу даних". Бачиш скільки "І"? Це явна ознака порушення принципу.

Друге правило — подумай про причини для зміни. Запитай себе: з яких причин може змінюватися цей клас? Якщо причин більше однієї — клас порушує SRP.

Третє правило — подивись на імпорти. Якщо клас імпортує бібліотеки для роботи з базою даних, email-сервісами, валідацією та логуванням одночасно — це теж сигнал проблеми.

Четверте правило стосується тестування. Якщо для тестування одного методу тобі потрібно створювати моки для бази даних, email-сервісу, валідатора і ще чогось — клас робить занадто багато.

І останнє правило — розмір класу. Якщо клас більше 200-300 рядків коду або має більше 10-15 публічних методів — варто задуматися про рефакторинг.

Тепер давай виправимо наш клас User. Розділимо всі відповідальності на окремі класи. Спочатку залишимо в класі User тільки те, що він повинен робити — зберігати дані:

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

Бачиш, наскільки простішим став клас? Тепер він робить тільки одну річ — зберігає дані користувача. Ніякої логіки, ніяких залежностей. Простий контейнер для даних.

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

Цей клас відповідає тільки за валідацію. Якщо нам потрібно змінити правила валідації — ми змінюємо тільки цей клас. User про це навіть не дізнається.

Далі створюємо клас для роботи з базою даних:

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

UserRepository відповідає тільки за збереження користувачів у базу даних. Якщо ми захочемо перейти на іншу базу даних — змінюємо тільки цей клас.

І нарешті, клас для форматування:

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

Тепер подивимося, як використовувати весь цей рефакторений код:

```typescript
const user = new User('Олександр', 'alex@example.com', 25);

const isValid = UserValidator.validateUser(user);
console.log('User is valid:', isValid);

const repository = new UserRepository();
repository.saveUser(user);

const displayString = UserFormatter.toDisplayString(user);
const jsonString = UserFormatter.toJSON(user);

console.log(displayString);
console.log(jsonString);
```

Бачиш, як все стало простіше і зрозуміліше? Кожен клас має свою чітку роль. User просто зберігає дані. UserValidator перевіряє їх коректність. UserRepository зберігає в базу даних. UserFormatter форматує для відображення.

Тепер уяви, що тобі потрібно змінити формат відображення користувача. Раніше довелося б лізти в величезний клас User і шукати потрібний метод серед купи іншого коду. А тепер ти просто відкриваєш UserFormatter і одразу бачиш весь код, пов'язаний з форматуванням.

Або, скажімо, потрібно додати нове правило валідації. Відкриваєш UserValidator — і все, що стосується валідації, зібрано в одному місці. Не потрібно перестрибувати між різними методами в різних частинах файлу.

Давай розглянемо ще один приклад, щоб закріпити розуміння. Ось клас Order, який теж порушує принцип єдиної відповідальності:

```typescript
class Order {
    private items: Array<{ name: string; price: number; quantity: number }> = [];
    private customerEmail: string;

    constructor(customerEmail: string) {
        this.customerEmail = customerEmail;
    }

    addItem(name: string, price: number, quantity: number): void {
        this.items.push({ name, price, quantity });
    }

    getItems(): Array<{ name: string; price: number; quantity: number }> {
        return [...this.items];
    }

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

Знову та сама проблема — клас робить занадто багато. Він управляє товарами, рахує вартість, відправляє email і веде логи. Давай розділимо ці відповідальності.

Спочатку залишимо в Order тільки управління товарами:

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

Тепер створимо окремий клас для обчислень:

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

Клас для відправки email:

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

І клас для логування:

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

Тепер використання виглядає так:

```typescript
const order = new Order('customer@example.com');
order.addItem('Ноутбук', 25000, 1);
order.addItem('Миша', 500, 2);

const total = OrderCalculator.calculateTotalWithTax(order);
console.log(`Total: ${total} грн`);

OrderEmailService.sendConfirmationEmail(order);

OrderLogger.logOrder(order);
```

Бачиш закономірність? В обох прикладах ми взяли перевантажений клас і розділили його на кілька маленьких, кожен з яких робить щось одне. Це і є суть принципу єдиної відповідальності.

Знаєш, що найкраще в цьому підході? Тестування! Раніше, щоб протестувати метод calculateTotal, тобі довелося б створювати цілий об'єкт Order з усіма його залежностями. А тепер ти можеш просто протестувати OrderCalculator окремо. Не потрібно думати про email, логування чи щось інше.

Також подумай про командну роботу. Якщо один розробник працює над логікою обчислень, а інший — над відправкою email, вони не заважатимуть один одному. Кожен працює зі своїм класом, і ризик конфліктів при злитті коду мінімальний.

Ще одна перевага — повторне використання. Наприклад, UserValidator можна використати не тільки при збереженні в базу даних, а й при реєстрації, редагуванні профілю, імпорті даних. Якби валідація була зашита в клас User, довелося б дублювати код або створювати дивні залежності.

Давай підсумуємо. Single Responsibility Principle — це не просто теоретична концепція. Це практичний інструмент, який робить твій код кращим. Кожен клас повинен мати одну чітку відповідальність і одну причину для зміни.

Як перевірити, чи дотримуєшся ти цього принципу? Запитай себе: якщо я опишу, що робить цей клас, скільки разів я використаю слово "і"? Якщо більше одного — варто задуматися про рефакторинг.

Пам'ятай — код пишеться один раз, а читається та змінюється десятки разів. Роби його простим і зрозумілим. Принцип єдиної відповідальності — твій надійний помічник у цьому.

На цьому наш урок закінчується. Спробуй застосувати цей принцип у своєму коді. Знайди клас, який робить занадто багато, і спробуй розділити його на кілька менших. Побачиш, наскільки простішим і зрозумілішим стане твій код!

У наступному уроці ми розглянемо Open/Closed Principle — принцип, який навчить тебе робити код відкритим для розширення, але закритим для модифікацій. Це теж дуже корисний принцип, який допоможе тобі писати гнучкий код, що легко розширювати новою функціональністю.

До зустрічі в наступному уроці!
