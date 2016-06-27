'use strict';

importScripts('lib/sww.js/dist/sww.js');

var worker = new self.ServiceWorkerWare();

worker.use(new self.SimpleOfflineCache());

worker.init();
