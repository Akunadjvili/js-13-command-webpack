const handlebars = require("handlebars/runtime");

handlebars.registerHelper('repeat', function name(n, block) {
    let acc = '';
    for (let i = 1; i <= n; i += 1) {
        acc += block.fn(i);
    }
    return acc;
});
module.exports = handlebars;
