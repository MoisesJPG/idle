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
class StatData {
    id = 0;
    name = "";
    accron = "";
    value = 0;
    pointMult = 0;

    constructor(id, name, accron, value, pointMult){
        this.id = id;
        this.name = name;
        this.accron = accron;
        this.value = value;
        this.pointMult = pointMult;
    }
    clone(stat = new StatData()){
        const ClonedStat = stat;
        this.id = ClonedStat.id;
        this.name = ClonedStat.name;
        this.accron = ClonedStat.accron;
        this.value = ClonedStat.value;
        this.pointMult = ClonedStat.pointMult;

        return this;
    }
    GetValue() { return this.value; }
    AddPoint() {
        this.value += 1 * this.pointMult;
        this.value *= 1.1;
        this.value = Math.ceil(this.value);
    }
}
class StatList {
    constructor(){
        this.stats = [
            new StatData(0, "Health Points", "HP", 20, 5),
            new StatData(1, "Attack", "ATK", 1, 1),
            new StatData(2, "Defense", "DEF", 2, 2)
        ]
    }
    GetStat(accron = ""){
        for (var stat of this.stats) {
            if (stat.accron.toLowerCase().replace(" ","") === accron.toLowerCase().replace(" ","")) {
                return stat;
            }
        }
    }
    GetStats(){
        return this.stats;
    }
}
const Stats = new StatList();


// ATTRIBUTE CLASSES
class AttributeData {
    id = 0;
    name = "";
    stat = "";
    level = 0;

    constructor(id, name, stat, level, ){
        this.id = id;
        this.name = name;
        this.stat = stat;
        this.level = level;
    }
    clone(attribute = new AttributeData()){
        const ClonedAttribute = attribute;
        this.id = ClonedAttribute.id;
        this.name = ClonedAttribute.name;
        this.stat = ClonedAttribute.stat;
        this.level = ClonedAttribute.level;
        return this;
    }
}
class AttributeList {
    constructor(){
        this.attributes = [
            new AttributeData(0, "Vitality", "HP", 0),
            new AttributeData(1, "Strength", "ATK", 0),
            new AttributeData(2, "Constitution", "DEF", 0)
        ]
    }
    GetAttribute(name = ""){
        for (var attribute of this.attributes) {
            if (attribute.name.toLowerCase().replace(" ","") === name.toLowerCase().replace(" ","")) {
                return attribute;
            }
        }
    }
    GetAttributes(){
        return this.attributes;
    }
}
const Attributes = new AttributeList();


