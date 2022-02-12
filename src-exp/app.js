const env = require('./scripts/env');
const polyfill = require('./scripts/polyfill');
const utils = require('./scripts/utils');
const extensions = require('./scripts/extends');
const templateExtend = require('./scripts/template-extend');

const storage = require('./scripts/storage');
const piece = require('./scripts/piece');
const observer = require('./scripts/observer');
const templating = require('./scripts/templating');
const animate = require('./scripts/animate');
const scope = require('./scripts/scope');
const persist = require('./scripts/persist');
const hash = require('./scripts/hash');
const form = require('./scripts/form');

const attributes = require('./scripts/attributes')({
    StorageKit:storage(),
    Templating:templating(),
});

const component = require('./scripts/component')({
    Mo:animate,
    Templating:templating(),
    Piece: piece(),
});



const cake = require('./scripts/cake')({
    Attrib:attributes,
    Scope:scope(),
    Component:component,
    Hasher:hash,
    Persistent:persist({
        StorageKit:storage(),
    }),
    StorageKit:storage(),
    Observer:observer(),
    Formy:form,
});

window.Cake = cake;



