const AttributesElement = document.getElementById('Attributes');
const StatsElement = document.getElementById('Stats');
const ToolsElement = document.getElementById('Tools');
const InventoryElement = document.getElementById('Inventory');
const ActivitiesElement = document.getElementById('Activities');
const SkillsElement = document.getElementById('Skills');


// 
function formatNumberWithDots(number = 0) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}


// STAT CLASSES
class StatClass {

    data = {
        name:     "",
        accron:   "",
        value:     0,
        current:   0,
        pointMult: 0
    }

    constructor(data = this.data){
        this.data.name      = data.name;
        this.data.accron    = data.accron;
        this.data.value     = data.value;
        this.data.current   = data.value;
        this.data.pointMult = data.pointMult;
    }

    AddPoint() {
        this.data.value += 1 * this.data.pointMult;
        this.data.value *= 1.1;
        this.data.value = Math.ceil(this.data.value);
    }
    ToJSON() { return { v: this.data.value } }
    FromJSON(json) { 
        if(json.v) this.data.value = json.v;
        return this;
    }
}
// ATTRIBUTE CLASSES
class AttributeClass {
    name = "";
    stat = "";
    level = 0;

    constructor(name, stat, level, ){
        this.name = name;
        this.stat = stat;
        this.level = level;
    }
    ToJSON() {
        return { l: this.level }
    }
    FromJSON(json) { 
        if(json.l) this.level = json.l;
        return this;
    }
}
// ITEM CLASSES
class ItemClass {
    name = "";
    group = "";
    type = "";
    grade = 0;
    meltReq = [{name: "", amount: 0}];
    toolReq = {type: "", grade: 0};
    levelReq = 0;
    craftAmount = 0;
    amount = 0;
    exp = 0;
    time = 0;
    bonnus = 0;

    constructor(json = {}){        
        if(json.name)        { this.name =        json.name;        } else { this.name =        ""; }
        if(json.group)       { this.group =       json.group;       } else { this.group =       ""; }
        if(json.type)        { this.type =        json.type;        } else { this.type =        ""; }
        if(json.meltReq)     { this.meltReq =     json.meltReq;     } else { this.meltReq =     []; }
        if(json.toolReq)     { this.toolReq =     json.toolReq;     } else { this.toolReq =     {}; }
        if(json.levelReq)    { this.levelReq =    json.levelReq;    } else { this.levelReq =     0; }
        if(json.craftAmount) { this.craftAmount = json.craftAmount; } else { this.craftAmount =  0; }
        if(json.grade)       { this.grade =       json.grade;       } else { this.grade =        0; }
        if(json.exp)         { this.exp =         json.exp;         } else { this.exp =          0; }
        if(json.time)        { this.time =        json.time;        } else { this.time =         0; }
        if(json.bonnus)      { this.bonnus =      json.bonnus;      } else { this.bonnus =       0; }
        if(json.amount)      { this.amount =      json.amount;      } else { this.amount =       0; }
    }
    AddAmount(amount = 0){this.amount += amount;}
    RemoveAmount(amount = 0){this.amount -= amount;}
    ToJSON(){
        var json = {
            a: this.amount
        }
        return json;
    }
    FromJSON(json){

        if(json.a) this.amount = json.a;

        return this;

    }
}
// TOOL CLASSES
class ToolClass {
    
    name = "";
    skill = "";
    item = new ItemClass({});

    constructor(name, skill, item){
        this.name = name;
        this.skill = skill;
        this.item = item;
    }
    ToJSON() { return { i: this.item }; }
    FromJSON(json) { this.item = json.i; }
}
// SKILL CLASSES
class SkillClass {
    name = "";
    level = 0;
    exp = 0;
    expMax = 0;

    constructor(name, level, exp, expMax){
        this.name = name;
        this.level = level;
        this.exp = exp;
        this.expMax = expMax;
    }
    AddExperience(amount){
        this.exp += amount;
        if(this.exp >= this.expMax){
            this.level++;
            this.exp-=this.expMax;
            this.expMax = 10 * (1.20 + this.level / 10);
        }
    }
    ToJSON(){
        var json = {
            l: this.level,
            e: this.exp,
            em: this.expMax
        }
        return json;
    }
    FromJSON(json){
        this.level = json["l"]; 
        this.exp = json["e"]; 
        this.expMax = json["em"]; 
    }
}
// ENTITY CLASSES
class EntityClass {
    data = {
        name: "",
        race: "",
        entityLevel: 1,
        exp: 0,
        levelReq: 0,
        time: 0,
        entityStats: {
            HealthPoints: new StatClass(),
            Attack: new StatClass(),
            Defense: new StatClass()
        },
        drops: [
            { rate: 0, amounts: [0, 0], item: new ItemClass() }
        ]
    }
    GetStats(){
        return this.data.entityStats;
    }
    GetStat(StatName = ""){
        var Stat = new StatClass();
        Stat = this.data.entityStats[StatName.replace(" ","")];
        return Stat.data;
    }
    GetLevel(){
        return this.data.entityLevel;
    }
    constructor(json = this.data){        
        if(json.name)        { this.data.name =        json.name;        } else { this.data.name =        ""; }
        if(json.race)        { this.data.race =        json.race;        } else { this.data.race =        ""; }
        if(json.entityLevel) { this.data.entityLevel = json.entityLevel; } else { this.data.entityLevel = 1; }
        if(json.entityStats) { this.data.entityStats = json.entityStats; } else { this.data.entityStats = new StatClass(); }
        if(json.exp)         { this.data.exp =         json.exp;         } else { this.data.exp =       0; }
        if(json.time)        { this.data.time =        json.time;        } else { this.data.time =      0; }
        if(json.levelReq)    { this.data.levelReq =    json.levelReq;    } else { this.data.levelReq =  0; }
        if(json.drops)       { this.data.drops =       json.drops;       } else { this.data.drops =    []; }

    }
    AddDamage(amount){
        this.data.entityStats.HealthPoints.data.current -= amount;
    }
    GetStats(){
        return this.data.entityStats;
    }
    GetCurrentHealth(){
        return this.data.entityStats.HealthPoints.data.current;
    }
    GetCurrentAttack(){
        return this.data.entityStats.Attack.data.current;
    }
    Clone(){
        return new EntityClass(this.data);
    }
    ToJSON() { return { data: this.data } }
    FromJSON(json) { 
        if(json.data) this.data = json.data;
        return this;
    }
}
// ACTIVITY CLASSES
class ActivityClass {

