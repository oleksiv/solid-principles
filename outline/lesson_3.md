# 📘 **Урок 3: O – Open/Closed Principle (Принцип відкритості/закритості)**

---

## 🎬 **ВСТУП**

Привіт! Сьогодні ми вивчаємо другу букву з SOLID — це **принцип відкритості/закритості**. Назва здається складною, але ідея дуже проста і корисна.

Цей принцип допоможе вам писати код, який легко розширювати новими функціями, не боячись зламати те, що вже працює. Ви зможете додавати нові можливості до програми без зміни старого коду.

Після цього уроку ви будете знати, як створювати гнучкий код, який легко адаптується до нових вимог.

---

## 📖 **ТЕОРЕТИЧНЕ ПІДГРУНТЯ**

### **Що таке принцип відкритості/закритості?**

**Простими словами**: ваш код повинен бути **відкритим для додавання нових функцій**, але **закритим для зміни старого коду**.

### **Що це означає на практиці?**

**"Відкритий для розширення"** означає:
- Можна легко додавати нові можливості
- Можна створювати нові типи об'єктів
- Програма може робити нові речі

**"Закритий для модифікації"** означає:
- Старий код залишається без змін
- Те, що вже працює, продовжує працювати
- Ризик зламати щось мінімальний

### **Чому це важливо?**

Уявіть, що ви будуєте будинок. Добре спроектований будинок дозволяє:
- **Додавати нові кімнати** (розширення)
- **Не руйнувати стіни, що вже стоять** (не модифікувати)

Так само і в коді — добрий дизайн дозволяє додавати нові функції без ризику зламати існуючі.

### **Основні способи дотримання принципу**

1. **Використовуйте інтерфейси** — вони визначають "договір" між класами
2. **Створюйте окремі класи для різної поведінки** — кожен клас робить одну річ
3. **Уникайте великих switch/if-else** — замість них використовуйте поліморфізм

### **Що відбувається, коли порушуємо цей принцип?**

- **Високий ризик помилок** — зміна старого коду може щось зламати
- **Складно тестувати** — доводиться перевіряти весь код заново
- **Страх додавати нові функції** — боїшся щось зіпсувати
- **Код стає заплутаним** — все перемішується в одному місці

---

## ❌ **ПРИКЛАД ПОРУШЕННЯ ПРИНЦИПУ (1-й кейс)**

### **Сценарій: Калькулятор площі фігур**

Давайте подивимося на приклад коду, який здається нормальним, але насправді порушує принцип:

```typescript
// Типи фігур
enum ShapeType {
  CIRCLE = "circle",       // коло
  RECTANGLE = "rectangle", // прямокутник
  TRIANGLE = "triangle",   // трикутник
}

// Опис кола
interface Circle {
  type: ShapeType.CIRCLE;
  radius: number; // радіус
}

// Опис прямокутника
interface Rectangle {
  type: ShapeType.RECTANGLE;
  width: number;  // ширина
  height: number; // висота
}

// Опис трикутника
interface Triangle {
  type: ShapeType.TRIANGLE;
  base: number;   // основа
  height: number; // висота
}

// Всі можливі фігури
type Shape = Circle | Rectangle | Triangle;

// Клас для обчислення площі
class AreaCalculator {
  // Обчислити площу однієї фігури
  calculateArea(shape: Shape): number {
    switch (shape.type) {
      case ShapeType.CIRCLE:
        return Math.PI * Math.pow(shape.radius, 2);

      case ShapeType.RECTANGLE:
        return shape.width * shape.height;

      case ShapeType.TRIANGLE:
        return (shape.base * shape.height) / 2;

      default:
        throw new Error("Невідомий тип фігури");
    }
  }

  // Обчислити загальну площу всіх фігур
  calculateTotalArea(shapes: Shape[]): number {
    return shapes.reduce((total, shape) => {
      return total + this.calculateArea(shape);
    }, 0);
  }

  // Отримати інформацію про фігуру
  getShapeInfo(shape: Shape): string {
    switch (shape.type) {
      case ShapeType.CIRCLE:
        return `Коло з радіусом ${shape.radius}`;

      case ShapeType.RECTANGLE:
        return `Прямокутник ${shape.width}x${shape.height}`;

      case ShapeType.TRIANGLE:
        return `Трикутник з основою ${shape.base} та висотою ${shape.height}`;

      default:
        throw new Error("Невідомий тип фігури");
    }
  }
}
```

