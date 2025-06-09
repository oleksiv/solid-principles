# 📘 **Урок 2: S – Single Responsibility Principle (Принцип єдиної відповідальності)**

---

## 🎬 **ВСТУП**

Привіт! Сьогодні ми розглянемо перший і, мабуть, найважливіший принцип з акроніма SOLID – це **Single Responsibility Principle** або **Принцип єдиної відповідальності**. Цей принцип є фундаментом для написання чистого, підтримуваного коду, який легко тестувати та розширювати. Розуміння SRP допоможе вам уникнути багатьох поширених помилок в архітектурі додатків та зробить ваш код більш професійним.

---

## 📖 **ТЕОРЕТИЧНЕ ПІДГРУНТЯ**

### **Визначення принципу**

**Single Responsibility Principle (SRP)** стверджує, що **кожен клас повинен мати лише одну причину для зміни**. Іншими словами, клас повинен відповідати за одну конкретну функціональність або мати одну відповідальність.

### **Класичне формулювання**

_"A class should have only one reason to change"_ – Роберт Мартінг (Uncle Bob)

### **Що це означає на практиці**

Коли ми кажемо про "одну відповідальність", ми маємо на увазі, що клас повинен:

- Вирішувати одну конкретну задачу
- Мати єдину, чітко визначену мету
- Змінюватися лише з однієї причини

### **Часті помилки при порушенні SRP**

1. **God Object** – клас, який робить занадто багато різних речей
2. **Змішування бізнес-логіки з логікою представлення**
3. **Поєднання валідації, збереження даних та їх обробки в одному класі**
4. **Клас, що одночасно керує UI та мережевими запитами**

### **Наслідки порушення принципу**

- **Складність тестування** – важко написати unit-тести для класу з багатьма відповідальностями
- **Порушення інкапсуляції** – клас знає занадто багато про різні частини системи
- **Високе зчеплення** – зміни в одній частині коду впливають на інші незалежні частини
- **Труднощі з підтримкою** – важко зрозуміти, що робить клас, та безпечно його змінювати

### **📏 Практичні правила для виявлення порушень SRP**

**Щоб швидко визначити, чи порушує клас принцип єдиної відповідальності, використовуйте ці прості правила:**

#### **1. Правило "І" vs "АБО"**

Якщо ви описуєте клас і використовуєте сполучники **"і"**, **"також"**, **"крім того"** – це сигнал тривоги:

❌ **Погано:** "Клас User зберігає дані користувача **І** валідує їх **І** зберігає в БД **І** відправляє email"

✅ **Добре:** "Клас User зберігає дані користувача" (одна конкретна функція)

#### **2. Правило "Причин для зміни"**

Поставте собі запитання: **"З яких причин може змінюватися цей клас?"**

Якщо причин більше однієї – клас порушує SRP:

❌ **Погано:**

- Зміна структури даних користувача
- Зміна правил валідації
- Зміна способу збереження в БД
- Зміна формату email-повідомлень

✅ **Добре:**

- Зміна структури даних користувача (тільки одна причина)

#### **3. Правило "Імпортів та залежностей"**

Подивіться на імпорти та залежності класу:

❌ **Погано:** Клас імпортує бібліотеки для БД, email-сервісів, валідації, логування одночасно

```typescript
import { Database } from "./database";
import { EmailService } from "./email";
import { ValidationLibrary } from "./validation";
import { Logger } from "./logger";
```

✅ **Добре:** Клас імпортує тільки те, що пов'язано з його основною функцією

#### **4. Правило "Тестування"**

Якщо для тестування одного методу вам потрібно мокати багато різних залежностей – це сигнал порушення SRP:

❌ **Погано:** Для тестування `saveUser()` потрібно мокати:

- База даних
- Email-сервіс
- Валідатор
- Логгер

✅ **Добре:** Для тестування методу потрібен тільки один mock

#### **5. Правило "Розміру класу"**

**Швидкі індикатори:**

- Клас більше 200-300 рядків коду
- Більше 10-15 публічних методів
- Багато приватних методів з різними цілями

#### **6. Правило "Назви методів"**

Якщо в одному класі є методи з радикально різними префіксами:

❌ **Погано:**

```typescript
class User {
  // Управління даними
  getName();
  setEmail();

  // Валідація
  validateEmail();
  validateAge();

  // Збереження
  saveToDatabase();
  deleteFromDatabase();

  // Відображення
  toJSON();
  toDisplayString();
}
```