    name = "";
    verb = "";
    
    constructor(name, verb){
        this.name = name;
        this.verb = verb;
    }
    ToJSON() { return { } }
    FromJSON(json) { return this; }

}


class DataClass {
    Player = new EntityClass( { name: "Player", race: "Human", entityLevel: 1, 
        exp: 1,
        entityStats : {
            HealthPoints: new StatClass( { name: "Health Points", accron: "HP" , value: 20 } ) ,
            Attack:       new StatClass( { name: "Attack"       , accron: "ATK", value:  1 } ) ,
            Defense:      new StatClass( { name: "Defense"      , accron: "DEF", value:  2 } )
        }
    } );
    Attributes = {
        Vitality:     new AttributeClass("Vitality", "HP", 0),
        Strength:     new AttributeClass("Strength", "ATK", 0),
        Constitution: new AttributeClass("Constitution", "DEF", 0)
    }
    Stats = {
        HealthPoints: new StatClass( { name: "Health Points", accron: "HP" } ),
        Attack:       new StatClass( { name: "Attack"       , accron: "ATK"} ),
        Defense:      new StatClass( { name: "Defense"      , accron: "DEF"} )
    }
    Tools = {
        Weapon:     new ToolClass("Weapon",      "Hunter",     new ItemClass({})),
        Pickaxe:    new ToolClass("Pickaxe",     "Miner",      new ItemClass({})),
        Cauldron:   new ToolClass("Cauldron",    "Alchemist",  new ItemClass({})),
        Axe:        new ToolClass("Axe",         "Lumberjack", new ItemClass({})),
        FishingRod: new ToolClass("Fishing Rod", "Fisherman",  new ItemClass({})),
        Furnance:   new ToolClass("Furnance",    "Melter",     new ItemClass({})),
        Table:      new ToolClass("Table",       "Craftsman",  new ItemClass({}))
    }
    Items = {
        /*-------*/
        /* MINER */
        /*-------*/
        Sand: new ItemClass( { name: "Sand", group: "Miner",
            craftAmount: 1, 
            exp: 1,
            time: 1000
        }),
        Stone: new ItemClass( { name: "Stone", group: "Miner",
            craftAmount: 1, 
            exp: 1,
            time: 1000,
            toolReq: { type: "Pickaxe", grade: 1 }
        }),
        Coal: new ItemClass( { name: "Coal", group: "Miner", 
            craftAmount: 1, 
            exp: 1, 
            time: 2000,
            toolReq: { type: "Pickaxe", grade: 1 }
        }),
        IronOre: new ItemClass( { name: "Iron Ore", group: "Miner", 
            craftAmount: 1, 
            exp: 1, 
            time: 3000,
            toolReq: { type: "Pickaxe", grade: 2 }
        }),
        GoldOre: new ItemClass( { name: "Gold Ore", group: "Miner", 
            craftAmount: 1, 
            exp: 1, 
            time: 3000,
            toolReq: { type: "Pickaxe", grade: 3 }
        }),
        AmatystOre: new ItemClass( { name: "Amatyst Ore", group: "Miner", 
            craftAmount: 1, 
            exp: 1, 
            time: 3000,
            toolReq: { type: "Pickaxe", grade: 3 }
        }),
        EmeraldOre: new ItemClass( { name: "Emerald Ore", group: "Miner", 
            craftAmount: 1, 
            exp: 1, 
            time: 3000,
            toolReq: { type: "Pickaxe", grade: 4 }
        }),
        DiamondOre: new ItemClass( { name: "Diamond Ore",  group: "Miner", 
            craftAmount: 1, 
            exp: 1, 
            time: 3000,
            toolReq: { type: "Pickaxe", grade: 4 }
        }),
        

        /*------------*/
        /* LUMBERJACK */
        /*------------*/
        Wood: new ItemClass( { name: "Wood", group: "Lumberjack",
            craftAmount: 1,
            time: 3000,
            exp: 1,
            toolReq: { type: "Axe", grade: 1 }
        }),
        SpruceWood: new ItemClass( { name: "Spruce Wood", group: "Lumberjack",
            craftAmount: 1,
            time: 3000,
            exp: 1,
            toolReq: { type: "Axe", grade: 1 }
        }),
        JungleWood: new ItemClass( { name: "Jungle Wood", group: "Lumberjack",
            craftAmount: 1,
            time: 3000,
            exp: 1,
            toolReq: { type: "Axe", grade: 1 }
        }),


        /*-----------*/
        /* FISHERMAN */
        /*-----------*/
        Tuna: new ItemClass( { name: "Tuna", group: "Fisherman",
            craftAmount: 1,
            time: 3000,
            exp: 1,
            toolReq: { type: "Fishing Rod", grade: 1 }
        }),
        

        /*--------*/
        /* COOKER */
        /*--------*/
        CookedTuna: new ItemClass( { name: "Cooked Tuna", group: "Cooker",
            craftAmount: 1,
            time: 3000,
            exp: 1,
            toolReq: { type: "Furnance", grade: 1 },
            meltReq: [
                { amount: 1, name: "Coal" },
                { amount: 2, name: "Tuna" }
            ],
            type: 'Food'
        }),


        /*-----------*/
        /* ALCHEMIST */
        /*-----------*/
        HealPotion: new ItemClass( { name: "Heal Potion", group: "Alchemist",
            craftAmount: 1,
            time: 3000,
            exp: 1,
            toolReq: { type: "Cauldron", grade: 1 },
            meltReq: [
                { amount: 1, name: "Bottle" },
                { amount: 2, name: "Tuna" }
            ],
            type: 'Potion'
        }),


        /*--------*/
        /* MELTER */
        /*--------*/
        Glass: new ItemClass( { name: "Glass", group: "Melter", 
            craftAmount: 5, 
            exp: 1, 
            time: 3000,
            toolReq: { type: "Furnance", grade: 1 },
            meltReq: [
                { amount: 1, name: "Coal" },
                { amount: 5, name: "Sand" }
            ]
        }),
        IronBar: new ItemClass( { name: "Iron Bar", group: "Melter", 
            craftAmount: 1, 
            exp: 1, 
            time: 3000,
            toolReq: { type: "Furnance", grade: 1 },
            meltReq: [
                { amount: 1, name: "Coal" },
                { amount: 5, name: "Iron Ore" }
            ]
        }),
        GoldBar: new ItemClass( { name: "Gold Bar", group: "Melter", 
            craftAmount: 1, 
            exp: 1, 
            time: 3000,
            toolReq: { type: "Furnance", grade: 1 },
            meltReq: [
                { amount: 1, name: "Coal" },
                { amount: 5, name: "Gold Ore" }
            ]
        }),


        /*-----------*/
        /* CRAFTSMAN */
        /*-----------*/

        /* MISC */
        Bottle: new ItemClass( { name: "Bottle", group: "Craftsman",
            amount: 1,
            craftAmount: 4,
            exp: 1,
            time: 1000,
            meltReq: [
                { amount: 3, name: "Glass" }
            ]
        }),
        Stick: new ItemClass( { name: "Stick", group: "Craftsman",
            amount: 1,
            craftAmount: 4,
            exp: 1,
            time: 1000, 
            meltReq: [
                { amount: 2, name: "Wood Planks" }
            ]
        }),
        WoodPlanks: new ItemClass( { name: "Wood Planks", group: "Craftsman",
            craftAmount: 4, 
            exp: 1, 
            time: 1000, 
            meltReq: [
                {amount: 1, name: "Wood" }
            ]
        }),
        
        /* WEAPONS */
        WoodenSword: new ItemClass( { name: "Wooden Sword", group: "Craftsman",
            amount: 1, 
            craftAmount: 1,
            exp: 1, 
            time: 3000,
            meltReq: [
                { amount: 1, name: "Stick" },
                { amount: 2, name: "Wood" }
            ],
            type: "Weapon",
            grade: 1,
            bonnus: 5
        }),
        
        /* FISHING RODS */
        FishingRod: new ItemClass( { name: "Fishing Rod", group: "Craftsman",
            amount: 1, 
            craftAmount: 1,
            exp: 1, 
            time: 3000,
            meltReq: [
                { amount: 3, name: "Stick" }
            ],
            type: "Fishing Rod",
            grade: 1,
            bonnus: 5
        }),
        
        /* TABLES */
        WoodenTable: new ItemClass( { name: "Wooden Table", group: "Craftsman",
            amount: 1,
            craftAmount: 1, 
            exp: 1, 
            time: 3000,
            meltReq: [
                { amount: 4, name: "Wood Planks" }
            ],
            type: "Table",
            grade: 1,
            bonnus: 5
        }),
        
        /* CAULDRON */
        Cauldron: new ItemClass( { name: "Cauldron", group: "Craftsman",
            amount: 1,
            craftAmount: 1, 
            exp: 1, 
            time: 3000,
            meltReq: [
                { amount: 5, name: "Iron Bar" }
            ],
            type: "Cauldron",
            grade: 1,
            bonnus: 5
        }),

        /* FURNANCES */
        Furnance: new ItemClass( { name: "Furnance", group: "Craftsman",
            amount: 1,
            craftAmount: 1, 
            exp: 1, 
            time: 3000,
            meltReq: [
                { amount: 8, name: "Stone" }
            ],
            type: "Furnance",
            grade: 1,
            bonnus: 5
        }),

        /* PICKAXES */
        WoodenPickaxe: new ItemClass( { name: "Wooden Pickaxe", group: "Craftsman", 
            amount: 1,
            craftAmount: 1, 
            exp: 1, 
            time: 3000,
            toolReq: { type: "Table", grade: 1 },
            meltReq: [
                { amount: 1, name: "Stick" }, 
                { amount: 3, name: "Wood Planks" }
            ],
            type: "Pickaxe",
            grade: 1,
            bonnus: 5
        }),
        StonePickaxe: new ItemClass( { name: "Stone Pickaxe", group: "Craftsman", 
            craftAmount: 1, 
            exp: 1, 
            time: 3000,
            toolReq: { type: "Table", grade: 1 },
            meltReq: [
                { amount: 1, name: "Stick" }, 
                { amount: 3, name: "Stone" }
            ], 
            type: "Pickaxe", 
            grade: 2,
            bonnus: 7
        }),
        IronPickaxe: new ItemClass( { name: "Iron Pickaxe", group: "Craftsman", 
            craftAmount: 1, 
            exp: 1, 
            time: 3000,
            toolReq: { type: "Table", grade: 1 },
            meltReq: [
                { amount: 2, name: "Stick" },
                { amount: 3, name: "Iron Bar" }
            ], 
            type: "Pickaxe", 
            grade: 3,
            bonnus: 9
        }),

        /* AXES */
        WoodenAxe: new ItemClass( { name: "Wooden Axe", group: "Craftsman", 
            amount: 1,
            craftAmount: 1, 
            exp: 1, 
            time: 3000,
            toolReq: { type: "Table", grade: 1 },
            meltReq: [
                {amount: 2, name: "Stick"},
                {amount: 3, name: "Wood Planks"}
            ], 
            type: "Axe", 
            grade: 1,
            bonnus: 5 
        }),
        StoneAxe: new ItemClass( { name: "Stone Axe", group: "Craftsman",
            craftAmount: 1, 
            exp: 1, 
            time: 3000, 
            toolReq: { type: "Table", grade: 1 },
            meltReq: [
                { amount: 1, name: "Stick" }, 
                { amount: 3, name: "Stone" }
            ], 
            type: "Axe", 
            grade: 2,
            bonnus: 7
        })
    }
    Skills = {
        Hunter:     new SkillClass("Hunter", 1,0,10),
        Cooker:     new SkillClass("Cooker", 1,0,10),
        Alchemist:  new SkillClass("Alchemist", 1,0,10),
        Miner:      new SkillClass("Miner", 1,0,10),
        Lumberjack: new SkillClass("Lumberjack", 1,0,10),
        Fisherman:  new SkillClass("Fisherman", 1,0,10),
        Melter:     new SkillClass("Melter", 1,0,10),
        Craftsman:  new SkillClass("Craftsman", 1,0,10)
    }
    Entities = {
        Goblin: new EntityClass( { name: "Goblin", race: "Goblin", entityLevel: 1, 
            exp: 1, time: 1000, 
            levelReq: 1, 
            drops: [ 
                { rate: 100, amounts: [ 1 , 2 ], item: this.Items.Stone } 
            ], 
            entityStats : {
                HealthPoints: new StatClass( { name: "Health Points", accron: "HP" , value: 20 } ) ,
                Attack:       new StatClass( { name: "Attack"       , accron: "ATK", value:  1 } ) ,
                Defense:      new StatClass( { name: "Defense"      , accron: "DEF", value:  2 } )
            }
        } ),
        Orc: new EntityClass( { name: "Orc", race: "Orc", entityLevel: 2, 
            exp: 1, time: 1000, 
            levelReq: 1, 
            drops: [ 
                { rate: 100, amounts: [ 1 , 2 ], item: this.Items.Stick },
                { rate: 100, amounts: [ 1 , 2 ], item: this.Items.Stone } 
            ], 
            entityStats : {
                HealthPoints: new StatClass( { name: "Health Points", accron: "HP" , value: 40 } ) ,
                Attack:       new StatClass( { name: "Attack"       , accron: "ATK", value:  5 } ) ,
                Defense:      new StatClass( { name: "Defense"      , accron: "DEF", value: 12 } )
            }
        } ),    
    }
    Activities = {
        Hunter:     new ActivityClass("Hunter",     "Hunt" ),
        Cooker:     new ActivityClass("Cooker",     "Cook" ),
        Alchemist:  new ActivityClass("Alchemist",  "Transmute" ),
        Miner:      new ActivityClass("Miner",      "Mine" ),
        Lumberjack: new ActivityClass("Lumberjack", "Cut"  ),
        Fisherman:  new ActivityClass("Fisherman",  "Fish" ),
        Melter:     new ActivityClass("Melter",     "Melt" ),
        Craftsman:  new ActivityClass("Craftsman",  "Make" )
    }