### **Що не так з цим кодом?**

**Проблема**: щоб додати нову фігуру (наприклад, квадрат), потрібно змінювати багато місць:

1. **Додати новий тип** в `ShapeType` enum
2. **Створити новий інтерфейс** для квадрата
3. **Змінити тип** `Shape`, щоб включити квадрат
4. **Додати новий `case`** в метод `calculateArea()`
5. **Додати новий `case`** в метод `getShapeInfo()`

**Чому це погано?**
- Доводиться **змінювати старий код** (порушує "закритий для модифікації")
- **Високий ризик помилок** — можна забути додати case в якомусь методі
- **Код стає складнішим** — switch statements ростуть
- **Важко тестувати** — треба перевіряти всі старі функції заново

**Що станеться через рік?** Якщо додасте ще 10 фігур, у вас будуть величезні switch statements, які страшно змінювати.

---

## ✅ **РЕФАКТОРИНГ ТА ПОЯСНЕННЯ (1-й кейс)**

### **Правильний підхід: кожна фігура знає про себе**

Давайте перепишемо код так, щоб кожна фігура сама знала, як обчислити свою площу:

**1. Створюємо загальний "договір" для всіх фігур**

```typescript
// Це як "договір" — кожна фігура обіцяє вміти це робити
abstract class Shape {
  abstract calculateArea(): number;  // кожна фігура вміє рахувати площу
  abstract getInfo(): string;        // кожна фігура вміє розповідати про себе
}
```

**2. Кожна фігура реалізує цей "договір" по-своєму**

```typescript
// Коло знає, як рахувати свою площу
class Circle extends Shape {
  constructor(private radius: number) {
    super();
  }

  // Коло рахує площу по формулі πr²
  calculateArea(): number {
    return Math.PI * Math.pow(this.radius, 2);
  }

  // Коло розповідає про себе
  getInfo(): string {
    return `Коло з радіусом ${this.radius}`;
  }

  // Додатковий метод тільки для кола
  getRadius(): number {
    return this.radius;
  }
}

// Прямокутник знає, як рахувати свою площу
class Rectangle extends Shape {
  constructor(private width: number, private height: number) {
    super();
  }

  // Прямокутник рахує площу як ширина × висота
  calculateArea(): number {
    return this.width * this.height;
  }

  // Прямокутник розповідає про себе
  getInfo(): string {
    return `Прямокутник ${this.width}x${this.height}`;
  }

  // Додаткові методи тільки для прямокутника
  getWidth(): number {
    return this.width;
  }

  getHeight(): number {
    return this.height;
  }
}

// Трикутник знає, як рахувати свою площу
class Triangle extends Shape {
  constructor(private base: number, private height: number) {
    super();
  }

  // Трикутник рахує площу як (основа × висота) / 2
  calculateArea(): number {
    return (this.base * this.height) / 2;
  }

  // Трикутник розповідає про себе
  getInfo(): string {
    return `Трикутник з основою ${this.base} та висотою ${this.height}`;
  }

  // Додаткові методи тільки для трикутника
  getBase(): number {
    return this.base;
  }

  getHeight(): number {
    return this.height;
  }
}
```

**3. Калькулятор стає простішим**

