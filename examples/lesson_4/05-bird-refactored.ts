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

// Створюємо різних тварин
const eagle = new Eagle();
const penguin = new Penguin();
const duck = new Duck();

console.log('--- Всі тварини можуть видавати звуки ---');
makeAnimalSound(eagle); // Орел кричить пронизливо
makeAnimalSound(penguin); // Пінгвін видає звуки пінгвіна
makeAnimalSound(duck); // Качка крякає

console.log('\n--- Тільки літаючі тварини можуть літати ---');
makeFlyableThingFly(eagle); // Орел ширяє високо над горами
makeFlyableThingFly(duck); // Качка літає над ставком

// Спроба передати пінгвіна до функції для літаючих тварин
// призведе до помилки компіляції - TypeScript не дозволить це зробити!
// makeFlyableThingFly(penguin); // ❌ Compilation Error!

console.log('\n--- Демонстрація специфічних здібностей ---');
console.log('Пінгвін плаває:');
penguin.swim(); // Пінгвін грайливо плаває під водою

console.log('\nКачка може і літати, і плавати:');
duck.fly(); // Качка літає над ставком
duck.swim(); // Качка плаває на поверхні

// Створюємо масиви тварин за їх здібностями
const allAnimals = [eagle, penguin, duck];
const flyingAnimals = [eagle, duck]; // Тільки ті, хто літає
const swimmingAnimals = [penguin, duck]; // Тільки ті, хто плаває

console.log('\n--- Всі тварини ---');
allAnimals.forEach((animal) => {
    console.log(`${animal.name}:`);
    animal.makeSound();
});

console.log('\n--- Літаючі тварини ---');
flyingAnimals.forEach((animal) => {
    animal.fly();
});

console.log('\n--- Плаваючі тварини ---');
swimmingAnimals.forEach((animal) => {
    animal.swim();
});