    OpenInventoryGroup = "Hunter";

    /* GET FUNCTIONS */
    GetAttribute(AttributeName = "") {
        var Attribute = new AttributeClass();
        Attribute = this.Attributes[AttributeName.replace(" ","")]
        return Attribute;
    }
    GetStat(StatName = "") {
        var Stat = new StatClass();
        Stat = this.Stats[StatName.replace(" ","")]
        return Stat;
    }
    GetTool(ToolName = ""){
        var Tool = new ToolClass();
        Tool = this.Tools[ToolName.replace(" ","")]
        return Tool;
    }
    GetItem(ItemName = "") {
        var Item = new ItemClass();
        Item = this.Items[ItemName.replace(" ","")]
        return Item;
    }
    GetSkill(SkillName = "") {
        var Skill = new SkillClass();
        Skill = this.Skills[SkillName.replace(" ","")]
        return Skill;
    }
    GetEntity(EntityName = "") {
        var Entity = new EntityClass();
        Entity = this.Entities[EntityName.replace(" ","")]
        return Entity;
    }
    GetActivity(ActivityName = "") {
        var Activity = new ActivityClass();
        Activity = this.Activities[ActivityName.replace(" ","")]
        return Activity;
    }

    IsTool(tool) { return this.GetTool(tool) ? true : false ; }

