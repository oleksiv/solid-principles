# 🎥 **Урок 6: Dependency Inversion Principle (Принцип інверсії залежностей)**

---

## 🎬 **ВСТУП**

Привіт! Сьогодні ми розберемо останній, п'ятий принцип SOLID — **Dependency Inversion Principle** або **принцип інверсії залежностей**.

Це один з найважливіших принципів, який допоможе тобі писати гнучкий код, де компоненти не "прив'язані" один до одного жорстко. Навіть у невеликих проектах це дозволить легко змінювати логіку без переписування всього коду.

---

## 📖 **ПРОСТА ТЕОРІЯ**

**Своїми словами:** Не змушуй високорівневі класи залежати від конкретних реалізацій. Замість цього використовуй інтерфейси — як "договори" про те, що має робити код, а не як саме.

**Офіційно звучить так:**

1. "Модулі високого рівня не повинні залежати від модулів низького рівня. Обидва повинні залежати від абстракцій."
2. "Абстракції не повинні залежати від деталей. Деталі повинні залежати від абстракцій."

**Аналогія з життя:** Коли ти вмикаєш світло, ти не думаєш про те, чи це лампочка розжарювання, LED, або галогенна. Ти просто натискаєш вимикач. Вимикач (високий рівень) не залежить від конкретного типу лампочки (низький рівень) — він працює з будь-якою, що підключена до стандартного патрону (абстракція).

**Часті помилки:**

- Використання `new` всередині класів для створення залежностей
- Жорстке прив'язування до конкретних реалізацій (MySQL, конкретний API)
- Змішування бізнес-логіки з технічними деталями

---

## ❌ **ПРИКЛАД ПОМИЛКИ (1-й кейс)**

Уявіть систему інтернет-магазину з обробкою платежів:

```typescript
// ❌ Поганий підхід - жорстка залежність
class PayPalPayment {
  processPayment(amount: number): boolean {
    console.log(`Обробляю ${amount} грн через PayPal`);
    // Логіка PayPal API
    return true;
  }
}

class OrderService {
  private paymentProcessor: PayPalPayment;

  constructor() {
    // 😱 Жорстко прив'язуємося до PayPal
    this.paymentProcessor = new PayPalPayment();
  }

  processOrder(amount: number): void {
    console.log("Обробляю замовлення...");

    // Завжди використовуємо тільки PayPal
    const success = this.paymentProcessor.processPayment(amount);

    if (success) {
      console.log("Замовлення успішно оплачено!");
    }
  }
}

// Використання
const orderService = new OrderService();
orderService.processOrder(100);
```

**Що тут не так?**

- `OrderService` жорстко прив'язаний до `PayPalPayment`
- Щоб додати Stripe або банківську карту, треба переписувати `OrderService`
- Складно тестувати — не можемо підставити мок-об'єкт
- Порушується принцип відкритості/закритості (OCP)

**Чому це порушує принцип:**
Високорівневий клас (`OrderService`) залежить від конкретної реалізації (`PayPalPayment`), а не від абстракції.

---

## ✅ **ПРАВИЛЬНИЙ ВАРІАНТ ТА РОЗБІР (1-й кейс)**

Давайте застосуємо інверсію залежностей:

```typescript
// ✅ Крок 1: Створюємо абстракцію (інтерфейс)
interface PaymentProcessor {
  processPayment(amount: number): boolean;
}

// ✅ Крок 2: Конкретні реалізації залежать від абстракції
class PayPalPayment implements PaymentProcessor {
  processPayment(amount: number): boolean {
    console.log(`Обробляю ${amount} грн через PayPal`);
    return true;
  }
}

class StripePayment implements PaymentProcessor {
  processPayment(amount: number): boolean {
    console.log(`Обробляю ${amount} грн через Stripe`);
    return true;
  }
}

class BankCardPayment implements PaymentProcessor {
  processPayment(amount: number): boolean {
    console.log(`Обробляю ${amount} грн через банківську карту`);
    return true;
  }
}

// ✅ Крок 3: Високорівневий клас залежить від абстракції
class OrderService {
  private paymentProcessor: PaymentProcessor;

  // Залежність передається ззовні (Dependency Injection)
  constructor(paymentProcessor: PaymentProcessor) {
    this.paymentProcessor = paymentProcessor;
  }

  processOrder(amount: number): void {
    console.log("Обробляю замовлення...");

    // Працюємо з абстракцією, не знаючи конкретної реалізації
    const success = this.paymentProcessor.processPayment(amount);

    if (success) {
      console.log("Замовлення успішно оплачено!");
    }
  }
}

// ✅ Використання - гнучко вибираємо спосіб оплати
const paypalProcessor = new PayPalPayment();
const stripeProcessor = new StripePayment();
const bankCardProcessor = new BankCardPayment();

const orderWithPaypal = new OrderService(paypalProcessor);
const orderWithStripe = new OrderService(stripeProcessor);
const orderWithCard = new OrderService(bankCardProcessor);

orderWithPaypal.processOrder(100);
orderWithStripe.processOrder(200);
orderWithCard.processOrder(150);
```

**Пояснення кожного кроку:**

**Крок 1:** Створили інтерфейс `PaymentProcessor` — це наша абстракція, "договір" про те, що повинен уміти будь-який платіжний процесор.

**Крок 2:** Кожна конкретна реалізація (PayPal, Stripe, банківська карта) залежить від абстракції — вона обов'язково реалізує метод `processPayment`.