```typescript
// Тепер калькулятор не знає про конкретні фігури
class AreaCalculator {
  // Просто просить фігуру порахувати свою площу
  calculateArea(shape: Shape): number {
    return shape.calculateArea(); // фігура сама знає, як це робити
  }

  // Рахує загальну площу всіх фігур
  calculateTotalArea(shapes: Shape[]): number {
    return shapes.reduce((total, shape) => {
      return total + shape.calculateArea(); // кожна фігура рахує сама
    }, 0);
  }

  // Просить фігуру розповісти про себе
  getShapeInfo(shape: Shape): string {
    return shape.getInfo(); // фігура сама знає, що про себе сказати
  }

  // Додаткова функція — статистика
  getAreaStatistics(shapes: Shape[]): string {
    const totalArea = this.calculateTotalArea(shapes);
    const shapeCount = shapes.length;
    const averageArea = totalArea / shapeCount;

    return `Загальна площа: ${totalArea.toFixed(2)}, Кількість фігур: ${shapeCount}, Середня площа: ${averageArea.toFixed(2)}`;
  }
}
```

**4. Додаємо нові фігури БЕЗ зміни старого коду**

```typescript
// Квадрат — просто ще одна фігура
class Square extends Shape {
  constructor(private side: number) {
    super();
  }

  calculateArea(): number {
    return this.side * this.side;
  }

  getInfo(): string {
    return `Квадрат зі стороною ${this.side}`;
  }

  getSide(): number {
    return this.side;
  }
}

// Еліпс — ще одна нова фігура
class Ellipse extends Shape {
  constructor(private majorAxis: number, private minorAxis: number) {
    super();
  }

  calculateArea(): number {
    return Math.PI * this.majorAxis * this.minorAxis;
  }

  getInfo(): string {
    return `Еліпс з півосями ${this.majorAxis} та ${this.minorAxis}`;
  }
}
```

**5. Тестуємо новий код**

```typescript
// Створюємо різні фігури
const shapes: Shape[] = [
  new Circle(5),
  new Rectangle(4, 6),
  new Triangle(3, 8),
  new Square(4),     // Нова фігура! Старий код НЕ ЗМІНЮВАВСЯ
  new Ellipse(3, 2), // Ще одна нова фігура! Старий код НЕ ЗМІНЮВАВСЯ
];

const calculator = new AreaCalculator();

// Показуємо інформацію про кожну фігуру
shapes.forEach((shape) => {
  console.log(`${shape.getInfo()}: площа = ${shape.calculateArea().toFixed(2)}`);
});

// Показуємо загальну статистику
console.log(calculator.getAreaStatistics(shapes));
```

### **Чому новий код кращий?**

1. **"Закритий для модифікації"**: класи `AreaCalculator`, `Circle`, `Rectangle`, `Triangle` НЕ ЗМІНЮВАЛИСЯ
2. **"Відкритий для розширення"**: легко додали `Square` та `Ellipse`
3. **Кожна фігура відповідає за себе**: коло знає про коло, квадрат — про квадрат
4. **Простіше тестувати**: можна тестувати кожну фігуру окремо
5. **Менше ризиків**: нові фігури не можуть зламати старі

**Головна ідея**: замість одного великого switch, кожен клас сам знає, що робити!

---

## 🔁 **ДОДАТКОВИЙ ПРИКЛАД (2-й кейс)**

### **Сценарій: Система знижок в інтернет-магазині**

Ось ще один приклад, де спочатку все здається нормально, але потім стає складно:

**Поганий приклад (порушує принцип):**