    /* SAVE FUNCTIONS */
    json = {
        Player: new EntityClass(),
        Attributes: {},
        Stats: {},
        Tools: {},
        Items: {},
        Skills: {},
        Activities: {},
        OpenInventoryGroup: ""
    };
    Save(){
        
        this.json.Player = this.Player.ToJSON();   
        for (const AttributeName  in this.Attributes)  { this.json.Attributes[AttributeName]  = this.GetAttribute(AttributeName).ToJSON();   }
        for (const StatName       in this.Stats)       { this.json.Stats[StatName]            = this.GetStat(StatName).ToJSON();             }
        for (const ToolName       in this.Tools)       { this.json.Tools[ToolName]            = this.GetTool(ToolName).ToJSON();             }
        for (const ItemName       in this.Items)       { this.json.Items[ItemName]            = this.GetItem(ItemName).ToJSON();             }
        for (const SkillName      in this.Skills)      { this.json.Skills[SkillName]          = this.GetSkill(SkillName).ToJSON();           }
        for (const ActivitiesName in this.Activities)  { this.json.Activities[ActivitiesName] = this.GetActivity(ActivitiesName).ToJSON();   }
        this.json.OpenInventoryGroup = this.OpenInventoryGroup;

        return this.json;
    }
    Load(json = this.json){
        for ( var ItemName  in Data.Items  ) { if(json.Items[ItemName]   ) { this.GetItem(ItemName).FromJSON(json.Items[ItemName])     } }
        for ( var SkillName in Data.Skills ) { if(json.Skills[SkillName] ) { this.GetSkill(SkillName).FromJSON(json.Skills[SkillName]) } }
        for ( var ToolName  in Data.Tools  ) { if(json.Tools[ToolName]   ) { this.GetTool(ToolName).FromJSON(json.Tools[ToolName])     } }
        this.OpenInventoryGroup = json.OpenInventoryGroup;
        this.Player.FromJSON(json.Player);
        this.Save()
    }
    
}
const Data = new DataClass();
const Player = Data.Player;

