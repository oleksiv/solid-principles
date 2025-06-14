/**
 * Приклад використання рефакторингованої системи тварин
 *
 * Демонструє, як елегантно працювати з різними тваринами
 * через інтерфейси без порушення принципу Лісков
 */

import { Eagle, Penguin, Duck, makeAnimalSound, makeFlyableThingFly } from './05-bird-refactored';

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
