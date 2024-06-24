class ItemData {

    constructor(id, name) { this.id = id; this.name = name; }

    GetID() { return this.id; }
    GetName() { return this.name; }

}

const Items = {
    Coal_Ore: new ItemData(0, "Coal Ore"),
    Iron_Ore: new ItemData(1, "Iron Ore"),
    Iron_Ingot: new ItemData(2, "Iron Ingot")
}

class InventoryItem {

    constructor(item, amount) { this.item = item; this.amount = amount; }
    
    addAmount(amount) { this.amount += amount; }
    setAmount(amount) { this.amount = amount; }
    removeAmount(amount) { this.amount -= amount; }
    
    toJSON() { return { id: this.item.id, name: this.item.name, amount: this.amount }; }

    static fromJSON(data) { return new ItemData(data.id, data.name, data.amount); }

}

class InventoryClass {

    constructor() { this.items = []; }

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

class MiningSkill {
    constructor(name) {
        this.name = name;
        this.items = [
            Items.Coal_Ore,
            Items.Iron_Ore
        ];
    }
}

const _MiningSkill = new MiningSkill();

function SaveData(clave, valor) {
    const valorString = typeof valor === 'object' ? JSON.stringify(valor) : valor;
    localStorage.setItem(clave, valorString);
}

function LoadData(clave) {
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
SaveData('Inventory', Inventory);

// Cargar el inventario desde localStorage
const InventoryLoaded = InventoryClass.fromJSON(LoadData('Inventory'));

export { Items, _MiningSkill};