console.log(Player.GetStats());




// ON LOAD
LoadData();

updateDisplay(true);


function ManagerAttributes(generate){
    if(generate){
        for(const AttributesName in Data.Attributes){
            const Attribute = Data.GetAttribute(AttributesName)
            // Crea el párrafo
            const element = document.createElement('p');
            element.setAttribute('name', Attribute.name);
            element.classList.add("attribute");
            element.innerHTML = `<span>+<span class="level">${Attribute.level}</span> ${Attribute.name}</span><button>+</button>`;
            element.getElementsByTagName("button")[0].addEventListener('click', () => UpgradeAttribute(Attribute));

            AttributesElement.appendChild(element);
        }
        ManagerAttributes(false);
    }else{
        for (var element of AttributesElement.getElementsByTagName('p')){
            const AttributeName = element.getAttribute('name');
            element.getElementsByClassName("level")[0].textContent = Data.GetAttribute(AttributeName).level;
        }
    }
}
function ManagerStats(generate){
    if(generate){
        for(const StatName in Data.Stats){
            const StatData = Data.GetStat(StatName).data;
            const element = document.createElement('p');
            element.setAttribute('name', StatData.name);
            element.classList.add("stat");
            if(StatName === "HealthPoints" ){
                element.innerHTML = `<span title='${StatData.name}'>${StatData.accron}</span><span><span class="current">${StatData.current}</span> ${StatData.accron} / <span class="value">${StatData.value}</span> ${StatData.accron}</span>`;
            }else{
                element.innerHTML = `<span title='${StatData.name}'>${StatData.accron}</span><span><span class="value">${StatData.value}</span> ${StatData.accron}</span>`;
            }

            StatsElement.appendChild(element);
        }
        ManagerStats(false);
    }else{
        for (const element of StatsElement.getElementsByTagName('p')){
            const StatName = element.getAttribute('name').replace(" ","");
            if(element.getElementsByClassName("current")[0])
                element.getElementsByClassName("current")[0].textContent = Player.GetStat(StatName).current.toLocaleString('es-ES');
            element.getElementsByClassName("value")[0].textContent = Player.GetStat(StatName).value.toLocaleString('es-ES');
        }
    }
}
function ManagerTools(generate){
    if(generate){
        for(const ToolName in Data.Tools){
            const Tool = Data.GetTool(ToolName);
            var element = document.createElement('p');
            element.setAttribute('name', Tool.name);
            element.innerHTML =  `<span class="name"></span><span>+<span class="amount">${Tool.item.bonnus}</span>% ${Tool.skill} Exp.</span><button>Unequip</button>`;
            element.getElementsByTagName("button")[0].addEventListener('click', () => EquipTool(new ItemClass({type: Tool.name})));
            ToolsElement.appendChild(element);
        }
        ManagerTools(false);
    }else{
        for (var element of ToolsElement.getElementsByTagName('p')){
            var Tool = Data.GetTool(element.getAttribute('name'));

            element.getElementsByClassName("name")[0].textContent = Tool.item.name || "";
            element.getElementsByClassName("amount")[0].textContent = Tool.item.bonnus || 0;

            if(Tool.item.name){
                element.getElementsByTagName("button")[0].classList.add("enable")
                element.getElementsByTagName("button")[0].classList.remove("disable")
            }else{
                element.getElementsByTagName("button")[0].classList.add("disable")
                element.getElementsByTagName("button")[0].classList.remove("enable")
            }
        }
    }
}
function ManagerInventory(generate){
    if(generate){
        InventoryElement.innerHTML += `<div class="header"></div>`;
        for(const ActivityName in Data.Activities){
            const Activity = Data.GetActivity(ActivityName);
            var element = document.createElement("h3");
            InventoryElement.getElementsByClassName("header")[0].appendChild(element);
            element.textContent = Activity.verb;
            element.setAttribute("onclick", `ShowInventoryGroup('${Activity.name}')`)
            element.addEventListener('click', () => {
                alert(Activity.name);
            } );
            
            InventoryElement.innerHTML += `<div class="group" name="${Activity.name}"></div>`;
        }
        for(const ItemName in Data.Items){
            const Item = Data.GetItem(ItemName)
            var GroupElement = InventoryElement;
            for (const group of InventoryElement.getElementsByTagName("div")) {
                if(group.getAttribute("name")== Item.group){
                    GroupElement = group;
                }
            }

            var element = document.createElement("p");
            element.setAttribute("class", "item");
            element.setAttribute("name", Item.name);
            element.setAttribute("title", `x${Item.amount} ${Item.name}`)
            element.setAttribute("style", "display: 'none'");
            element.innerHTML += `<span>${Item.name}</span><span class="amount">0</span>`;
            if(Data.IsTool(Item.type)){
                element.innerHTML += `<button>Equip</button>`;
                element.getElementsByTagName("button")[0].addEventListener('click', () => EquipTool(Item) );
            } else if ( Item.type == "Food" ){
                element.innerHTML += `<button>Eat</button>`;
                //element.getElementsByTagName("button")[0].addEventListener('click', () => EquipTool(Item) );
            } else if ( Item.type == "Potion" ){
                element.innerHTML += `<button>Drink</button>`;
                //element.getElementsByTagName("button")[0].addEventListener('click', () => EquipTool(Item) );
            }
            GroupElement.appendChild(element);
        }
        ShowInventoryGroup(Data.OpenInventoryGroup);
        ManagerInventory(false);
    }else{
        for (var element of InventoryElement.getElementsByTagName('p')){
            const name = element.getAttribute('name');
            if(Data.GetItem(name).amount == 0){
                element.setAttribute("style", "display: 'none'");
            }else{
                element.removeAttribute("style")
            }
            element.getElementsByClassName("amount")[0].textContent = formatNumberWithDots(Data.GetItem(name).amount);
            if(Data.GetTool(Data.GetItem(name).type)){
                //console.log(Data.GetTool(Data.GetItem(name).type).item)
                if(Data.GetTool(Data.GetItem(name).type).item.name === name){
                    element.getElementsByTagName('button')[0].textContent = "UNEQUIP";
                }else{
                    element.getElementsByTagName('button')[0].textContent = "EQUIP";
                }
            }

        }
    }
}
function ManagerSkills(generate){
    if(generate){
        for(const SkillName in Data.Skills){
            const Skill = Data.GetSkill(SkillName);
            const element = document.createElement('p');
            element.setAttribute('name', Skill.name);
            element.classList.add("skill");
            element.innerHTML = `<span>${Skill.name}</span><span>Lv. <span class="level">${Skill.level}</span> Exp. <span class="exp">${Skill.exp}</span>/<span class="expMax">${Skill.expMax}</span></span>`;
            SkillsElement.appendChild(element);
        }
        ManagerSkills(false);
    }else{
        for (var element of SkillsElement.getElementsByTagName('p')){
            const SkillName = element.getAttribute('name');
            const Skill = Data.GetSkill(SkillName);
            element.getElementsByClassName("level")[0].textContent = Skill.level.toString();
            element.getElementsByClassName("exp")[0].textContent = Skill.exp.toString();
            element.getElementsByClassName("expMax")[0].textContent = Skill.expMax.toString();
        }
    }
}
function ManagerActivities(generate){
    if(generate){
        for (var ActivityName in Data.Activities){
            var Activity = Data.Activities[ActivityName];
            ActivitiesElement.innerHTML += `<div name='${ActivityName}' class="activities"><h3 class='title'>${ActivityName}</h3><div class='content'></div></div>`;
        }
        for (var ActivityElement of ActivitiesElement.getElementsByTagName("div")) {
            if(ActivityElement.parentElement != ActivitiesElement || ActivityElement.getAttribute('name') != "Hunter")
                continue;
            for (const EntityName in Data.Entities) {
                const Entity = Data.GetEntity(EntityName);
                const EntityData = Entity.data;
                const element = document.createElement('p');
                element.setAttribute('name', Entity.name)
                element.classList.add('activity');
                element.innerHTML = `
                    <span class="data">
                        <span class="name">${EntityData.name} Lv.${EntityData.entityLevel}</span>
                        <span class="reqs">
                    </span>
                    </span><button>${Data.Activities.Hunter.verb}</button>
                    `;
                var text = `Lv. ${EntityData.levelReq}`;
                element.getElementsByClassName('reqs')[0].innerHTML += `<a name="" title="${text}">${text}</a>`;
                element.getElementsByTagName("button")[0].addEventListener('click', () => ActivityHuntEvent(EntityData.name));
                ActivityElement.getElementsByClassName("content")[0].appendChild(element);
            }
        }
        for(const ItemName in Data.Items) {
            const Item = Data.GetItem(ItemName);
            for (var ActivityElement of ActivitiesElement.getElementsByTagName("div")) {
                if(ActivityElement.parentElement != ActivitiesElement)
                    continue; 

                var elementName = ActivityElement.getAttribute("name").toString();
                const itemGroup = Item.group.toString();
                const tool = (skill) => {
                    switch (skill) {
                        case "Miner":      return "Pickaxe";
                        case "Lumberjack": return "Axe";
                        case "Fisherman":  return "Fishing Rod";
                        case "Alchemist":  return "Cauldron";
                        case "Cooker":     return "Furnance";
                        case "Melter":     return "Furnance";
                        case "Craftsman":  return "Table";
                        default: return "empty";
                    }
                }
                if(elementName === itemGroup){
                    // Crea el párrafo
                    const element = document.createElement('p');
                    element.setAttribute('name', Item.name)
                    element.classList.add('activity');
                    element.innerHTML = `
                        <span class="data">
                            <span class="name">${Item.name} ${Item.craftAmount == 1 ? '':'x'+Item.craftAmount}</span>
                            <span class="reqs"></span>
                        </span>
                        <button>${Data.Activities[itemGroup].verb}</button>
                    `;
                    if(Data.GetItem(Item.name).levelReq != 0){
                        var text = `Lv. ${Data.GetItem(Item.name).levelReq}`;
                        element.getElementsByClassName('reqs')[0].innerHTML += `<a name="" title="${text}">${text}</a>`;
                    }
                    if(Data.GetItem(Item.name).toolReq.type != undefined){
                        const req = Data.GetItem(Item.name).toolReq;
                        var text = `G${req.grade} ${req.type}`;
                        element.getElementsByClassName('reqs')[0].innerHTML += `<a name="${req.type}" title="${text}">${text}</a>`;
                    }

                    for (const req of Data.GetItem(Item.name).meltReq){
                        var text = `${req.name} ${req.amount == 1 ? '':'x'+req.amount}`;
                        element.getElementsByClassName('reqs')[0].innerHTML += `<a name="${req.name}" title="${text}">${text}</a>`;
                    }
                    element.getElementsByTagName("button")[0].addEventListener('click', () => ActivityEvent(Item.name, tool(itemGroup)));


                    ActivityElement.getElementsByClassName("content")[0].appendChild(element);
                    break;
                }
    
            }
        }
        ManagerActivities(false);
    } else {
        for (var ActivityElement of ActivitiesElement.getElementsByClassName("activity")){
            const ActivityElementName = ActivityElement.getAttribute('name');
            const ActivityItem = Data.GetItem(ActivityElementName);

            const LeftCraftReqs = CheckLeftCraftReqs(ActivityItem);
            const LeftMeltReqs = CheckLeftMeltReqs(ActivityItem);
            for(const ActivityReq of ActivityElement.getElementsByClassName("reqs")[0].getElementsByTagName('a')){
                var ActivityReqName = ActivityReq.getAttribute("name");

                ActivityReq.setAttribute('class',"enable");

                for(const LeftCraftReq of LeftCraftReqs){
                    if(LeftCraftReq.type === ActivityReqName){
                        if(LeftCraftReq.grade > Data.GetTool(LeftCraftReq.type).item.grade){
                            ActivityReq.setAttribute('class',"disable");
                        }
                    }
                }
                

                for(const LeftMeltReq of LeftMeltReqs){
                    if(LeftMeltReq.name === ActivityReqName){
                        ActivityReq.setAttribute('class',"disable");
                    }
                }

            }
            if(LeftCraftReqs.length == 0 && LeftMeltReqs.length == 0){
                ActivityElement.getElementsByTagName('button')[0].classList.add("enable");
                ActivityElement.getElementsByTagName('button')[0].classList.remove("disable");
            }else{
                ActivityElement.getElementsByTagName('button')[0].classList.remove("enable");
                ActivityElement.getElementsByTagName('button')[0].classList.add("disable");
            }
        }
    }
    
}