// ITEM CLASSES
class ItemData {
    name = "";
    group = "";
    type = "";
    grade = 0;
    meltReq = [];
    toolReq = {type: "", grade: 0};
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
        if(json.craftAmount) { this.craftAmount = json.craftAmount; } else { this.craftAmount =  0; }
        if(json.grade)       { this.grade =       json.grade;       } else { this.grade =        0; }
        if(json.exp)         { this.exp =         json.exp;         } else { this.exp =          0; }
        if(json.time)        { this.time =        json.time;        } else { this.time =         0; }
        if(json.bonnus)      { this.bonnus =      json.bonnus;      } else { this.bonnus =       0; }
    }
    clone(item = new ItemData()){
        const ClonedItem = item;
        this.name = ClonedItem.name;
        this.exp = ClonedItem.exp;
        this.time = ClonedItem.time;
        return this;
    }
    AddAmount(amount = 0){this.amount += amount;}
    RemoveAmount(amount = 0){this.amount -= amount;}
    GetAmount(){return this.amount;}
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
class ItemList {
    items = [new ItemData()];
    constructor(){
        this.items = [
            new ItemData( { name: "Stone", group: "Miner",      
                craftAmount: 1, 
                exp: 1,
                time: 1000,
                meltReq: [],
                toolReq: { type: "Pickaxe", grade: 1 }
            }),
            new ItemData( { name: "Coal", group: "Miner", 
                craftAmount: 1, 
                exp: 1, 
                time: 2000
            }),
            new ItemData( { name: "Iron ore", group: "Miner", 
                craftAmount: 1, 
                exp: 1, 
                time: 3000
            }),
            new ItemData( { name: "Gold ore", group: "Miner", 
                craftAmount: 1, 
                exp: 1, 
                time: 3000
            }),
            new ItemData( { name: "Amatyst ore", group: "Miner", 
                craftAmount: 1, 
                exp: 1, 
                time: 3000
            }),
            new ItemData( { name: "Esmerald ore", group: "Miner", 
                craftAmount: 1, 
                exp: 1, 
                time: 3000
            }),
            new ItemData( { name: "Diamond ore",  group: "Miner", 
                craftAmount: 1, 
                exp: 1, 
                time: 3000
            }),
            
            new ItemData( { name: "Oak Wood", group: "Lumberjack",
                craftAmount: 1,
                time: 3000,
                exp: 1,
            }),
            /*
            new ItemData("Spruce Wood",     1, "Lumberjack", 1, 3000, [], "", 0),
            new ItemData("Jungle Wood",     1, "Lumberjack", 1, 3000, [], "", 0),

            new ItemData("Tuna",            1, "Fisherman",  1, 3000, [], "", 0),

            new ItemData("Iron bar",        1, "Melter",     1, 3000, [new Req(1, "Coal"), new Req(5, "Iron ore")], "", 0),
            new ItemData("Gold bar",        1, "Melter",     1, 3000, [new Req(1, "Coal"), new Req(5, "Gold ore")], "", 0),
            */
            new ItemData( { name: "Oak Planks", group: "Craftsman",
                craftAmount: 4, 
                exp: 1, 
                time: 1000, 
                meltReq: [
                    {amount: 1, name: "Oak Wood"}
                ]
            }),
            
            new ItemData( { name: "Wooden Pickaxe", group: "Craftsman", 
                craftAmount: 1, 
                exp: 1, 
                time: 3000,
                meltReq: [
                    { amount: 5, name: "Oak Planks" }
                ],
                type: "Pickaxe",
                grade: 1,
                bonnus: 5
            }),
            new ItemData( { name: "Stone Pickaxe", group: "Craftsman", 
                craftAmount: 1, 
                exp: 1, 
                time: 3000,
                meltReq: [
                    { amount: 2, name: "Oak Planks" }, 
                    { amount: 3, name: "Stone" }
                ], 
                type: "Pickaxe", 
                bonnus: 7
            }),
            new ItemData( { name: "Wooden Axe", group: "Craftsman", 
                craftAmount: 1, 
                exp: 1, 
                time: 3000,
                meltReq: [
                    {amount: 5, name: "Oak Planks"}
                ], 
                type: "Axe", 
                bonnus: 5 
            }),
            new ItemData( { name: "Stone Axe", group: "Craftsman",
                craftAmount: 1, 
                exp: 1, 
                time: 3000, 
                meltReq: [
                    {amount: 2, name: "Oak Planks"},
                    {amount: 3, name: "Stone"}
                ], 
                type: "Axe", 
                bonnus: 7
            })
        ]
    }
    GetItem(name = ""){
        for (let itemID = 0; itemID < this.items.length; itemID++) {
            const item = this.items[itemID];
            if (item.name.toLowerCase().replace(" ","") === name.toLowerCase().replace(" ","")) {
                return item;
            }
        }

    }
    GetItems(){
        return this.items;
    }
}
const Items = new ItemList();


// TOOL CLASSES
class ToolData {
    
    name = "";
    skill = "";
    item = new ItemData({});

