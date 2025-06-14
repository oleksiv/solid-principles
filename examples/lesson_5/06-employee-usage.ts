/**
 * Приклад використання рефакторених класів працівників
 *
 * Демонструє як працюють класи, що дотримуються принципу розділення інтерфейсів.
 * Кожен працівник має рівно ті можливості, які йому потрібні для роботи.
 */

import { RegularEmployee, Manager } from './05-employee-refactored';

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
