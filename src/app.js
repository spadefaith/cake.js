const env = require('./scripts/env');
const extensions = require('./scripts/extends');
const polyfill = require('./scripts/polyfill');
const utils = require('./scripts/utils');
const templateExtend = require('./scripts/template-extend');

const storage = require('./scripts/storage');
const piece = require('./scripts/piece');
const observer = require('./scripts/observer');
const templating = require('./scripts/templating');
const animate = require('./scripts/animate');
const persist = require('./scripts/persist');
const hash = require('./scripts/hash');
const router = require('./scripts/router');
const form = require('./scripts/form');

const scope = require('./scripts/scope')({
    StorageKit:storage(),
});

const attributes = require('./scripts/attributes')({
    StorageKit:storage(),
    Templating:templating(),
    Utils:utils,
});

const component = require('./scripts/component')({
    Utils:utils,
    Mo:animate,
    Templating:templating(),
    Piece: piece(),
    pushState:router.pushState,
});



const cake = require('./scripts/cake')({
    Attrib:attributes,
    Scope:scope,
    Component:component,
    Hasher:hash,
    Router:router,
    Persistent:persist({
        StorageKit:storage(),
    }),
    StorageKit:storage(),
    Observer:observer(),
    Formy:form,
});

window.Cake = cake;