✅ **Добре:** Методи об'єднані спільною тематикою

#### **🎯 Швидкий чек-лист:**

Поставте собі ці запитання про кожен клас:

1. ❓ **Чи можу я описати клас одним реченням без "і"?**
2. ❓ **Чи всі методи класу працюють з одними й тими ж даними?**
3. ❓ **Чи буду я змінювати цей клас з однієї причини?**
4. ❓ **Чи легко назвати клас одним іменником без довгих пояснень?**
5. ❓ **Чи можу я легко протестувати кожен метод незалежно?**

Якщо хоча б на одне питання відповідь "ні" – варто подумати про рефакторинг!

---

## ❌ **ПРИКЛАД ПОРУШЕННЯ ПРИНЦИПУ (1-й кейс)**

Розглянемо клас `User`, який порушує принцип єдиної відповідальності:

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
      // Логіка збереження в БД
      this.executeQuery(
        `INSERT INTO users (name, email, age) VALUES ('${this.name}', '${this.email}', ${this.age})`
      );
    } else {
      throw new Error("Invalid user data");
    }
  }

  private executeQuery(query: string): void {
    console.log(`Executing: ${query}`);
    // Підключення до БД та виконання запиту
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

### **Аналіз порушення**

Цей клас `User` порушує принцип SRP, тому що має **чотири різні відповідальності**:

1. **Управління даними користувача** (геттери)
2. **Валідація даних** (методи validate\*)
3. **Збереження в базу даних** (saveToDatabase, executeQuery)
4. **Форматування для відображення** (toDisplayString, toJSON)

Кожна з цих відповідальностей може змінюватися з різних причин:

- Зміна структури даних користувача
- Зміна правил валідації
- Зміна способу збереження даних (з SQL на NoSQL)
- Зміна формату відображення

---

## ✅ **РЕФАКТОРИНГ ТА ПОЯСНЕННЯ (1-й кейс)**

Давайте розділимо відповідальності на окремі класи:

### **1. Клас для даних користувача**

```typescript
class User {
  constructor(
    private name: string,
    private email: string,
    private age: number
  ) {}

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

### **2. Клас для валідації**

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

### **3. Клас для збереження в базу даних**

```typescript
class UserRepository {
  saveUser(user: User): void {
    if (!UserValidator.validateUser(user)) {
      throw new Error("Invalid user data");
    }

    console.log(`Saving user ${user.getName()} to database...`);
    const query = `INSERT INTO users (name, email, age) VALUES ('${user.getName()}', '${user.getEmail()}', ${user.getAge()})`;
    this.executeQuery(query);
  }

  private executeQuery(query: string): void {
    console.log(`Executing: ${query}`);
    // Підключення до БД та виконання запиту
  }
}
```

### **4. Клас для форматування**

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

### **Використання рефакторованого коду**

```typescript
// Створення користувача
const user = new User("Олександр", "alex@example.com", 25);

// Валідація
const isValid = UserValidator.validateUser(user);
console.log("User is valid:", isValid);

// Збереження
const repository = new UserRepository();
repository.saveUser(user);

// Форматування
const displayString = UserFormatter.toDisplayString(user);
const jsonString = UserFormatter.toJSON(user);

console.log(displayString);
console.log(jsonString);
```

### **Пояснення змін**

**Тепер кожен клас має одну чітку відповідальність:**

- **`User`** – тільки зберігає дані користувача
- **`UserValidator`** – тільки валідує дані
- **`UserRepository`** – тільки зберігає дані в БД
- **`UserFormatter`** – тільки форматує дані для відображення

**Переваги такого підходу:**

- Легше тестувати кожен компонент окремо
- Можна змінювати правила валідації, не торкаючись інших частин
- Можна легко змінити спосіб збереження даних
- Код стає більш читабельним та зрозумілим

---

## 🔁 **ДОДАТКОВИЙ ПРИКЛАД (2-й кейс)**

Розглянемо ще один приклад – клас `Order`, який також порушує SRP:

### **Приклад порушення**

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
    return this.calculateTotal() * 0.2; // 20% ПДВ
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

    this.sendEmail(this.customerEmail, "Підтвердження замовлення", emailBody);
  }

  private sendEmail(to: string, subject: string, body: string): void {
    console.log(`Sending email to ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);
    // Логіка відправки email
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
    // Логіка запису в файл логів
  }
}
```

### **Рефакторинг 2-го прикладу**

**1. Клас Order (тільки управління товарами)**

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

**2. Клас для обчислень**

```typescript
class OrderCalculator {
  static calculateTotal(order: Order): number {
    return order.getItems().reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  }

