/**
 * Правильна реалізація з птахами за допомогою інтерфейсів
 *
 * Переваги цього підходу:
 * - Кожна тварина реалізує тільки те, що вона справді вміє
 * - Компілятор захищає від помилок на етапі компіляції
 * - Код стає чіткішим та передбачуванішим
 * - Легко додавати нових тварин з різними здібностями
 */

export interface Animal {
    name: string;
    makeSound(): void;
}

export interface Flyable {
    fly(): void;
}

export interface Swimmable {
    swim(): void;
}

export class Eagle implements Animal, Flyable {
    name: string = 'Орел';

    fly(): void {
        console.log(`${this.name} ширяє високо над горами`);
    }

    makeSound(): void {
        console.log(`${this.name} кричить пронизливо`);
    }
}

export class Penguin implements Animal, Swimmable {
    name: string = 'Пінгвін';

    swim(): void {
        console.log(`${this.name} грайливо плаває під водою`);
    }

    makeSound(): void {
        console.log(`${this.name} видає звуки пінгвіна`);
    }
}

export class Duck implements Animal, Flyable, Swimmable {
    name: string = 'Качка';

    fly(): void {
        console.log(`${this.name} літає над ставком`);
    }

    swim(): void {
        console.log(`${this.name} плаває на поверхні`);
    }

    makeSound(): void {
        console.log(`${this.name} крякає`);
    }
}

export function makeAnimalSound(animal: Animal): void {
    animal.makeSound();
}

export function makeFlyableThingFly(flyable: Flyable): void {
    flyable.fly();
}
