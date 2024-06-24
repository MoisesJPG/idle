// Clase Item
class Item {

    constructor(name, amount = 0) {
        this.name = name;
        this.amount = amount;
    }

    addAmount(amount) { this.amount += amount; }
    setAmount(amount) { this.amount = amount; }
    removeAmount(amount) { this.amount -= amount; }

    toJSON() {
        return {
            name: this.name,
            amount: this.amount
        };
    }

    static fromJSON(data) {
        return new Item(data.name, data.amount);
    }
}

// Clase Inventory
class Inventory {

    constructor() {
        this.items = {
            Coal_ore: new Item("Coal ore"),
            Iron_ore: new Item("Iron ore")
        };
    }

    getItem(name) {
        return this.items[name];
    }

    toJSON() {
        return this.items;
    }

    static fromJSON(data) {
        const inventory = new Inventory();
        for (const key in data) {
            inventory.items[key] = Item.fromJSON(data[key]);
        }
        return inventory;
    }
}

// Clase MiningSkill
class MiningSkill {

    constructor(name) {
        this.name = name;
    }

    static items = [
        'Coal_ore',
        'Iron_ore'
    ];
}

// Funciones para guardar y cargar datos
function guardarDatos(clave, valor) {
    const valorString = typeof valor === 'object' ? JSON.stringify(valor) : valor;
    localStorage.setItem(clave, valorString);
}

function cargarDatos(clave) {
    const valor = localStorage.getItem(clave);
    try {
        return JSON.parse(valor);
    } catch (e) {
        return valor;
    }
}

// Ejemplo de uso
const inventario = new Inventory();
inventario.getItem('Coal_ore').addAmount(10);
inventario.getItem('Iron_ore').addAmount(5);

// Guardar el inventario en localStorage
guardarDatos('inventario', inventario);

// Cargar el inventario desde localStorage
const inventarioCargado = Inventory.fromJSON(cargarDatos('inventario'));

console.log(inventarioCargado);
