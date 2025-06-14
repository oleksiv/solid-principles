# Сценарій відеоуроку: Open/Closed Principle

Привіт! Сьогодні ми розберемо другий принцип із SOLID — принцип відкритості та закритості. Звучить складно? Насправді все дуже просто. Після цього уроку ти зможеш писати код, який легко розширювати новими функціями, і при цьому не боятися зламати те, що вже працює.

Давай одразу до суті. Принцип відкритості та закритості говорить: твій код має бути відкритим для розширення, але закритим для модифікації. Що це означає? Уяви, що ти будуєш будинок. Хороший проект дозволяє додавати нові кімнати, не руйнуючи стіни, які вже стоять. Так само і в коді — ти можеш додавати нові функції, не змінюючи старий код.

Чому це важливо? Коли ти змінюєш код, який вже працює, завжди є ризик щось зламати. А якщо код написаний правильно, ти просто додаєш нове — і все працює. Менше стресу, менше багів, більше задоволення від роботи.

Давай подивимося на реальний приклад. Уяви, що ти пишеш калькулятор площі для різних геометричних фігур. Ось як це зазвичай роблять початківці:

```typescript
enum ShapeType {
  CIRCLE = "circle",
  RECTANGLE = "rectangle",
  TRIANGLE = "triangle",
}

interface Circle {
  type: ShapeType.CIRCLE;
  radius: number;
}

interface Rectangle {
  type: ShapeType.RECTANGLE;
  width: number;
  height: number;
}

interface Triangle {
  type: ShapeType.TRIANGLE;
  base: number;
  height: number;
}

type Shape = Circle | Rectangle | Triangle;

class AreaCalculator {
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

  calculateTotalArea(shapes: Shape[]): number {
    return shapes.reduce((total, shape) => {
      return total + this.calculateArea(shape);
    }, 0);
  }

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

Виглядає нормально, правда? Але давай подумаємо, що станеться, коли тобі знадобиться додати нову фігуру — наприклад, квадрат. Тобі доведеться додати новий тип в enum, створити новий інтерфейс, оновити тип Shape, додати новий case в метод calculateArea, і ще один case в метод getShapeInfo. П'ять місць треба змінити! І це тільки для однієї нової фігури.

А тепер уяви, що через рік у тебе буде двадцять різних фігур. Твої switch-блоки стануть величезними, і кожного разу, коли треба буде щось додати, ти будеш боятися щось зламати. Це класичне порушення принципу відкритості та закритості — ти постійно модифікуєш старий код.

Давай перепишемо це правильно. Основна ідея — кожна фігура сама знає, як рахувати свою площу. Спочатку створимо базовий клас для всіх фігур:

```typescript
abstract class Shape {
  abstract calculateArea(): number;
  abstract getInfo(): string;
}
```

Це як договір — кожна фігура обіцяє, що вміє рахувати свою площу та розповідати про себе. Тепер кожна конкретна фігура реалізує цей договір по-своєму:

```typescript
class Circle extends Shape {
  constructor(private radius: number) {
    super();
  }

  calculateArea(): number {
    return Math.PI * Math.pow(this.radius, 2);
  }

  getInfo(): string {
    return `Коло з радіусом ${this.radius}`;
  }

  getRadius(): number {
    return this.radius;
  }
}

class Rectangle extends Shape {
  constructor(private width: number, private height: number) {
    super();
  }

  calculateArea(): number {
    return this.width * this.height;
  }

  getInfo(): string {
    return `Прямокутник ${this.width}x${this.height}`;
  }

  getWidth(): number {
    return this.width;
  }

  getHeight(): number {
    return this.height;
  }
}

class Triangle extends Shape {
  constructor(private base: number, private height: number) {
    super();
  }

  calculateArea(): number {
    return (this.base * this.height) / 2;
  }

  getInfo(): string {
    return `Трикутник з основою ${this.base} та висотою ${this.height}`;
  }

  getBase(): number {
    return this.base;
  }

  getHeight(): number {
    return this.height;
  }
}
```

Бачиш різницю? Кожна фігура тепер сама відповідає за себе. Коло знає формулу площі кола, прямокутник — формулу площі прямокутника. І тепер наш калькулятор стає набагато простішим:

```typescript
class AreaCalculator {
  calculateArea(shape: Shape): number {
    return shape.calculateArea();
  }

  calculateTotalArea(shapes: Shape[]): number {
    return shapes.reduce((total, shape) => {
      return total + shape.calculateArea();
    }, 0);
  }

  getShapeInfo(shape: Shape): string {
    return shape.getInfo();
  }