```typescript
// Типи клієнтів
enum CustomerType {
  REGULAR = "regular", // звичайний
  PREMIUM = "premium", // преміум
  VIP = "vip",         // VIP
  STUDENT = "student", // студент
}

// Клієнт магазину
interface Customer {
  id: string;
  name: string;
  type: CustomerType;
  memberSince: Date; // коли став клієнтом
}

// Калькулятор знижок
class DiscountCalculator {
  // Рахує знижку залежно від типу клієнта
  calculateDiscount(customer: Customer, orderAmount: number): number {
    switch (customer.type) {
      case CustomerType.REGULAR:
        return 0; // без знижки

      case CustomerType.PREMIUM:
        return orderAmount * 0.1; // 10% знижка

      case CustomerType.VIP:
        // VIP клієнти: якщо більше 2 років — 20%, інакше 15%
        const membershipYears = this.getYearsSinceMembership(customer.memberSince);
        if (membershipYears >= 2) {
          return orderAmount * 0.2; // 20% знижка
        }
        return orderAmount * 0.15; // 15% знижка

      case CustomerType.STUDENT:
        // Студенти: 15% знижка, але не більше 500 грн
        return Math.min(orderAmount * 0.15, 500);

      default:
        throw new Error("Невідомий тип клієнта");
    }
  }

  // Повертає опис знижки
  getDiscountDescription(customer: Customer): string {
    switch (customer.type) {
      case CustomerType.REGULAR:
        return "Без знижки";

      case CustomerType.PREMIUM:
        return "Знижка 10% на всі товари";

      case CustomerType.VIP:
        const membershipYears = this.getYearsSinceMembership(customer.memberSince);
        if (membershipYears >= 2) {
          return "VIP знижка 20% на всі товари";
        }
        return "VIP знижка 15% на всі товари";

      case CustomerType.STUDENT:
        return "Студентська знижка 15% (максимум 500 грн)";

      default:
        throw new Error("Невідомий тип клієнта");
    }
  }

  // Допоміжний метод
  private getYearsSinceMembership(memberSince: Date): number {
    const now = new Date();
    return now.getFullYear() - memberSince.getFullYear();
  }
}
```

### **Проблеми з цим кодом:**

1. **Щоб додати новий тип клієнта** (наприклад, "пенсіонер"), треба:
   - Додати в enum `CustomerType`
   - Додати case в `calculateDiscount()`
   - Додати case в `getDiscountDescription()`
   - Змінити старий код в кількох місцях

2. **Щоб змінити правила знижки**, треба змінювати методи

3. **Switch statements повторюються** в різних методах

4. **Один клас робить забагато**: рахує знижки ТА описує їх

### **Правильний підхід: кожен тип знижки — окремий клас**

**1. Створюємо "договір" для всіх типів знижок**

```typescript
// Кожен тип знижки обіцяє вміти це робити
abstract class DiscountStrategy {
  abstract calculateDiscount(orderAmount: number, memberSince: Date): number;
  abstract getDescription(): string;
}
```

**2. Кожен тип знижки реалізує "договір" по-своєму**

```typescript
// Без знижки
class NoDiscountStrategy extends DiscountStrategy {
  calculateDiscount(orderAmount: number, memberSince: Date): number {
    return 0; // просто 0
  }

  getDescription(): string {
    return "Без знижки";
  }
}

// Преміум знижка
class PremiumDiscountStrategy extends DiscountStrategy {
  calculateDiscount(orderAmount: number, memberSince: Date): number {
    return orderAmount * 0.1; // 10%
  }

  getDescription(): string {
    return "Знижка 10% на всі товари";
  }
}

// VIP знижка (залежить від стажу)
class VipDiscountStrategy extends DiscountStrategy {
  calculateDiscount(orderAmount: number, memberSince: Date): number {
    const membershipYears = this.getYearsSinceMembership(memberSince);
    if (membershipYears >= 2) {
      return orderAmount * 0.2; // 20% для досвідчених VIP
    }
    return orderAmount * 0.15; // 15% для нових VIP
  }

  getDescription(): string {
    return "VIP знижка до 20% на всі товари";
  }

  private getYearsSinceMembership(memberSince: Date): number {
    const now = new Date();
    return now.getFullYear() - memberSince.getFullYear();
  }
}

// Студентська знижка (з лімітом)
class StudentDiscountStrategy extends DiscountStrategy {
  calculateDiscount(orderAmount: number, memberSince: Date): number {
    return Math.min(orderAmount * 0.15, 500); // 15%, але не більше 500 грн
  }

  getDescription(): string {
    return "Студентська знижка 15% (максимум 500 грн)";
  }
}

// НОВІ ТИПИ ЗНИЖОК можна легко додавати!

// Знижка для пенсіонерів
class SeniorDiscountStrategy extends DiscountStrategy {
  calculateDiscount(orderAmount: number, memberSince: Date): number {
    return orderAmount * 0.12; // 12% знижка
  }

  getDescription(): string {
    return "Знижка для пенсіонерів 12%";
  }
}

// Сезонна знижка (можна налаштовувати)
class SeasonalDiscountStrategy extends DiscountStrategy {
  constructor(
    private seasonalRate: number,    // відсоток знижки
    private seasonName: string       // назва сезону
  ) {
    super();
  }

  calculateDiscount(orderAmount: number, memberSince: Date): number {
    return orderAmount * this.seasonalRate;
  }

  getDescription(): string {
    return `${this.seasonName} знижка ${this.seasonalRate * 100}%`;
  }
}
```