    constructor(name, skill, item){
        this.name = name;
        this.skill = skill;
        this.item = item;
    }
    ToJSON() { return {i: this.item}; }
    FromJSON(json) { this.item = json["i"]; }
}
class ToolList {
    constructor(){
        this.tools = [
            new ToolData("Pickaxe", "Miner", new ItemData({})),
            new ToolData("Axe", "Lumberjack", new ItemData({})),
            new ToolData("Fishing Rod", "Fisherman", new ItemData({})),
            new ToolData("Furnance", "Melter", new ItemData({})),
            new ToolData("Table", "Craftsman", new ItemData({}))
        ]
    }
    GetTool(name = ""){
        for (var tool of this.tools) {
            if (tool.name.toLowerCase().replace(" ","") === name.toLowerCase().replace(" ","")) {
                return tool;
            }
        }
    }
    GetTools(){
        return this.tools;
    }
}
const Tools = new ToolList();


// ACTIVITY CLASSES
class ActivityData {
    id = 0;
    name = "";
    verb = "";

    constructor(id, name, verb){
        this.id = id;
        this.name = name;
        this.verb = verb;
    }
    clone(activity = new ActivityData()){
        const ClonedActivity = activity;
        this.id = ClonedActivity.id;
        this.name = ClonedActivity.name;
        this.verb = ClonedActivity.verb;
        return this;
    }
}
class ActivityList {
    constructor(){
        this.activities = [
            new ActivityData(0, "Miner", "Mine"),
            new ActivityData(1, "Lumberjack", "Cut"),
            new ActivityData(2, "Fisherman", "Fish"),
            new ActivityData(3, "Melter", "Melt"),
            new ActivityData(3, "Craftsman", "Make")

        ]
    }
    GetActivity(name = ""){
        for (var activity of this.activities) {
            if (activity.name.toLowerCase().replace(" ","") === name.toLowerCase().replace(" ","")) {
                return activity;
            }
        }
    }
    GetActivities(){
        return this.activities;
    }
}
const Activities = new ActivityList();


// SKILL CLASSES
class SkillData {
    id = 0;
    name = "";
    level = 0;
    exp = 0;
    expMax = 0;