**Крок 3:** `OrderService` тепер залежить тільки від абстракції, а конкретну реалізацію отримує ззовні через конструктор (це називається Dependency Injection).

**Чому тепер дотримано принципу:**

- Високорівневий `OrderService` не знає про конкретні деталі платіжних систем
- Можна легко додати нові способи оплати без зміни `OrderService`
- Легко тестувати з мок-об'єктами

---

## 🔁 **ІНШИЙ ПРИКЛАД (2-й кейс)**

Розглянемо систему логування:

```typescript
// ❌ Поганий підхід - жорстка залежність від консолі
class UserService {
  createUser(name: string, email: string): void {
    // Бізнес-логіка створення користувача
    console.log(`Створюю користувача ${name}`);

    // 😱 Жорстко прив'язані до console.log
    console.log(`Користувач ${name} створений успішно`);
  }

  deleteUser(id: string): void {
    // Бізнес-логіка видалення
    console.log(`Видаляю користувача з ID: ${id}`);

    console.log(`Користувач ${id} видалений`);
  }
}
```

**Виправлення з інверсією залежностей:**

```typescript
// ✅ Абстракція для логування
interface Logger {
  log(message: string): void;
}

// ✅ Різні реалізації логування
class ConsoleLogger implements Logger {
  log(message: string): void {
    console.log(`[CONSOLE]: ${message}`);
  }
}

class FileLogger implements Logger {
  log(message: string): void {
    console.log(`[FILE]: Записую в файл - ${message}`);
    // Тут була б логіка запису у файл
  }
}

class RemoteLogger implements Logger {
  log(message: string): void {
    console.log(`[REMOTE]: Відправляю на сервер - ${message}`);
    // Тут була б логіка відправки на віддалений сервер
  }
}

// ✅ Високорівневий сервіс залежить від абстракції
class UserService {
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  createUser(name: string, email: string): void {
    // Бізнес-логіка
    this.logger.log(`Створюю користувача ${name}`);

    // Симуляція створення
    this.logger.log(`Користувач ${name} створений успішно`);
  }

  deleteUser(id: string): void {
    this.logger.log(`Видаляю користувача з ID: ${id}`);

    // Симуляція видалення
    this.logger.log(`Користувач ${id} видалений`);
  }
}

// ✅ Гнучке використання
const consoleLogger = new ConsoleLogger();
const fileLogger = new FileLogger();
const remoteLogger = new RemoteLogger();

const userServiceDev = new UserService(consoleLogger); // Для розробки
const userServiceProd = new UserService(remoteLogger); // Для продакшену
const userServiceTest = new UserService(fileLogger); // Для тестів

userServiceDev.createUser("Іван", "ivan@example.com");
userServiceProd.createUser("Марія", "maria@example.com");
```

---

## 🧠 **СПІЛЬНЕ У ДВОХ ПРИКЛАДАХ**

**Що об'єднує обидва кейси:**

1. В обох випадках високорівневі класи спочатку жорстко залежали від конкретних реалізацій
2. Ми створили абстракції (інтерфейси) для відокремлення деталей від бізнес-логіки
3. Використали Dependency Injection для передачі залежностей ззовні

**Як принцип допомагає вже сьогодні:**

- **Легке тестування:** можна підставити мок-об'єкти замість реальних залежностей
- **Гнучкість:** можна змінювати реалізації без зміни основного коду
- **Масштабованість:** легко додавати нові функції (нові платіжні системи, способи логування)
- **Розділення відповідальностей:** бізнес-логіка відокремлена від технічних деталей

---

## 💬 **ПІДСУМОК**

**Ключова ідея простими словами:** Залежи від "що треба зробити" (інтерфейс), а не від "як саме це робиться" (конкретна реалізація). Передавай залежності ззовні, а не створюй їх всередині класу.

**Аналогія:** Це як розетка в стіні. Тобі не важливо, чи то атомна електростанція чи сонячні батареї дають електрику — головне, що в розетці є стандартні 220V. Твій пристрій (високий рівень) залежить від стандарту розетки (абстракція), а не від конкретного джерела енергії (деталі).

**Практичні поради:**

1. Якщо бачиш `new` всередині класу — подумай, чи можна передати цю залежність ззовні
2. Створюй інтерфейси для зовнішніх сервісів (API, база даних, файлова система)
3. Використовуй Dependency Injection контейнери у великих проектах

Вітаю! Ти вивчив усі п'ять принципів SOLID! 🎉

---

## 📁 **ДОДАТКОВО**

**Завдання для практики:**
Створи систему для роботи з базами даних. Зроби інтерфейс `Database` з методами `save()`, `find()`, `delete()`. Потім створи реалізації для `InMemoryDatabase`, `MySQLDatabase`, `MongoDatabase`. Використай принцип DIP для створення `UserRepository`.

**Приклади коду з цього уроку** можна знайти в репозиторії курсу у папці `lesson-6-examples/`.

---

## 🎓 **ВІТАННЯ З ЗАВЕРШЕННЯМ КУРСУ!**

Ти вивчив усі п'ять принципів SOLID:

- ✅ **S** - Single Responsibility Principle
- ✅ **O** - Open/Closed Principle
- ✅ **L** - Liskov Substitution Principle
- ✅ **I** - Interface Segregation Principle
- ✅ **D** - Dependency Inversion Principle

Тепер ти знаєш, як писати чистий, масштабований і підтримуваний код!

_Наступний крок: застосовуй ці принципи у своїх проектах і вивчай Design Patterns! 🚀_
