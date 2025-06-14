# Урок 3: Open/Closed Principle - Скрипт для диктора

Привіт! Сьогодні ми розбираємо другу букву з SOLID принципів — це Open/Closed Principle, або принцип відкритості та закритості. Назва може здатися складною, але насправді ідея дуже проста і корисна.

Цей принцип допоможе тобі писати код, який легко розширювати новими функціями, не боячись зламати те, що вже працює. Ти зможеш додавати нові можливості до програми без зміни старого коду.

Після цього уроку ти будеш знати, як створювати гнучкий код, який легко адаптується до нових вимог.

## Що таке принцип відкритості/закритості?

Простими словами: твій код повинен бути відкритим для додавання нових функцій, але закритим для зміни старого коду.

Що це означає на практиці? "Відкритий для розширення" означає, що можна легко додавати нові можливості, створювати нові типи об'єктів, і програма може робити нові речі.

"Закритий для модифікації" означає, що старий код залишається без змін, те що вже працює продовжує працювати, і ризик зламати щось мінімальний.

Уяви, що ти будуєш будинок. Добре спроектований будинок дозволяє додавати нові кімнати — це розширення, але не руйнувати стіни що вже стоять — це означає не модифікувати існуюче.

Так само і в коді — добрий дизайн дозволяє додавати нові функції без ризику зламати існуючі.

Основні способи дотримання принципу: використовуй інтерфейси — вони визначають "договір" між класами, створюй окремі класи для різної поведінки — кожен клас робить одну річ, і уникай великих switch або if-else блоків — замість них використовуй поліморфізм.

Що відбувається, коли порушуємо цей принцип? Виникає високий ризик помилок — зміна старого коду може щось зламати. Стає складно тестувати — доводиться перевіряти весь код заново. З'являється страх додавати нові функції — боїшся щось зіпсувати. І код стає заплутаним — все перемішується в одному місці.

## Приклад порушення принципу

Давай подивимося на приклад коду, який здається нормальним, але насправді порушує принцип. Уяви, що ми створюємо калькулятор площі фігур.

```typescript
enum ShapeType {
    CIRCLE = 'circle',
    RECTANGLE = 'rectangle',
    TRIANGLE = 'triangle',
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
                throw new Error('Невідомий тип фігури');
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
                throw new Error('Невідомий тип фігури');
        }
    }
}
```

Давай подивимося, як цей код може використовуватися:

```typescript
const shapes: Shape[] = [
    { type: ShapeType.CIRCLE, radius: 5 },
    { type: ShapeType.RECTANGLE, width: 4, height: 6 },
    { type: ShapeType.TRIANGLE, base: 3, height: 8 },
];

const calculator = new AreaCalculator();

shapes.forEach((shape) => {
    console.log(`${calculator.getShapeInfo(shape)}: площа = ${calculator.calculateArea(shape)}`);
});

console.log(`Загальна площа: ${calculator.calculateTotalArea(shapes)}`);
```

Що не так з цим кодом? Проблема в тому, що щоб додати нову фігуру, наприклад квадрат, потрібно змінювати багато місць. Треба додати новий тип в ShapeType enum, створити новий інтерфейс для квадрата, змінити тип Shape щоб включити квадрат, додати новий case в метод calculateArea, і додати новий case в метод getShapeInfo.

Чому це погано? Доводиться змінювати старий код — це порушує принцип "закритий для модифікації". Високий ризик помилок — можна забути додати case в якомусь методі. Код стає складнішим — switch statements ростуть. І важко тестувати — треба перевіряти всі старі функції заново.

Що станеться через рік? Якщо додаси ще десять фігур, у тебе будуть величезні switch statements, які страшно змінювати.

## Правильний підхід

Давай перепишемо код так, щоб кожна фігура сама знала, як обчислити свою площу.

Спочатку створюємо загальний "договір" для всіх фігур:

```typescript
abstract class Shape {
    abstract calculateArea(): number;
    abstract getInfo(): string;
}
```

Це як договір — кожна фігура обіцяє вміти рахувати площу і розповідати про себе.

Тепер кожна фігура реалізує цей договір по-своєму:

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

Коло знає, як рахувати свою площу по формулі пі ер квадрат. Прямокутник рахує площу як ширина помножена на висоту. Трикутник рахує площу як основа помножена на висоту і поділена на два.

Тепер калькулятор стає простішим:

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
        )}, Кількість фігур: ${shapeCount}, Середня площа: ${averageArea.toFixed(2)}`;
    }
}
```

