// Primero define la clase SkillItem
class SkillItem {
    constructor(name) {
        this.name = name;
    }
}

// Luego define la clase MiningSkill, usando SkillItem ya definido
class MiningSkill {
    constructor(name) {
        this.name = name;
    }
    static items = [
        new SkillItem("Coal ore"),
        new SkillItem("Iron ore") // Cambiado el nombre para ilustrar otro item
    ];
}

// Crear una instancia de MiningSkill
const miningSkill = new MiningSkill("Mining");

console.log(MiningSkill.items);  // Acceso correcto a la propiedad estática