function CheckLeftCraftReqs(item = new ItemClass({}), send){
    var left = [];
    if(item.toolReq.type){    
        var currentTool = Data.GetTool(item.toolReq.type).item;
        if(currentTool){
            if(currentTool.grade < item.toolReq.grade){
                left.push(item.toolReq);
            }
        }
    }
    return left;
}
function CheckLeftMeltReqs(item = new ItemClass({}), send){
    var left = [];
    if(item.meltReq){
        for (const req of item.meltReq) {
            if(Data.GetItem(req.name).amount < req.amount){
                left.push(req);
            }
        }
    }
    return left;
}


function EquipTool(item = new ItemClass()){

    if(Data.GetTool(item.type).item.name === item.name || item === new ItemClass({type: item.type})){
        Data.GetTool(item.type).item = new ItemClass({type: item.type});
        for (const element of InventoryElement.getElementsByTagName('p')){
            if(element.getAttribute('name') === item.name){
                element.getElementsByTagName('button')[0].textContent = 'equip'
            }
        }
    }else{
        Data.GetTool(item.type).item = item;
        for (const element of InventoryElement.getElementsByTagName('p')){
            if(element.getAttribute('name') === item.name){
                element.getElementsByTagName('button')[0].textContent = 'Unequip'
            }
        }
    }

    updateDisplay();

}
function ShowInventoryGroup(group){
    for (const element of InventoryElement.getElementsByClassName("group")) {
        if(element.getAttribute("name") === group){
            element.setAttribute("style", "display: flex")
        }else{
            element.setAttribute("style", "display: none")
        }
    }
    Data.OpenInventoryGroup = group;
    console.log(Data.OpenInventoryGroup)
    SaveData()
}