Тепер калькулятор не знає про конкретні фігури. Він просто просить фігуру порахувати свою площу, і фігура сама знає, як це робити.

А тепер найкраще — ми можемо додавати нові фігури без зміни старого коду:

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

Подивимося, як працює новий код:

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
    console.log(`${shape.getInfo()}: площа = ${shape.calculateArea().toFixed(2)}`);
});

console.log(calculator.getAreaStatistics(shapes));
```

Зверни увагу — ми додали квадрат і еліпс, але старий код не змінювався! Класи AreaCalculator, Circle, Rectangle, Triangle залишилися точно такими ж.

Чому новий код кращий? По-перше, він закритий для модифікації — старі класи не змінювалися. По-друге, він відкритий для розширення — легко додали нові фігури. Кожна фігура відповідає за себе — коло знає про коло, квадрат про квадрат. Простіше тестувати — можна тестувати кожну фігуру окремо. І менше ризиків — нові фігури не можуть зламати старі.

Головна ідея: замість одного великого switch, кожен клас сам знає, що робити!

## Другий приклад: система знижок

Ось ще один приклад, де спочатку все здається нормально, але потім стає складно. Уяви систему знижок в інтернет-магазині.

Поганий приклад, який порушує принцип:

```typescript
enum CustomerType {
    REGULAR = 'regular',
    PREMIUM = 'premium',
    VIP = 'vip',
    STUDENT = 'student',
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
                const membershipYears = this.getYearsSinceMembership(customer.memberSince);
                if (membershipYears >= 2) {
                    return orderAmount * 0.2;
                }
                return orderAmount * 0.15;

            case CustomerType.STUDENT:
                return Math.min(orderAmount * 0.15, 500);

            default:
                throw new Error('Невідомий тип клієнта');
        }
    }

    getDiscountDescription(customer: Customer): string {
        switch (customer.type) {
            case CustomerType.REGULAR:
                return 'Без знижки';

            case CustomerType.PREMIUM:
                return 'Знижка 10% на всі товари';

            case CustomerType.VIP:
                const membershipYears = this.getYearsSinceMembership(customer.memberSince);
                if (membershipYears >= 2) {
                    return 'VIP знижка 20% на всі товари';
                }
                return 'VIP знижка 15% на всі товари';

            case CustomerType.STUDENT:
                return 'Студентська знижка 15% (максимум 500 грн)';

            default:
                throw new Error('Невідомий тип клієнта');
        }
    }

    private getYearsSinceMembership(memberSince: Date): number {
        const now = new Date();
        return now.getFullYear() - memberSince.getFullYear();
    }
}
```

Подивимося, як використовується цей код:

```typescript
const customers: Customer[] = [
    { id: '1', name: 'Іван', type: CustomerType.REGULAR, memberSince: new Date('2023-01-01') },
    { id: '2', name: 'Марія', type: CustomerType.PREMIUM, memberSince: new Date('2022-06-15') },
    { id: '3', name: 'Олександр', type: CustomerType.VIP, memberSince: new Date('2020-03-20') },
];

const calculator = new DiscountCalculator();
const orderAmount = 1000;

customers.forEach((customer) => {
    const discount = calculator.calculateDiscount(customer, orderAmount);
    const description = calculator.getDiscountDescription(customer);
    console.log(`${customer.name}: ${description}, знижка: ${discount} грн`);
});
```

Проблеми з цим кодом: щоб додати новий тип клієнта, наприклад пенсіонер, треба додати в enum CustomerType, додати case в calculateDiscount, додати case в getDiscountDescription, і змінити старий код в кількох місцях. Щоб змінити правила знижки, треба змінювати методи. Switch statements повторюються в різних методах. І один клас робить забагато — рахує знижки і описує їх.

## Правильний підхід для знижок

Давай перепишемо це правильно. Кожен тип знижки буде окремим класом.

Спочатку створюємо договір для всіх типів знижок:

```typescript
abstract class DiscountStrategy {
    abstract calculateDiscount(orderAmount: number, memberSince: Date): number;
    abstract getDescription(): string;
}
```

Тепер кожен тип знижки реалізує договір по-своєму:

```typescript
class NoDiscountStrategy extends DiscountStrategy {
    calculateDiscount(orderAmount: number, memberSince: Date): number {
        return 0;
    }

    getDescription(): string {
        return 'Без знижки';
    }
}

class PremiumDiscountStrategy extends DiscountStrategy {
    calculateDiscount(orderAmount: number, memberSince: Date): number {
        return orderAmount * 0.1;
    }