  getAreaStatistics(shapes: Shape[]): string {
    const totalArea = this.calculateTotalArea(shapes);
    const shapeCount = shapes.length;
    const averageArea = totalArea / shapeCount;

    return `Загальна площа: ${totalArea.toFixed(
      2
    )}, Кількість фігур: ${shapeCount}, Середня площа: ${averageArea.toFixed(
      2
    )}`;
  }
}
```

Дивись, як просто! Калькулятор більше не знає про конкретні фігури. Він просто просить фігуру порахувати свою площу. І тепер найцікавіше — давай додамо нові фігури:

```typescript
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

Що ми змінили в старому коді? Нічого! Абсолютно нічого! Ми просто додали нові класи, і все працює. Старий код залишився закритим для модифікації, але система відкрита для розширення. Ось як це використовувати:

```typescript
const shapes: Shape[] = [
  new Circle(5),
  new Rectangle(4, 6),
  new Triangle(3, 8),
  new Square(4),
  new Ellipse(3, 2),
];

const calculator = new AreaCalculator();

shapes.forEach((shape) => {
  console.log(
    `${shape.getInfo()}: площа = ${shape.calculateArea().toFixed(2)}`
  );
});

console.log(calculator.getAreaStatistics(shapes));
```

Круто, правда? Тепер ти можеш додавати скільки завгодно нових фігур, і старий код залишиться недоторканим. Менше ризиків, простіше тестування, щасливіші розробники.

Давай розглянемо ще один приклад, щоб закріпити розуміння. Уяви, що ти робиш систему знижок для інтернет-магазину. Ось як це часто роблять:

```typescript
enum CustomerType {
  REGULAR = "regular",
  PREMIUM = "premium",
  VIP = "vip",
  STUDENT = "student",
}

interface Customer {
  id: string;
  name: string;
  type: CustomerType;
  memberSince: Date;
}

class DiscountCalculator {
  calculateDiscount(customer: Customer, orderAmount: number): number {
    switch (customer.type) {
      case CustomerType.REGULAR:
        return 0;

      case CustomerType.PREMIUM:
        return orderAmount * 0.1;

      case CustomerType.VIP:
        const membershipYears = this.getYearsSinceMembership(
          customer.memberSince
        );
        if (membershipYears >= 2) {
          return orderAmount * 0.2;
        }
        return orderAmount * 0.15;

      case CustomerType.STUDENT:
        return Math.min(orderAmount * 0.15, 500);

      default:
        throw new Error("Невідомий тип клієнта");
    }
  }

  getDiscountDescription(customer: Customer): string {
    switch (customer.type) {
      case CustomerType.REGULAR:
        return "Без знижки";

      case CustomerType.PREMIUM:
        return "Знижка 10% на всі товари";

      case CustomerType.VIP:
        const membershipYears = this.getYearsSinceMembership(
          customer.memberSince
        );
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

  private getYearsSinceMembership(memberSince: Date): number {
    const now = new Date();
    return now.getFullYear() - memberSince.getFullYear();
  }
}
```

Знову ті самі проблеми — великі switch-блоки, дублювання логіки, і кожного разу для нового типу клієнта треба змінювати старий код. Давай виправимо це, використовуючи той самий підхід — кожен тип знижки буде окремим класом:

```typescript
abstract class DiscountStrategy {
  abstract calculateDiscount(orderAmount: number, memberSince: Date): number;
  abstract getDescription(): string;
}
```

Це наш договір для всіх типів знижок. Тепер реалізуємо конкретні стратегії:

```typescript
class NoDiscountStrategy extends DiscountStrategy {
  calculateDiscount(orderAmount: number, memberSince: Date): number {
    return 0;
  }

  getDescription(): string {
    return "Без знижки";
  }
}

class PremiumDiscountStrategy extends DiscountStrategy {
  calculateDiscount(orderAmount: number, memberSince: Date): number {
    return orderAmount * 0.1;
  }

  getDescription(): string {
    return "Знижка 10% на всі товари";
  }
}

class VipDiscountStrategy extends DiscountStrategy {
  calculateDiscount(orderAmount: number, memberSince: Date): number {
    const membershipYears = this.getYearsSinceMembership(memberSince);
    if (membershipYears >= 2) {
      return orderAmount * 0.2;
    }
    return orderAmount * 0.15;
  }

  getDescription(): string {
    return "VIP знижка до 20% на всі товари";
  }

  private getYearsSinceMembership(memberSince: Date): number {
    const now = new Date();
    return now.getFullYear() - memberSince.getFullYear();
  }
}

class StudentDiscountStrategy extends DiscountStrategy {
  calculateDiscount(orderAmount: number, memberSince: Date): number {
    return Math.min(orderAmount * 0.15, 500);
  }

  getDescription(): string {
    return "Студентська знижка 15% (максимум 500 грн)";
  }
}
```