  static calculateTax(order: Order): number {
    return this.calculateTotal(order) * 0.2; // 20% ПДВ
  }

  static calculateTotalWithTax(order: Order): number {
    return this.calculateTotal(order) + this.calculateTax(order);
  }
}
```

**3. Клас для email-сповіщень**

```typescript
class OrderEmailService {
  static sendConfirmationEmail(order: Order): void {
    const total = OrderCalculator.calculateTotalWithTax(order);
    const emailBody = `
      Дякуємо за замовлення!
      Товарів: ${order.getItems().length}
      Загальна сума: ${total} грн
    `;

    this.sendEmail(
      order.getCustomerEmail(),
      "Підтвердження замовлення",
      emailBody
    );
  }

  private static sendEmail(to: string, subject: string, body: string): void {
    console.log(`Sending email to ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);
    // Логіка відправки email
  }
}
```

**4. Клас для логування**

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
    // Логіка запису в файл логів
  }
}
```

**Використання рефакторованого коду**

```typescript
// Створення замовлення
const order = new Order("customer@example.com");
order.addItem("Ноутбук", 25000, 1);
order.addItem("Миша", 500, 2);

// Обчислення
const total = OrderCalculator.calculateTotalWithTax(order);
console.log(`Total: ${total} грн`);

// Відправка email
OrderEmailService.sendConfirmationEmail(order);

// Логування
OrderLogger.logOrder(order);
```

---

## 🧠 **ПОРІВНЯЛЬНИЙ АНАЛІЗ**

### **Що спільного в обох прикладах**

1. **Перевантажені класи** – і `User`, і `Order` намагалися робити занадто багато речей одночасно
2. **Змішування різних рівнів абстракції** – бізнес-логіка змішувалася з технічними деталями (БД, email, логування)
3. **Важкість тестування** – щоб протестувати одну функцію, потрібно було б мокати багато залежностей
4. **Високе зчеплення** – зміна одної частини функціональності могла б вплинути на інші

### **Як SRP допомагає робити код чистішим**

1. **Простота розуміння** – кожен клас має зрозумілу, єдину мету
2. **Легкість тестування** – можна тестувати кожну відповідальність окремо
3. **Простота змін** – зміни в одній області не впливають на інші
4. **Повторне використання** – компоненти можна легко використати в інших частинах програми
5. **Менше помилок** – менша ймовірність випадково зламати щось при змінах

---

## 💬 **ПІДСУМОК**

### **Ключові ідеї Single Responsibility Principle:**

1. **Кожен клас повинен мати лише одну причину для зміни**
2. **Одна відповідальність = одна конкретна задача**
3. **Розділяйте різні аспекти функціональності на окремі класи**
4. **Уникайте "God Objects" – класів, які роблять занадто багато**

### **Аналогія з реального життя**

Уявіть собі ресторан. Якби один офіціант одночасно:

- Приймав замовлення
- Готував їжу
- Мив посуд
- Вів бухгалтерію
- Прибирав зал

То це було б дуже неефективно! Натомість, кожен працівник має свою конкретну роль. Так само і в коді – кожен клас повинен мати свою чітку "професію".

### **Заклик до дії**

Перегляньте свій поточний код і знайдіть класи, які можуть порушувати SRP. Запитайте себе:

- "Скільки різних причин для зміни має цей клас?"
- "Чи можна розділити цей клас на кілька менших з більш чіткими відповідальностями?"

Спробуйте рефакторити один такий клас, застосовуючи принцип єдиної відповідальності!

---

## 📁 **ДОПОМІЖНІ МАТЕРІАЛИ**

### **Код з уроку**

Всі приклади коду з цього уроку доступні у репозиторії курсу. Ви можете завантажити їх та експериментувати самостійно.

### **Наступний урок**

У наступному уроці ми розглянемо **Open/Closed Principle** – принцип, який навчить вас робити код відкритим для розширення, але закритим для модифікацій.
