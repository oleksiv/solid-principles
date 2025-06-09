# 🎥 **Урок 5: Interface Segregation Principle (Принцип розділення інтерфейсів)**

---

## 🎬 **ВСТУП**

Привіт! Сьогодні ми розберемо четвертий принцип SOLID — **Interface Segregation Principle** або **принцип розділення інтерфейсів**.

Цей принцип допоможе тобі писати код, де класи не "змушують" використовувати зайві методи, які їм не потрібні. Навіть у маленьких проектах це значно спрощує розуміння коду та його подальшу підтримку.

---

## 📖 **ПРОСТА ТЕОРІЯ**

**Своїми словами:** Не змушуй класи залежати від методів, які вони не використовують. Краще зробити кілька маленьких, конкретних інтерфейсів, ніж один великий з купою методів.

**Офіційно звучить так:** "Клієнти не повинні залежати від інтерфейсів, які вони не використовують."

**Аналогія з життя:** Уявіть пульт від телевізора з 100 кнопками, але ви використовуєте тільки 5. Було б краще мати кілька маленьких пультів: один для звуку, інший для каналів, третій для налаштувань. Кожен пульт відповідає за свою частину функцій.

**Часті помилки:**

- Створення "божественних" інтерфейсів з 10+ методами
- Примушування простих класів реалізовувати складні інтерфейси
- Використання `throw new Error()` для непотрібних методів

---

## ❌ **ПРИКЛАД ПОМИЛКИ (1-й кейс)**

Уявіть, що ми створюємо систему для різних типів принтерів:

```typescript
// ❌ Поганий інтерфейс - занадто широкий
interface AllInOnePrinter {
  print(document: string): void;
  scan(document: string): string;
  fax(document: string, number: string): void;
  photocopy(document: string): string;
}

// Простий принтер, який може тільки друкувати
class SimplePrinter implements AllInOnePrinter {
  print(document: string): void {
    console.log(`Друкую: ${document}`);
  }

  // 😱 Змушені реалізовувати методи, які не потрібні
  scan(document: string): string {
    throw new Error("Цей принтер не може сканувати!");
  }

  fax(document: string, number: string): void {
    throw new Error("Цей принтер не може відправляти факс!");
  }

  photocopy(document: string): string {
    throw new Error("Цей принтер не може копіювати!");
  }
}
```

**Що тут не так?**

- `SimplePrinter` змушений реалізувати методи, які йому не потрібні
- Код стає заплутаним з купою винятків
- Якщо в інтерфейс додамо новий метод, всі класи зламаються

**Чому це порушує принцип:**
Клас залежить від методів інтерфейсу, які він ніколи не використає. Це створює зайві залежності та ускладнює код.

---

## ✅ **ПРАВИЛЬНИЙ ВАРІАНТ ТА РОЗБІР (1-й кейс)**

Давайте розділимо великий інтерфейс на маленькі, конкретні:

```typescript
// ✅ Крок 1: Розділяємо інтерфейс на маленькі частини
interface Printable {
  print(document: string): void;
}

interface Scannable {
  scan(document: string): string;
}

interface Faxable {
  fax(document: string, number: string): void;
}

interface Photocopiable {
  photocopy(document: string): string;
}

// ✅ Крок 2: Простий принтер використовує тільки те, що йому потрібно
class SimplePrinter implements Printable {
  print(document: string): void {
    console.log(`Друкую: ${document}`);
  }
}

// ✅ Крок 3: Багатофункціональний принтер може поєднувати інтерфейси
class MultiFunctionPrinter implements Printable, Scannable, Faxable {
  print(document: string): void {
    console.log(`Друкую: ${document}`);
  }

  scan(document: string): string {
    console.log(`Сканую: ${document}`);
    return `Скановані дані з ${document}`;
  }

  fax(document: string, number: string): void {
    console.log(`Відправляю факс ${document} на номер ${number}`);
  }
}
```

```typescript
// Тестуємо наші принтери
const simplePrinter = new SimplePrinter();
const multiPrinter = new MultiFunctionPrinter();

// Простий принтер може тільки друкувати
simplePrinter.print("Важливий документ"); // Друкую: Важливий документ

// Багатофункціональний принтер може все
multiPrinter.print("Звіт"); // Друкую: Звіт
multiPrinter.scan("Документ"); // Сканую: Документ
multiPrinter.fax("Контракт", "+380501234567"); // Відправляю факс Контракт на номер +380501234567

// ❌ Помилка компіляції - простій принтер не може сканувати
// simplePrinter.scan("Документ"); // Error: Property 'scan' does not exist on type 'SimplePrinter'
```

**Пояснення кожного кроку:**

**Крок 1:** Замість одного великого інтерфейсу створили чотири маленьких, кожен відповідає за одну функцію.

**Крок 2:** `SimplePrinter` тепер залежить тільки від `Printable` — жодних зайвих методів!

**Крок 3:** `MultiFunctionPrinter` може поєднувати потрібні інтерфейси. Це як конструктор — бери тільки те, що потрібно.

