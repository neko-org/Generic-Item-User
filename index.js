module.exports = function GenericItemUser(mod){
    const config = require("./config.js");
    let enabled = true;
    const useItem = (enable, id, delay) => {
        if (!enable) return;
        setTimeout(()=>{
            mod.send('C_USE_ITEM', 3, {
                gameId: mod.game.me.gameId,
                id: id,
                amount: 1,
                unk4: true
            });
        }, delay);
    }
    const sEachSkillResult = (e) => {
        if(!enabled || !(mod.game.me.is(e.owner) || mod.game.me.is(e.source))) return;
        if(!!config[e.skill.id]){
            config[e.skill.id].forEach( item => {
                useItem(item.enable, item.id, item.delay);
            });
        }
    }
    mod.command.add("giu", {
        $none(){
            enabled = !enabled;
            mod.command.message(`Generic Item User has been ${ enabled ? "enabled" : "disabled"}`);
        },
        reload(){
            delete require.cache[require.resolve("./config.js")];
            Object.assign(config, require("./config.js"));
            mod.command.message("Configuration file has been reloaded");
        }
    });
    mod.hook("S_EACH_SKILL_RESULT", 12, { filter: { fake: null }}, sEachSkillResult);
}