**3. Клієнт тепер має стратегію знижки**

```typescript
class Customer {
  constructor(
    private id: string,
    private name: string,
    private discountStrategy: DiscountStrategy, // клієнт "має" знижку
    private memberSince: Date
  ) {}

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getDiscountStrategy(): DiscountStrategy {
    return this.discountStrategy;
  }

  getMemberSince(): Date {
    return this.memberSince;
  }

  // Можна змінювати тип знижки (наприклад, клієнт став VIP)
  setDiscountStrategy(strategy: DiscountStrategy): void {
    this.discountStrategy = strategy;
  }
}
```

**4. Калькулятор стає простішим**

```typescript
class DiscountCalculator {
  // Просто питає у клієнта, яка в нього знижка
  calculateDiscount(customer: Customer, orderAmount: number): number {
    return customer
      .getDiscountStrategy()
      .calculateDiscount(orderAmount, customer.getMemberSince());
  }

  getDiscountDescription(customer: Customer): string {
    return customer.getDiscountStrategy().getDescription();
  }

  // Додаткові методи (без зміни основної логіки)
  calculateFinalPrice(customer: Customer, orderAmount: number): number {
    const discount = this.calculateDiscount(customer, orderAmount);
    return orderAmount - discount;
  }

  generateDiscountReport(customer: Customer, orderAmount: number): string {
    const discount = this.calculateDiscount(customer, orderAmount);
    const finalPrice = this.calculateFinalPrice(customer, orderAmount);
    const description = this.getDiscountDescription(customer);

    return `
      Клієнт: ${customer.getName()}
      Сума замовлення: ${orderAmount} грн
      Тип знижки: ${description}
      Розмір знижки: ${discount.toFixed(2)} грн
      До сплати: ${finalPrice.toFixed(2)} грн
    `;
  }
}
```

**5. Тестуємо новий код**

```typescript
// Створюємо клієнтів з різними знижками
const customers = [
  new Customer("1", "Іван Звичайний", new NoDiscountStrategy(), new Date("2023-01-01")),
  new Customer("2", "Марія Преміум", new PremiumDiscountStrategy(), new Date("2022-06-15")),
  new Customer("3", "Олександр VIP", new VipDiscountStrategy(), new Date("2020-03-20")),
  new Customer("4", "Анна Студентка", new StudentDiscountStrategy(), new Date("2023-09-01")),
  new Customer("5", "Петро Пенсіонер", new SeniorDiscountStrategy(), new Date("2021-12-10")), // НОВА знижка!
];

// Новорічна акція — 25% знижка (тимчасова)
const newYearDiscount = new SeasonalDiscountStrategy(0.25, "Новорічна");
customers.push(
  new Customer("6", "Оксана Новорічна", newYearDiscount, new Date("2023-01-15"))
);

const calculator = new DiscountCalculator();
const orderAmount = 1000;

// Показуємо звіти для всіх клієнтів
customers.forEach((customer) => {
  const report = calculator.generateDiscountReport(customer, orderAmount);
  console.log(report);
});

// Клієнт може змінювати тип знижки
const regularCustomer = customers[0];
console.log("До зміни статусу:", calculator.getDiscountDescription(regularCustomer));

regularCustomer.setDiscountStrategy(new VipDiscountStrategy()); // став VIP!
console.log("Після отримання VIP:", calculator.getDiscountDescription(regularCustomer));
```

