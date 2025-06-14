# Сценарій відеоуроку: Dependency Inversion Principle

Привіт! Сьогодні ми з тобою розберемо останній, п'ятий принцип SOLID — Dependency Inversion Principle або принцип інверсії залежностей. І знаєш що? Це один з найважливіших принципів, який реально змінить твій підхід до написання коду.

Уяви ситуацію — ти написав класний код для роботи з PayPal у своєму інтернет-магазині. Все працює чудово. А потім приходить замовник і каже: "А давай ще додамо Stripe і можливість платити карткою напряму". І тут ти розумієш, що треба переписувати половину коду. Знайома ситуація? От саме від таких проблем і рятує принцип інверсії залежностей.

Давай я поясню простими словами, що це за принцип. По суті, він каже: не змушуй високорівневі класи залежати від конкретних реалізацій. Замість цього використовуй інтерфейси — це як договори про те, що має робити код, а не як саме він це робить.

Офіційно принцип звучить трохи складніше. По-перше, модулі високого рівня не повинні залежати від модулів низького рівня — обидва повинні залежати від абстракцій. По-друге, абстракції не повинні залежати від деталей — навпаки, деталі повинні залежати від абстракцій. Звучить заплутано? Зараз все стане зрозуміло на прикладах.

Давай візьмемо просту аналогію з життя. Коли ти вмикаєш світло вдома, ти ж не думаєш про те, яка там лампочка — звичайна, LED чи галогенна. Ти просто натискаєш вимикач, і світло вмикається. Вимикач — це високий рівень, він не залежить від конкретного типу лампочки. Він працює з будь-якою лампочкою, яка підходить до стандартного патрону. От цей патрон — це і є наша абстракція.

Тепер давай подивимось, як це виглядає в коді. Почнемо з поганого прикладу — системи обробки платежів в інтернет-магазині.

```typescript
class PayPalPayment {
  processPayment(amount: number): boolean {
    console.log(`Обробляю ${amount} грн через PayPal`);
    return true;
  }
}

class OrderService {
  private paymentProcessor: PayPalPayment;

  constructor() {
    this.paymentProcessor = new PayPalPayment();
  }

  processOrder(amount: number): void {
    console.log("Обробляю замовлення...");
    const success = this.paymentProcessor.processPayment(amount);
    if (success) {
      console.log("Замовлення успішно оплачено!");
    }
  }
}

const orderService = new OrderService();
orderService.processOrder(100);
```

Бачиш проблему? Наш OrderService жорстко прив'язаний до PayPal. Всередині конструктора ми створюємо new PayPalPayment, і все — тепер цей клас може працювати тільки з PayPal. Хочеш додати Stripe? Доведеться переписувати OrderService. Хочеш протестувати без реальних платежів? Теж проблема.

Це класичне порушення принципу інверсії залежностей. Високорівневий клас OrderService залежить від конкретної реалізації PayPalPayment, а не від абстракції. І це створює купу проблем — код важко тестувати, важко розширювати, і він порушує принцип відкритості-закритості, який ми вже вивчали.

А тепер давай виправимо цю ситуацію і застосуємо принцип інверсії залежностей правильно.

```typescript
interface PaymentProcessor {
  processPayment(amount: number): boolean;
}

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

class OrderService {
  private paymentProcessor: PaymentProcessor;

  constructor(paymentProcessor: PaymentProcessor) {
    this.paymentProcessor = paymentProcessor;
  }

  processOrder(amount: number): void {
    console.log("Обробляю замовлення...");
    const success = this.paymentProcessor.processPayment(amount);
    if (success) {
      console.log("Замовлення успішно оплачено!");
    }
  }
}

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

От тепер давай розберемо, що ми зробили. Перше — створили інтерфейс PaymentProcessor. Це наша абстракція, наш договір. Будь-який платіжний процесор повинен мати метод processPayment, який приймає суму і повертає результат.

Друге — всі конкретні реалізації тепер залежать від цієї абстракції. PayPal, Stripe, банківська карта — всі вони реалізують інтерфейс PaymentProcessor. Вони обіцяють дотримуватись договору.

І третє, найважливіше — OrderService тепер залежить тільки від абстракції. Він не знає, з чим працює — з PayPal, Stripe чи карткою. Він просто знає, що отримує щось, що вміє обробляти платежі. А конкретну реалізацію ми передаємо ззовні через конструктор. Це називається Dependency Injection — ін'єкція залежностей.

Тепер подивись, яка гнучкість! Хочеш додати новий спосіб оплати? Просто створи новий клас, який реалізує PaymentProcessor. OrderService міняти не треба взагалі. Хочеш протестувати? Створи мок-об'єкт, який реалізує PaymentProcessor, і передай його в OrderService. Все просто і елегантно.

Давай розглянемо ще один приклад, щоб закріпити розуміння. Цього разу візьмемо систему логування.

```typescript
class UserService {
  createUser(name: string, email: string): void {
    console.log(`Створюю користувача ${name}`);
    console.log(`Користувач ${name} створений успішно`);
  }