function UpgradeAttribute(attribute = new AttributeClass()){
    if (statPoints > 0 && attribute.level < 99) {
        attribute.level++;
        statPoints--;
        Stats.GetStat(attribute.stat).AddPoint();
        updateDisplay();
    }
}


function CheckMeltReqs(item = new ItemClass({}), send){
    let allReqs = 0;
    if(item.meltReq){
        for (const req of item.meltReq) {
            if(Data.GetItem(req.name).amount >= req.amount){
                allReqs++;
            }else if(send) { 
                const element = document.createElement("p");
                element.classList.add("material");
                element.textContent = `${req.name} x${req.amount}`;
                setTimeout(()=>{
                    element.remove();
                    if(document.getElementById("dont-materials").childElementCount == 0){
                        document.getElementById("dont-materials").style.display = 'none';
                    }
                }, 5000);

            }
        }
    }
    if(allReqs != item.meltReq.length){
        activityInProgress = false;
        return false;
    }
    return true;
}
function CheckCraftReqs(item = new ItemClass({}), send){
    if(!item.toolReq.type){
        return true;
    }else{        
        var currentTool = Data.GetTool(item.toolReq.type).item;
        if(currentTool){
            if(currentTool.grade >= item.toolReq.grade){
                return true;
            }
            return false;
        }
        return false;
    }
}