### **Чому новий код кращий?**

1. **Легко додавати нові типи знижок** — просто створити новий клас
2. **Старий код не змінюється** — принцип дотримано!
3. **Кожен клас робить одну річ** — розраховує один тип знижки
4. **Можна змінювати знижки динамічно** — клієнт може стати VIP
5. **Простіше тестувати** — кожен тип знижки тестується окремо

---

## 🧠 **ПОРІВНЯЛЬНА АНАЛІЗА**

### **Що спільного в обох прикладах?**

1. **Великі switch/if-else блоки** — вся логіка була в одному місці
2. **Потрібно змінювати старий код** — щоб додати щось нове
3. **Дублювання логіки** — схожі умови повторювалися
4. **Один клас робив забагато** — порушував принцип єдиної відповідальності

### **Як принцип відкритості/закритості робить код кращим?**

1. **Безпечно додавати нове** — не боїшся зламати старе
2. **Кожен клас має одну мету** — простіше розуміти і тестувати
3. **Код стає гнучким** — можна легко змінювати поведінку
4. **Менше помилок** — нові функції не впливають на старі
5. **Легше працювати в команді** — різні люди можуть додавати різні функції

### **Прості правила для дотримання принципу**

1. **Якщо бачите великий switch — подумайте про класи**
2. **Кожен клас повинен робити одну річ добре**
3. **Використовуйте інтерфейси для "договорів"**
4. **Питайте себе: "Чи доведеться змінювати старий код для нової функції?"**

---

## 💬 **ПІДСУМОК**

### **Головні ідеї принципу відкритості/закритості**

1. **Код повинен бути відкритим для розширення** — легко додавати нове
2. **Код повинен бути закритим для модифікації** — не змінювати старе
3. **Використовуйте класи замість великих switch** — кожен клас робить одну річ
4. **Думайте про майбутнє** — як легко буде додавати нові функції?

### **Проста аналогія**

Уявіть конструктор Lego. Добрий набір Lego дозволяє:
- **Додавати нові деталі** (розширення) — ви можете купити більше кубиків
- **Не ламати старі конструкції** (не модифікувати) — те, що ви вже побудували, залишається цілим

Коли ви хочете побудувати щось нове, ви не руйнуєте старі моделі — ви просто використовуєте додаткові кубики.

Так само і в коді — добрий дизайн дозволяє "прикріплювати" нові функції без "розбирання" старих.

### **Що робити далі?**

Подивіться на свій код і знайдіть великі switch або if-else блоки. Запитайте себе:
- Чи доводиться мені змінювати цей код кожного разу для нової функції?
- Чи можу я винести кожен варіант в окремий клас?
- Чи стане код простішим, якщо кожен клас робитиме одну річ?

Спробуйте переписати один такий блок, використовуючи класи замість switch!

---

## 📁 **ДОПОМІЖНІ МАТЕРІАЛИ**

### **Код з урока**

Всі приклади з цього урока ви можете знайти в папці `lesson-3-ocp/` в репозиторії курсу. Завантажте їх і поекспериментуйте!

### **Що почитати далі**

- **"Clean Code" (Роберт Мартін)** — про чисте програмування простими словами
- **"Design Patterns" (Банда чотирьох)** — про патерни проектування
- **TypeScript документація** — більше про класи та інтерфейси

### **Наступний урок**

У наступному уроці вивчимо **Liskov Substitution Principle (LSP)** — принцип, який навчить правильно використовувати наслідування.

---

**🎯 Увидимося на наступному уроці! Успіхів у програмуванні!**