    getDescription(): string {
        return 'Знижка 10% на всі товари';
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
        return 'VIP знижка до 20% на всі товари';
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
        return 'Студентська знижка 15% (максимум 500 грн)';
    }
}
```

А тепер можемо легко додавати нові типи знижок без зміни старого коду:

```typescript
class SeniorDiscountStrategy extends DiscountStrategy {
    calculateDiscount(orderAmount: number, memberSince: Date): number {
        return orderAmount * 0.12;
    }

    getDescription(): string {
        return 'Знижка для пенсіонерів 12%';
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

Клієнт тепер має стратегію знижки:

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

І калькулятор стає простішим:

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

Подивимося, як працює новий код:

```typescript
const customers = [
    new Customer('1', 'Іван Звичайний', new NoDiscountStrategy(), new Date('2023-01-01')),
    new Customer('2', 'Марія Преміум', new PremiumDiscountStrategy(), new Date('2022-06-15')),
    new Customer('3', 'Олександр VIP', new VipDiscountStrategy(), new Date('2020-03-20')),
    new Customer('4', 'Анна Студентка', new StudentDiscountStrategy(), new Date('2023-09-01')),
    new Customer('5', 'Петро Пенсіонер', new SeniorDiscountStrategy(), new Date('2021-12-10')),
];

const newYearDiscount = new SeasonalDiscountStrategy(0.25, 'Новорічна');
customers.push(new Customer('6', 'Оксана Новорічна', newYearDiscount, new Date('2023-01-15')));

const calculator = new DiscountCalculator();
const orderAmount = 1000;

customers.forEach((customer) => {
    const report = calculator.generateDiscountReport(customer, orderAmount);
    console.log(report);
});

const regularCustomer = customers[0];
console.log('До зміни статусу:', calculator.getDiscountDescription(regularCustomer));

regularCustomer.setDiscountStrategy(new VipDiscountStrategy());
console.log('Після отримання VIP:', calculator.getDiscountDescription(regularCustomer));
```

Зверни увагу — ми додали знижку для пенсіонерів і сезонну знижку, але старий код не змінювався!

Чому новий код кращий? Легко додавати нові типи знижок — просто створити новий клас. Старий код не змінюється — принцип дотримано! Кожен клас робить одну річ — розраховує один тип знижки. Можна змінювати знижки динамічно — клієнт може стати VIP. І простіше тестувати — кожен тип знижки тестується окремо.

## Порівняння підходів

Що спільного в обох прикладах? Великі switch або if-else блоки — вся логіка була в одному місці. Потрібно змінювати старий код — щоб додати щось нове. Дублювання логіки — схожі умови повторювалися. І один клас робив забагато — порушував принцип єдиної відповідальності.

Як принцип відкритості та закритості робить код кращим? Безпечно додавати нове — не боїшся зламати старе. Кожен клас має одну мету — простіше розуміти і тестувати. Код стає гнучким — можна легко змінювати поведінку. Менше помилок — нові функції не впливають на старі. І легше працювати в команді — різні люди можуть додавати різні функції.

Прості правила для дотримання принципу: якщо бачиш великий switch — подумай про класи. Кожен клас повинен робити одну річ добре. Використовуй інтерфейси для договорів. І питай себе: чи доведеться змінювати старий код для нової функції?

## Підсумок

Головні ідеї принципу відкритості та закритості: код повинен бути відкритим для розширення — легко додавати нове. Код повинен бути закритим для модифікації — не змінювати старе. Використовуй класи замість великих switch — кожен клас робить одну річ. І думай про майбутнє — як легко буде додавати нові функції?

Проста аналогія: уяви конструктор Лего. Добрий набір Лего дозволяє додавати нові деталі — це розширення, ти можеш купити більше кубиків. І не ламати старі конструкції — це не модифікувати, те що ти вже побудував залишається цілим.

Коли ти хочеш побудувати щось нове, ти не руйнуєш старі моделі — ти просто використовуєш додаткові кубики.

Так само і в коді — добрий дизайн дозволяє прикріплювати нові функції без розбирання старих.

Що робити далі? Подивися на свій код і знайди великі switch або if-else блоки. Запитай себе: чи доводиться мені змінювати цей код кожного разу для нової функції? Чи можу я винести кожен варіант в окремий клас? Чи стане код простішим, якщо кожен клас робитиме одну річ?

Спробуй переписати один такий блок, використовуючи класи замість switch!

У наступному уроці ми вивчимо Liskov Substitution Principle — принцип, який навчить правильно використовувати наслідування.

Увидимося на наступному уроці! Успіхів у програмуванні!