Кожна стратегія знає свої правила розрахунку знижки. Тепер змінимо клас Customer, щоб він мав стратегію знижки:

```typescript
class Customer {
  constructor(
    private id: string,
    private name: string,
    private discountStrategy: DiscountStrategy,
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

  setDiscountStrategy(strategy: DiscountStrategy): void {
    this.discountStrategy = strategy;
  }
}
```

Зверни увагу — клієнт може змінювати свою стратегію знижки. Наприклад, звичайний клієнт може стати VIP. І наш калькулятор знижок тепер виглядає так:

```typescript
class DiscountCalculator {
  calculateDiscount(customer: Customer, orderAmount: number): number {
    return customer
      .getDiscountStrategy()
      .calculateDiscount(orderAmount, customer.getMemberSince());
  }

  getDiscountDescription(customer: Customer): string {
    return customer.getDiscountStrategy().getDescription();
  }

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

Простий і чистий код! А тепер найкраще — давай додамо нові типи знижок без зміни старого коду:

```typescript
class SeniorDiscountStrategy extends DiscountStrategy {
  calculateDiscount(orderAmount: number, memberSince: Date): number {
    return orderAmount * 0.12;
  }

  getDescription(): string {
    return "Знижка для пенсіонерів 12%";
  }
}

class SeasonalDiscountStrategy extends DiscountStrategy {
  constructor(private seasonalRate: number, private seasonName: string) {
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

Бачиш? Ми додали знижку для пенсіонерів і сезонну знижку, не змінивши жодного рядка старого коду. Давай протестуємо все разом:

```typescript
const customers = [
  new Customer(
    "1",
    "Іван Звичайний",
    new NoDiscountStrategy(),
    new Date("2023-01-01")
  ),
  new Customer(
    "2",
    "Марія Преміум",
    new PremiumDiscountStrategy(),
    new Date("2022-06-15")
  ),
  new Customer(
    "3",
    "Олександр VIP",
    new VipDiscountStrategy(),
    new Date("2020-03-20")
  ),
  new Customer(
    "4",
    "Анна Студентка",
    new StudentDiscountStrategy(),
    new Date("2023-09-01")
  ),
  new Customer(
    "5",
    "Петро Пенсіонер",
    new SeniorDiscountStrategy(),
    new Date("2021-12-10")
  ),
];

const newYearDiscount = new SeasonalDiscountStrategy(0.25, "Новорічна");
customers.push(
  new Customer("6", "Оксана Новорічна", newYearDiscount, new Date("2023-01-15"))
);

const calculator = new DiscountCalculator();
const orderAmount = 1000;

customers.forEach((customer) => {
  const report = calculator.generateDiscountReport(customer, orderAmount);
  console.log(report);
});

const regularCustomer = customers[0];
console.log(
  "До зміни статусу:",
  calculator.getDiscountDescription(regularCustomer)
);

regularCustomer.setDiscountStrategy(new VipDiscountStrategy());
console.log(
  "Після отримання VIP:",
  calculator.getDiscountDescription(regularCustomer)
);
```

Ось так працює принцип відкритості та закритості! Клієнт може навіть змінювати свій тип знижки динамічно — наприклад, коли звичайний клієнт стає VIP.

Давай підсумуємо. Принцип відкритості та закритості — це про те, щоб писати код, який легко розширювати, не змінюючи те, що вже працює. Основні правила прості. Якщо бачиш великий switch або купу if-else — подумай, чи можна це замінити на окремі класи. Кожен клас повинен робити одну річ і робити її добре. Використовуй абстрактні класи або інтерфейси як договори між класами. І завжди питай себе — чи доведеться мені змінювати старий код, щоб додати нову функцію?

Коли дотримуєшся цього принципу, твій код стає безпечнішим для змін, простішим для тестування, зрозумілішим для команди. І головне — ти перестаєш боятися додавати нові функції.

Спробуй знайти у своєму коді великі switch-блоки або довгі ланцюжки if-else. Подумай, як можна їх переписати, використовуючи окремі класи. Повір, після кількох таких рефакторингів ти почнеш автоматично писати код, який відповідає принципу відкритості та закритості.

На цьому все! У наступному уроці ми розберемо принцип підстановки Лісков — навчимося правильно використовувати наслідування. До зустрічі!
