/**
 * Порушення принципу розділення інтерфейсів в системі управління працівниками
 *
 * Проблема: Інтерфейс Worker змішує різні ролі та відповідальності.
 * Звичайний працівник змушений реалізовувати методи менеджера,
 * які йому взагалі не потрібні.
 *
 * Це як давати касиру в супермаркеті доступ до банківських рахунків
 * компанії — безглуздо і небезпечно.
 */

export interface Worker {
    work(): void;
    eat(): void;
    manageTeam(): void;
    fireEmployee(id: string): void;
    approveVacation(id: string): void;
}

export class RegularEmployee implements Worker {
    work(): void {
        console.log('Виконую свою роботу');
    }

    eat(): void {
        console.log('Йду на обід');
    }

    manageTeam(): void {
        throw new Error('Я не можу управляти командою!');
    }

    fireEmployee(id: string): void {
        throw new Error('Я не можу звільняти співробітників!');
    }

    approveVacation(id: string): void {
        throw new Error('Я не можу схвалювати відпустки!');
    }
}