  deleteUser(id: string): void {
    console.log(`Видаляю користувача з ID: ${id}`);
    console.log(`Користувач ${id} видалений`);
  }
}
```

Бачиш проблему? UserService жорстко прив'язаний до console.log. А що якщо на продакшені ми хочемо логувати в файл або відправляти логи на віддалений сервер? Знову доведеться переписувати код.

Давай виправимо це з допомогою інверсії залежностей.

```typescript
interface Logger {
  log(message: string): void;
}

class ConsoleLogger implements Logger {
  log(message: string): void {
    console.log(`[CONSOLE]: ${message}`);
  }
}

class FileLogger implements Logger {
  log(message: string): void {
    console.log(`[FILE]: Записую в файл - ${message}`);
  }
}

class RemoteLogger implements Logger {
  log(message: string): void {
    console.log(`[REMOTE]: Відправляю на сервер - ${message}`);
  }
}

class UserService {
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  createUser(name: string, email: string): void {
    this.logger.log(`Створюю користувача ${name}`);
    this.logger.log(`Користувач ${name} створений успішно`);
  }

  deleteUser(id: string): void {
    this.logger.log(`Видаляю користувача з ID: ${id}`);
    this.logger.log(`Користувач ${id} видалений`);
  }
}

const consoleLogger = new ConsoleLogger();
const fileLogger = new FileLogger();
const remoteLogger = new RemoteLogger();

const userServiceDev = new UserService(consoleLogger);
const userServiceProd = new UserService(remoteLogger);
const userServiceTest = new UserService(fileLogger);

userServiceDev.createUser("Іван", "ivan@example.com");
userServiceProd.createUser("Марія", "maria@example.com");
```

Круто, правда? Тепер UserService не знає і не хвилюється про те, куди йдуть логи. Він просто використовує абстракцію Logger. А конкретну реалізацію ми вибираємо при створенні сервісу — консоль для розробки, віддалений сервер для продакшену, файл для тестів.

Давай підсумуємо, що спільного в обох прикладах. По-перше, в обох випадках високорівневі класи спочатку жорстко залежали від конкретних реалізацій. По-друге, ми створили абстракції у вигляді інтерфейсів, щоб відокремити деталі від бізнес-логіки. І по-третє, ми використали Dependency Injection для передачі залежностей ззовні.

І знаєш що найкрутіше? Цей принцип допомагає вже сьогодні, навіть у невеликих проектах. Легке тестування — можеш підставити мок-об'єкти замість реальних залежностей. Гнучкість — можеш змінювати реалізації без зміни основного коду. Масштабованість — легко додавати нові функції. І розділення відповідальностей — бізнес-логіка відокремлена від технічних деталей.

Запам'ятай ключову ідею: залежи від "що треба зробити", а не від "як саме це робиться". Передавай залежності ззовні, а не створюй їх всередині класу. Це як розетка в стіні — тобі не важливо, звідки береться електрика, головне що в розетці є стандартні 220 вольт. Твій пристрій залежить від стандарту розетки, а не від конкретного джерела енергії.

Кілька практичних порад напостанок. Якщо бачиш new всередині класу — подумай, чи можна передати цю залежність ззовні. Створюй інтерфейси для зовнішніх сервісів — API, бази даних, файлової системи. І у великих проектах використовуй Dependency Injection контейнери — вони автоматизують процес створення об'єктів з усіма залежностями.

Вітаю! Ти щойно вивчив усі п'ять принципів SOLID! Single Responsibility — один клас, одна відповідальність. Open-Closed — відкритий для розширення, закритий для модифікації. Liskov Substitution — підкласи мають поводитись як базові класи. Interface Segregation — краще багато маленьких інтерфейсів, ніж один великий. І Dependency Inversion — залежи від абстракцій, а не від конкретних реалізацій.

Тепер ти знаєш, як писати чистий, масштабований і підтримуваний код! Наступний крок — застосовуй ці принципи у своїх проектах і вивчай патерни проектування. Вони будуються на основі SOLID і допоможуть тобі вирішувати типові задачі елегантно й ефективно.

Дякую, що був зі мною протягом усього курсу! Бажаю тобі писати крутий код і отримувати від цього задоволення. До зустрічі!
