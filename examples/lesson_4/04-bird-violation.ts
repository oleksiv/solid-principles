/**
 * Приклад порушення принципу підстановки Лісков з птахами
 *
 * Проблеми цього підходу:
 * - Пінгвін не може літати, але змушений реалізувати метод fly()
 * - Доводиться кидати помилки в методах, які не підходять для підкласу
 * - Код стає непередбачуваним - функції можуть несподівано кидати помилки
 * - Потрібні додаткові try-catch блоки для обробки винятків
 */

export class Bird {
    name: string;

    constructor(name: string) {
        this.name = name;
    }

    fly(): void {
        console.log(`${this.name} літає в небі`);
    }

    makeSound(): void {
        console.log(`${this.name} видає звук`);
    }
}

export class Eagle extends Bird {
    constructor() {
        super('Орел');
    }

    fly(): void {
        console.log(`${this.name} ширяє високо над горами`);
    }

    makeSound(): void {
        console.log(`${this.name} кричить пронизливо`);
    }
}

export class Penguin extends Bird {
    constructor() {
        super('Пінгвін');
    }

    fly(): void {
        throw new Error('Пінгвіни не можуть літати!');
    }

    makeSound(): void {
        console.log(`${this.name} видає звуки пінгвіна`);
    }

    swim(): void {
        console.log(`${this.name} грайливо плаває під водою`);
    }
}

export function makeBirdFly(bird: Bird): void {
    try {
        bird.fly();
    } catch (error) {
        console.log(`Помилка: ${(error as Error).message}`);
    }
}
