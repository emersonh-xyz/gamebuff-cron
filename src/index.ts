import Bree from 'bree';
import { resolve } from 'path';

const bree = new Bree({

    root: resolve("./src/jobs"),

    defaultExtension: 'ts',

    jobs: [{
        name: 'refresh-matches',
        interval: 'every 3 minutes',

    }]
});


(async () => {
    try {
        await bree.start();
    } catch (e) {
        console.log(e);
    }

})();