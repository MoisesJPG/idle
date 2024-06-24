// Clase Item
class Item {

    constructor(name) {
        this.name = name;
        this.amount = 0;
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
class InventoryClass {

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
        const inventory = new InventoryClass();
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
        const MiningSkillInv = new InventoryClass();
        this.items = [
            MiningSkillInv.items.Coal_ore,
            MiningSkillInv.items.Iron_ore
        ];
    }

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
const Inventory = new InventoryClass();
Inventory.getItem('Coal_ore').addAmount(10);
Inventory.getItem('Iron_ore').addAmount(5);

// Guardar el inventario en localStorage
guardarDatos('inventory', Inventory);

// Cargar el inventario desde localStorage
const InventoryLoaded = InventoryClass.fromJSON(cargarDatos('Inventory'));

console.log(InventoryLoaded);
console.log(MiningSkill.items);