**Чому тепер дотримано принципу:**
Кожен клас залежить тільки від тих методів, які він реально використовує. Код стає чистішим і зрозумілішим.

---

## 🔁 **ІНШИЙ ПРИКЛАД (2-й кейс)**

Тепер розглянемо приклад з системою працівників:

```typescript
// ❌ Поганий інтерфейс - змішує різні ролі
interface Worker {
  work(): void;
  eat(): void;
  manageTeam(): void;
  fireEmployee(id: string): void;
  approveVacation(id: string): void;
}

// Звичайний працівник
class RegularEmployee implements Worker {
  work(): void {
    console.log("Виконую свою роботу");
  }

  eat(): void {
    console.log("Йду на обід");
  }

  // 😱 Звичайний працівник не може управляти командою
  manageTeam(): void {
    throw new Error("Я не можу управляти командою!");
  }

  fireEmployee(id: string): void {
    throw new Error("Я не можу звільняти співробітників!");
  }

  approveVacation(id: string): void {
    throw new Error("Я не можу схвалювати відпустки!");
  }
}
```

**Виправлення:**

```typescript
// ✅ Розділяємо на конкретні ролі
interface Workable {
  work(): void;
}

interface Eatable {
  eat(): void;
}

interface Manageable {
  manageTeam(): void;
  fireEmployee(id: string): void;
  approveVacation(id: string): void;
}

// ✅ Звичайний працівник
class RegularEmployee implements Workable, Eatable {
  work(): void {
    console.log("Виконую свою роботу");
  }

  eat(): void {
    console.log("Йду на обід");
  }
}

// ✅ Менеджер
class Manager implements Workable, Eatable, Manageable {
  work(): void {
    console.log("Планую роботу команди");
  }

  eat(): void {
    console.log("Йду на обід");
  }

  manageTeam(): void {
    console.log("Управляю командою");
  }

  fireEmployee(id: string): void {
    console.log(`Звільняю працівника ${id}`);
  }

  approveVacation(id: string): void {
    console.log(`Схвалюю відпустку для ${id}`);
  }
}
```

---

```typescript
// Використання класів
const regularEmployee = new RegularEmployee();
const manager = new Manager();

// Звичайний працівник
regularEmployee.work(); // Виконую свою роботу
regularEmployee.eat(); // Йду на обід

// Менеджер
manager.work(); // Планую роботу команди
manager.eat(); // Йду на обід
manager.manageTeam(); // Управляю командою
manager.fireEmployee("123"); // Звільняю працівника 123
manager.approveVacation("456"); // Схвалюю відпустку для 456

// ❌ Спроба викликати методи менеджера у звичайного працівника
// regularEmployee.manageTeam();    // Помилка компіляції
// regularEmployee.fireEmployee();  // Помилка компіляції
```

## 🧠 **СПІЛЬНЕ У ДВОХ ПРИКЛАДАХ**

**Що об'єднує обидва кейси:**

1. В обох випадках ми мали "товстий" інтерфейс з різними відповідальностями
2. Класи були змушені реалізовувати методи, які їм не потрібні
3. Після розділення код став чистішим і логічнішим

**Як принцип допомагає вже сьогодні:**

- **Простіше тестування:** можна тестувати кожну функцію окремо
- **Легше розуміння:** одразу зрозуміло, що може робити клас
- **Гнучкість:** можна легко додавати нові типи принтерів чи працівників
- **Менше помилок:** немає "зайвих" методів, які можуть кинути виняток

---

## 💬 **ПІДСУМОК**

**Ключова ідея простими словами:** Роби інтерфейси маленькими і конкретними. Кожен клас повинен знати тільки про ті методи, які він реально використовує.

**Аналогія:** Це як набір інструментів. Замість одного величезного багатофункціонального інструменту, краще мати окремо молоток, викрутку і пилку. Кожен інструмент робить свою справу найкраще.

**Практична порада:** Коли створюєш інтерфейс і думаєш "а що якщо деякі класи не будуть використовувати цей метод?" — це сигнал розділити інтерфейс на менші частини.

Спробуй подивитися на свій старий код і знайди "товсті" інтерфейси. Можливо, їх варто розділити? 🔍

---

## 📁 **ДОДАТКОВО**

**Корисні ресурси для поглиблення:**

1. [Refactoring Guru - Interface Segregation](https://refactoring.guru/uk/didp/principles/interface-segregation) — прості приклади українською
2. [Clean Code by Robert Martin](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350884) — розділ про принципи дизайну
3. [SOLID Principles Explained](https://www.freecodecamp.org/news/solid-principles-explained-in-plain-english/) — англомовний огляд всіх принципів

**Завдання для практики:**
Створи систему для різних типів транспорту (автомобіль, велосипед, човен). Подумай, які дії може виконувати кожен з них, і створи відповідні інтерфейси згідно з ISP.

**Приклади коду з цього уроку** можна знайти в репозиторії курсу у папці `lesson-5-examples/`.

---

_Наступний урок: **Dependency Inversion Principle** — останній, але дуже важливий принцип SOLID! 🚀_
