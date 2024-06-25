class ItemData {

    id = 0;
    name = "";

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

class MiningSkillClass {
    constructor(name) {
        this.name = name;
        this.items = [
            Items.Coal_Ore,
            Items.Iron_Ore
        ];
    }
}
const MiningSkill = new MiningSkillClass();

console.log(Items);
console.log(MiningSkill.items);

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

function ShowMiningSkill(){
    const MiningSkill = new MiningSkillClass();
    MiningSkill.items.forEach(item => {
        const container = document.getElementById("mining-window").getElementsByTagName("div")[0];
        var innerHTML = '';
        innerHTML += '<item onclick="AddAmount(Inventory.Coal_ore, 1)">';
        innerHTML += '   <img name="icon" class="icon" src="images/Stas.png" alt="">';
        innerHTML += '   <div class="data">';
        innerHTML += '       <h3 name="title" class="title">'+item.GetName()+'</h3>';
        innerHTML += '       <p>';
        innerHTML += '           <span name="level" class="data-row">Lv. '+item.amount+'</span>';
        innerHTML += '           <span name="exp" class="data-row">5 EXP</span>';
        innerHTML += '           <span name="time" class="data-row"><img src="images/alchemist.png" alt="">15s</span>';
        innerHTML += '       </p>';
        innerHTML += '   </div>';
        innerHTML += '   <img class="arrow" src="images/arrow-right.png" alt="">';
        innerHTML += '</item>';
        container.innerHTML += innerHTML;
    });
}