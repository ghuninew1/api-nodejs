const ping = require("ping");
const sendMetrics = require("./sendMetricsPing");

module.exports = async (socket, span, idx) => {
    const starttime = process.hrtime();
    const last = span.responses[span.responses.length - 1];

    const diff = process.hrtime(starttime);
    const responseTime = (diff[0] * 1e3 + diff[1]) * 1e-6;

    if (last !== undefined && last.timestamp / 1000 + span.interval > Date.now() / 1000) {
        last.count += 1;
        last.mean += (responseTime - last.mean) / last.count;
        // console.log("last", last);
    } else {
        span.responses.push({
            count: 1,
            mean: responseTime,
            timestamp: Date.now(),
        });
        // console.log("span", span);
    }

    const pings = await ping.promise.probe(span.ip, {
        timeout: 10,
        extra: ["-i", "2"],
    });

    span.data = pings;
    span.id = idx;
    // if (span.data.length >= span.length) span.data.shift();
    // todo: I think this check should be moved somewhere else
    if (span.responses[0] && span.responses.length > span.retention) span.responses.shift();

    // console.log("spanip", span.data);

    sendMetrics(socket, span);
};
