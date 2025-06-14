/**
 * Правильна реалізація принципу розділення інтерфейсів для системи працівників
 *
 * Рішення: Розділяємо великий інтерфейс Worker на три чітких інтерфейси,
 * кожен з яких відповідає за свою роль.
 *
 * Переваги:
 * - Звичайний працівник має тільки потрібні йому методи
 * - Менеджер може комбінувати кілька ролей
 * - Немає зайвих винятків
 * - Чіткий розподіл відповідальностей
 */

export interface Workable {
    work(): void;
}

export interface Eatable {
    eat(): void;
}

export interface Manageable {
    manageTeam(): void;
    fireEmployee(id: string): void;
    approveVacation(id: string): void;
}

export class RegularEmployee implements Workable, Eatable {
    work(): void {
        console.log('Виконую свою роботу');
    }

    eat(): void {
        console.log('Йду на обід');
    }
}

export class Manager implements Workable, Eatable, Manageable {
    work(): void {
        console.log('Планую роботу команди');
    }

    eat(): void {
        console.log('Йду на обід');
    }

    manageTeam(): void {
        console.log('Управляю командою');
    }

    fireEmployee(id: string): void {
        console.log(`Звільняю працівника ${id}`);
    }

    approveVacation(id: string): void {
        console.log(`Схвалюю відпустку для ${id}`);
    }
}

// Створюємо екземпляри працівників
const regularEmployee = new RegularEmployee();
const manager = new Manager();

// Звичайний працівник може працювати і ходити на обід
regularEmployee.work();
regularEmployee.eat();

// Менеджер може робити все те саме, плюс управляти командою
manager.work();
manager.eat();
manager.manageTeam();
manager.fireEmployee('123');
manager.approveVacation('456');

// Якщо спробувати викликати метод управління на звичайному працівнику,
// TypeScript покаже помилку компіляції:
// regularEmployee.manageTeam(); // ❌ Помилка компіляції!