function ActivityHuntEvent(EntityName = "", ) {

    var Entity = Data.GetEntity(EntityName).Clone();
    var EntityData = Entity.data;
    
    if(Player.GetLevel() >= EntityData.levelReq) {

        //startHuntProgressBar(Entity,time);

        const BattlePlayer_Health = Player.GetStat("Health Points").current;
        const BattlePlayer_Attack = Player.GetStat("Attack").current;
        const BattlePlayer_Defense = Player.GetStat("Defense").current;
        
        const BattleEntity_Health = Entity.GetStat("Health Points").current;
        const BattleEntity_Attack = Entity.GetStat("Attack").current;
        const BattleEntity_Defense = Entity.GetStat("Defense").current;

        var turn = 0;

        const BattleStatus = setInterval(() => {

            var PlayerWin = false;
            var EntityWin = false;

            if(turn % 2 === 0){
                var PlayerToEntityDamage = (BattlePlayer_Attack * BattlePlayer_Attack) / (BattlePlayer_Attack + BattleEntity_Defense)
                Entity.AddDamage(PlayerToEntityDamage);
                console.log(`${EntityData.name} recived ${PlayerToEntityDamage} DMG `, Entity.GetCurrentHealth());
            }

            if(turn % 2 === 1){
                var EntityToPlayerDamage = (BattlePlayer_Attack * BattlePlayer_Attack) / (BattlePlayer_Attack + BattleEntity_Defense)
                Player.AddDamage(EntityToPlayerDamage);
                console.log(`Player recived ${EntityToPlayerDamage} DMG `, Player.GetCurrentHealth());
                ManagerStats(false);
            }

            if(Entity.GetStat("Health Points").current <= 0){
                PlayerWin = true;
            } else if(Player.GetStat("Health Points").current <= 0){
                EntityWin = true;
            }

            if(PlayerWin){
                for (const Item of EntityData.drops) {
                    rate = Math.floor(Math.random() * 100)
                    if( Item.rate >= rate ){
                        amount = Math.floor(Math.random() * Item.amounts[1]) + Item.amounts[0];
                        console.log(`${Item.item.name} x${amount}`, );
                        Data.GetItem(Item.item.name).AddAmount(amount);
                        Data.Skills.Hunter.AddExperience(EntityData.exp);
                    }
                }
                updateDisplay(false);
                clearInterval(BattleStatus);
            }

            if(EntityWin){
                updateDisplay(false);
                clearInterval(BattleStatus);
            }

            turn++;

        }, 100);
    }
    return;

}
function ActivityEvent(resource, tool = "") {
    const item = Data.GetItem(resource);
    if(CheckMeltReqs(item, true) && CheckCraftReqs(item, true)){
        console.log(item)
        var time = item.time;
        time *= 1 - (Data.GetTool(tool).item.bonnus || 0)/100;
        time = time <= 0 ? 1: time;

        startProgressBar(item,time);

        setTimeout(() => {
            item.AddAmount(item.craftAmount);
            Data.GetSkill(item.group).AddExperience(item.exp);

            for (const req of item.meltReq) {
                Data.GetItem(req.name).RemoveAmount(req.amount);
            }

            updateDisplay(false);

        }, time);
    }

}


function SaveData(){
    localStorage.setItem("db", JSON.stringify(Data.Save()));
}
function LoadData(){

    if(localStorage.getItem("db")){
        Data.Load(JSON.parse(localStorage.getItem("db")))
    }

}


let gold = 0;
let experience = 0;
let experienceMax = 0;
let level = 1;
let statPoints = 0;
let hp = 100;


const Money_Display = document.getElementById('money');
const expDisplay = document.getElementById('experience');
const expMaxDisplay = document.getElementById('experienceMax');
const levelDisplay = document.getElementById('level');
const statPointsDisplay = document.getElementById('statPoints');

function checkLevelUp() {
    if (experience >= experienceMax) {
        if(level == 9){
            while(experience > 100){
                experience -= 100;
                Items.GetItem("Gold Ore").AddAmount(1);
            }
        }else{
            experience -= experienceMax;
            experienceMax = Math.ceil(level * (2 * level));
            level++;
            statPoints += 5;
        }
    }
}

function updateDisplay(first = false) {
    // console.log(`Call: Update ${display}`)
    // Money_Display.textContent = AmountFormat(gold);
    // expDisplay.textContent = experience;
    // expMaxDisplay.textContent = experienceMax;
    // levelDisplay.textContent = level;

    ManagerAttributes(first);
    ManagerStats(first);
    ManagerTools(first);
    ManagerInventory(first);
    ManagerSkills(first);
    ManagerActivities(first);

    SaveData();
}
function AmountFormat(amount){
    var formated = [""," K"," M"," B"," T"];
    var loops = 0;
    var decimals =0;
    while(amount > 1000){
        loops++;
        amount/=1000;
    }

    if (loops == 0) { decimals = 0; } else {
        if (amount > 99) { decimals = 0; } else
        if (amount >  9) { decimals = 1; } else
        if (amount >  0) { decimals = 2; }
    }

    amount = Math.floor(amount*10) / 10;
    return amount.toFixed(decimals)+formated[loops];
}

function startProgressBar(item = new ItemClass(), duration = 0) {
    const container = document.getElementById("activity-progress");

    if (!container) {
        console.error("Container for activity progress not found");
        return;
    }

    const material = container.getElementsByClassName("material")[0];
    const progress = container.getElementsByClassName("progressBar")[0];

    if (!material || !progress) {
        console.error("Material or progress bar element not found");
        return;
    }

    container.style.display = 'flex';
    progress.style.width = '0%';
    material.textContent = item.name;

    let startTime = Date.now();

    function updateProgress() {
        let elapsed = Date.now() - startTime;
        let percent = (elapsed / duration) * 100;
        progress.style.width = `${Math.min(percent, 100)}%`; // Asegura que no exceda 100%

        if (Math.min(percent, 100) < 100) {
            requestAnimationFrame(updateProgress);
        } else {
            setTimeout(()=>{
                container.style.display = 'none';
            }, 100)
        }
    }

    updateProgress();
}


// Ganar oro y experiencia automáticamente cada 5 segundos
// setInterval(gainGold, 500);
// setInterval(gainExp, 100);