    constructor(id, name, level, exp, expMax){
        this.id = id;
        this.name = name;
        this.level = level;
        this.exp = exp;
        this.expMax = expMax;
    }
    clone(skill = new SkillData()){
        const ClonedSkill = skill;
        this.id = ClonedSkill.id;
        this.name = ClonedSkill.name;
        this.exp = ClonedSkill.exp;
        this.expMax = ClonedSkill.expMax;
        return this;
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
class SkillList {
    constructor(){
        this.skills = [
            new SkillData(0, "Miner", 1,0,10),
            new SkillData(1, "Lumberjack", 1,0,10),
            new SkillData(1, "Fisherman", 1,0,10),
            new SkillData(1, "Melter", 1,0,10),
            new SkillData(1, "Craftsman", 1,0,10)
        ]
    }
    GetSkill(name = ""){
        for (var skill of this.skills) {
            if (skill.name.toLowerCase().replace(" ","") === name.toLowerCase().replace(" ","")) {
                return skill;
            }
        }
    }
    GetSkills(){
        return this.skills;
    }
}
const Skills = new SkillList();



// ON LOAD
/*
console.log(Attributes.GetAttributes())
console.log(Stats.GetStats())
console.log(Tools.GetTools())
console.log(Items.GetItems())
console.log(Activities.GetActivities())
console.log(Skills.GetSkills())
*/
LoadData();

ManagerStats(true);
ManagerAttributes(true);
ManagerTools(true);
ManagerInventory(true);
ManagerSkills(true);
ManagerActivities(true);


function ManagerAttributes(generate){
    if(generate){
        for(const attribute of Attributes.GetAttributes()){
            // Crea el párrafo
            const newElement = document.createElement('p');
            newElement.setAttribute('name', attribute.name);
            newElement.classList.add("attribute");
            newElement.innerHTML = `<span>+<span class="level">${attribute.level}</span> ${attribute.name}</span><button>+</button>`;
            newElement.getElementsByTagName("button")[0].addEventListener('click', () => UpgradeAttribute(attribute));

            AttributesElement.appendChild(newElement);
        }
        ManagerAttributes(false);
    }else{
        for (var element of AttributesElement.getElementsByTagName('p')){
            const name = element.getAttribute('name');
            element.getElementsByClassName("level")[0].textContent = Attributes.GetAttribute(name).level.toString();
        }
    }
}
function ManagerStats(generate){
    if(generate){
        for(const stat of Stats.GetStats()){
            // Crea el párrafo
            const newElement = document.createElement('p');
            newElement.setAttribute('name', stat.accron);
            newElement.classList.add("stat");
            newElement.innerHTML = `<span title='${stat.name}'>${stat.accron}</span><span class="value">${stat.value}</span>`;
            // Añade el nuevo párrafo al contenedor existente
            StatsElement.appendChild(newElement);
        }
        ManagerStats(false);
    }else{
        for (var element of StatsElement.getElementsByTagName('p')){
            const name = element.getAttribute('name');
            element.getElementsByClassName("value")[0].textContent = Stats.GetStat(name).GetValue().toLocaleString('es-ES');
        }
    }
}
function ManagerTools(generate){
    if(generate){
        for(const tool of Tools.GetTools()){
            var element = document.createElement('p');
            element.setAttribute('name', tool.name);
            element.innerHTML =  `<span class="name"></span><span>+<span class="amount">${tool.item.bonnus}</span>% ${tool.skill} Exp.</span><button>Unequip</button>`;
            element.getElementsByTagName("button")[0].addEventListener('click', () => EquipTool(new ItemData({type: tool.name})));
            ToolsElement.appendChild(element);
        }
        ManagerTools(false);
    }else{
        for (var element of ToolsElement.getElementsByTagName('p')){
            const name = element.getAttribute('name');
            element.getElementsByClassName("name")[0].textContent = Tools.GetTool(name).item.name;
            element.getElementsByClassName("amount")[0].textContent = Tools.GetTool(name).item.bonnus || 0;
            if(Tools.GetTool(name).item.name){
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
        for(const item of Items.GetItems()){
            if(
                item.type == "Pickaxe" ||
                item.type == "Axe"
            ){
                var element = document.createElement("p");
                element.setAttribute("name", item.name);
                element.style.display = "none";
                element.innerHTML += `<span>${item.name}</span><span class="amount">0</span><button>Equip</button>`;
                element.getElementsByTagName("button")[0].addEventListener('click', () => EquipTool(item) );
                InventoryElement.appendChild(element);
            }else{
                var element = document.createElement("p");
                element.setAttribute("name", item.name);
                element.style.display = "none";
                element.innerHTML += `<span>${item.name}</span><span class="amount">0</span>`;
                InventoryElement.appendChild(element);
            }
        }
        ManagerInventory(false);
    }else{
        for (var element of InventoryElement.getElementsByTagName('p')){
            const name = element.getAttribute('name');
            if(Items.GetItem(name).GetAmount() == 0){
                element.style.display = 'none';
            }else{
                element.style.display = '';
            }
            element.getElementsByClassName("amount")[0].textContent = formatNumberWithDots(Items.GetItem(name).GetAmount());
            for(const tool of Tools.GetTools()){
                if(Items.GetItem(name).type){
                    if(name === tool.item.name){
                        element.getElementsByTagName('button')[0].textContent = "UNEQUIP"
                    }else{
                        element.getElementsByTagName('button')[0].textContent = "EQUIP"
                    }
                }
            }
        }
    }
}
function ManagerSkills(generate){
    if(generate){
        for(const skill of Skills.GetSkills()){
            // Crea el párrafo
            const newElement = document.createElement('p');
            newElement.setAttribute('name', skill.name);
            newElement.classList.add("skill");
            newElement.innerHTML = `<span>${skill.name}</span><span>Lv. <span class="level">${skill.level}</span> Exp. <span class="exp">${skill.exp}</span>/<span class="expMax">${skill.expMax}</span></span>`;
            // Añade el nuevo párrafo al contenedor existente
            SkillsElement.appendChild(newElement);
        }
        ManagerSkills(false);
    }else{
        for (var element of SkillsElement.getElementsByTagName('p')){
            const name = element.getAttribute('name');
            element.getElementsByClassName("level")[0].textContent = Skills.GetSkill(name).level.toString();
            element.getElementsByClassName("exp")[0].textContent = Skills.GetSkill(name).exp.toString();
            element.getElementsByClassName("expMax")[0].textContent = Skills.GetSkill(name).expMax.toString();
        }
    }
}
function ManagerActivities(generate){
    if(generate){
        for (var activity of Activities.GetActivities()){
            ActivitiesElement.innerHTML += `<div name='${activity.name}' class="activities"><h3 class='title'>${activity.name}</h3></div>`;
        }
        for(const item of Items.GetItems()){
            for (let divID = 0; divID < ActivitiesElement.getElementsByTagName("div").length; divID++) {
                var element = ActivitiesElement.getElementsByTagName("div")[divID];
                var elementName = element.getAttribute("name").toString().toLowerCase()
                const itemGroup = item.group.toString().toLowerCase();
                const tool = (skill) => {
                    switch (skill) {
                        case "miner":      return "Pickaxe";
                        case "lumberjack": return "Axe";
                        case "fisherman":  return "Fishing Rod";
                        case "melter":     return "Furnance";
                        case "craftsman":  return "Table";
                        default: return "empty";
                    }
                }
                if(elementName === itemGroup){
                    // Crea el párrafo
                    const newElement = document.createElement('p');
                    newElement.setAttribute('name', item.name)
                    newElement.classList.add('activity');
    
                    // Crea el primer span
                    const spanName = document.createElement('span');
                    spanName.textContent = item.name;
                    newElement.appendChild(spanName);
    
                    // Crea el botón
                    const button = document.createElement('button');
                    button.textContent = Activities.GetActivity(itemGroup).verb;
    
                    // Añade el botón al párrafo
                    newElement.appendChild(button);
    
    
                    // Añade un event listener al párrafo para la acción de minar
                    newElement.addEventListener('click', () => ActivityEvent(item.name, tool(itemGroup)));
    
                    // Añade el nuevo párrafo al contenedor existente
                    element.appendChild(newElement);
    
                    break;
                }
    
            }
        }
        ManagerActivities(false);
    } else {
        for (var element of ActivitiesElement.getElementsByClassName("activity")){
            const name = element.getAttribute('name');
            const item = Items.GetItem(name);
            if(CheckMeltReqs(item, false) && CheckCraftReqs(item, false)){
                element.getElementsByTagName('button')[0].classList.add("enable");
                element.getElementsByTagName('button')[0].classList.remove("disable");
            }else{
                element.getElementsByTagName('button')[0].classList.remove("enable");
                element.getElementsByTagName('button')[0].classList.add("disable");
            }
            /*
            element.getElementsByClassName("level")[0].textContent = Skills.GetSkill(name).level.toString();
            element.getElementsByClassName("exp")[0].textContent = Skills.GetSkill(name).exp.toString();
            element.getElementsByClassName("expMax")[0].textContent = Skills.GetSkill(name).expMax.toString();
            */
        }
    }
    
}


function EquipTool(item = new ItemData()){

    if(Tools.GetTool(item.type).item === item){
        Tools.GetTool(item.type).item = new ItemData({type: item.type});
        for (const element of InventoryElement.getElementsByTagName('p')){
            if(element.getAttribute('name') === item.name){
                element.getElementsByTagName('button')[0].textContent = 'equip'
            }
        }
    }else{
        Tools.GetTool(item.type).item = item;
        for (const element of InventoryElement.getElementsByTagName('p')){
            if(element.getAttribute('name') === item.name){
                element.getElementsByTagName('button')[0].textContent = 'Unequip'
            }
        }
    }

    updateDisplay('Tools');
    updateDisplay('Activities');

}


function UpgradeAttribute(attribute = new AttributeData()){
    if (statPoints > 0 && attribute.level < 99) {
        attribute.level++;
        statPoints--;
        Stats.GetStat(attribute.stat).AddPoint();
        updateDisplay();
    }
}

function CheckMeltReqs(item = new ItemData({}), send){
    let allReqs = 0;
    if(item.meltReq){
        for (const req of item.meltReq) {
            if(Items.GetItem(req.name).GetAmount() >= req.amount){
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
                document.getElementById("dont-materials").style.display = '';

                document.getElementById("dont-materials").appendChild(element);
                while(document.getElementById("dont-materials").childElementCount > 5) {
                    document.getElementById("dont-materials").getElementsByClassName("material")[0].remove();
                }
            }
        }
    }
    if(allReqs != item.meltReq.length){
        activityInProgress = false;
        return false;
    }
    return true;
}
function CheckCraftReqs(item = new ItemData({}), send){
    if(!item.toolReq.type){
        return true;
    }else{        
        var currentTool = Tools.GetTool(item.toolReq.type).item;
        if(currentTool){
            if(currentTool.grade >= item.toolReq.grade){
                return true;
            }
            return false;
        }
        return false;
    }
}
function ActivityEvent(resource, tool = "") {
    const item = Items.GetItem(resource);
    if(CheckMeltReqs(item, true) && CheckCraftReqs(item, true)){
        var time = item.time;
        console.log(Tools.GetTool(tool))
        time *= 1 - (Tools.GetTool(tool).item.bonnus || 0)/100;
        time = time <= 0 ? 1: time;

        startProgressBar(item,time);

        //SendPush("Actividad finalizada","Mundo", time);

        setTimeout(() => {
            item.AddAmount(item.craftAmount);
            Skills.GetSkill(item.group).AddExperience(item.exp);

            for (const req of item.meltReq) {
                Items.GetItem(req.name).RemoveAmount(req.amount);
            }

            updateDisplay('Skills');
            updateDisplay('Inventory');
            updateDisplay('Activities');

        }, time);
    }

}


function GetJSON() {
    var json = {};

    json["Inventory"] = {};
    for (var item of Items.GetItems()) {
        json["Inventory"][item.name.toLowerCase()] = item.ToJSON();
    }

    json["Skills"] = {};
    for (var skill of Skills.GetSkills()) {
        json["Skills"][skill.name.toLowerCase()] = skill.ToJSON();
    }

    json["Tools"] = {};
    for (var tool of Tools.GetTools()) {
        json["Tools"][skill.name.toLowerCase()] = tool.ToJSON();
    }


    return JSON.stringify(json);
}
function SaveData(){
    localStorage.setItem("db", GetJSON());
}
function LoadData(){

    if(localStorage.getItem("db")){

        const json = JSON.parse(localStorage.getItem("db"));

        for (var item of Items.GetItems()){
            if(json["Inventory"][item.name.toLowerCase()]){
                item.FromJSON(json["Inventory"][item.name.toLowerCase()])
            }
        }
        if(json["Skills"]){
            for (var skill of Skills.GetSkills()){
                if(json["Skills"][skill.name.toLowerCase()]){
                    skill.FromJSON(json["Skills"][skill.name.toLowerCase()])
                }
            }
        }
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
const hpDisplay = document.getElementById('hp');

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

function updateDisplay(display) {
    console.log(`Call: Update ${display}`)
    Money_Display.textContent = AmountFormat(gold);
    expDisplay.textContent = experience;
    expMaxDisplay.textContent = experienceMax;
    levelDisplay.textContent = level;
    
    if( display == null || display == "All" || display == "" ) ManagerAttributes(false);
    if( display == null || display == "All" || display == "" ) ManagerStats(false);
    if( display == null || display == "All" || display == "Tools" )      ManagerTools(false);
    if( display == null || display == "All" || display == "Inventory" )  ManagerInventory(false);
    if( display == null || display == "All" || display == "Skills" )     ManagerSkills(false);
    if( display == null || display == "All" || display == "Activities" ) ManagerActivities(false);

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

function startProgressBar(item = new ItemData(), duration = 0) {
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