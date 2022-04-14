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

const storageKit = storage({
    Utils:utils
});

const scope = require('./scripts/scope')({
    StorageKit:storageKit,
});

const attributes = require('./scripts/attributes')({
    StorageKit:storageKit,
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
        StorageKit:storageKit,
    }),
    StorageKit:storageKit,
    Observer:observer(),
    Formy:form,
    Utils:utils,
});

window.Cake = cake;



