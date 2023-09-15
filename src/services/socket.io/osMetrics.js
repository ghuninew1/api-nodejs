const pidusage = require("pidusage");
const os = require("os");
const v8 = require("v8");
const eventLoopStats = require("event-loop-stats"); 
const sendMetrics = require("./sendMetrics");

module.exports = (io, span) => {
    const starttime = process.hrtime();
    const defaultResponse = {
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        count: 0,
        mean: 0,
        timestamp: Date.now(),
    };

    pidusage(process.pid, (err, stat) => {
        if (err) {
            console.log(err);
            return;
        }

        const last = span.responses[span.responses.length - 1];

        // Convert from B to MB
        stat.memory = stat.memory / 1024 / 1024;
        stat.load = os.loadavg();
        stat.timestamp = Date.now();
        stat.heap = v8.getHeapStatistics();

        if (eventLoopStats) {
            stat.loop = eventLoopStats.sense();
        }

        span.os.push(stat);
        if (!span.responses[0] || (last.timestamp + span.interval) * 1000 < Date.now()) {
            span.responses.push(defaultResponse);
        } else {
            last.count++;
            last.mean = last.mean + (stat.cpu - last.mean) / last.count;
            last[stat.cpu.toString()[0]]++;
        }

        const diff = process.hrtime(starttime);
        const responseTime = (diff[0] * 1e3 + diff[1]) * 1e-6;
        span.responses.push(responseTime);

        // todo: I think this check should be moved somewhere else
        if (span.os.length >= span.retention) span.os.shift();
        if (span.responses[0] && span.responses.length > span.retention) span.responses.shift();

        sendMetrics(io, span);
    });
};
