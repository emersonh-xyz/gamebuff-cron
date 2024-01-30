import Bree from 'bree';
import { resolve } from 'path';

const bree = new Bree({

    root: resolve("./src/jobs"),

    defaultExtension: 'ts',

    jobs: [{
        name: 'refresh-matches',
        interval: 'every 30 seconds',
    }]
});


(async () => {
    try {
        await bree.start();
    } catch (e) {
        console.log(e);
    }

})();