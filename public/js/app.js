"use strict";

Chart.defaults.global.defaultFontSize = 10;
Chart.defaults.global.animation.duration = 500;
Chart.defaults.global.legend.display = false;
Chart.defaults.global.elements.line.backgroundColor = "rgba(0,0,0,0)";
Chart.defaults.global.elements.line.borderColor = "rgba(1,1,1,1)";
Chart.defaults.global.elements.line.borderWidth = 1;
Chart.defaults.global.elements.point.radius = 3;

const $status = document.getElementById("status");
const $transport = document.getElementById("transport");
const statuscol = document.querySelector("#statuscol");
const wsconnect = document.querySelector("#wsconnect");
const dataStatus = document.querySelector("#datastatus");
const wslohout = document.querySelector("#logout");
const wsstatus = document.querySelector("#wsstatus");
const wsstats = document.querySelector("#wsstats");

wsconnect.onclick = () => {
    Websockets();
};

const Websockets = () => {
    const socket = io({
        path: "/ws",
        transports: ["websocket", "polling", "webtransport"],
        cors: { origin: "*", credentials: true },
    });

    socket.on("connect", () => {
        const transport = socket.io.engine.transport.name;
        socket.io.engine.on("upgrade", () => {
            const upgradedTransport = socket.io.engine.transport.name;
            if (transport !== upgradedTransport) {
                console.log(`Socket upgraded from ${transport} to ${upgradedTransport}`);
            }
            console.log("Socket upgraded");
        });
        console.log("Socket connected: " + socket.id);
        $status.innerText = "Connected";
        $transport.innerText = socket.io.engine.transport.name;
        statuscol.classList.add("online");
        statuscol.classList.remove("offline");

        wsstatus.onclick = () => {
            socket.emit("esm_on");
        };
        wsstats.onclick = () => {
            const nodeData = [
                {
                    ip: "true.bigbrain-studio.com",
                    int: 5,
                },
                {
                    ip: "ais.bigbrain-studio.com",
                    int: 5,
                },
                {
                    ip: "1.0.0.1",
                    int: 5,
                },
                {
                    ip: "1.1.1.1",
                    int: 5,
                },
                {
                    ip: "dns.google",
                    int: 5,
                },
            ];
            socket.emit("status", nodeData);
        };
    });

    socket.on("disconnect", (reason) => {
        console.log(`disconnect due to ${reason}`);
        $status.innerText = "Disconnected";
        $transport.innerText = "N/A";
        statuscol.classList.add("offline");
        statuscol.classList.remove("online");
    });

    wslohout.onclick = () => {
        socket.close();
    };

    let defaultSpan = 0;
    let spans = [];
    let statusCodesColors = ["#75D701", "#47b8e0", "#ffc952", "#E53A40"];

    let defaultDataset = {
        label: "",
        data: [],
        lineTension: 0.2,
        pointRadius: 0,
    };

    let defaultOptions = {
        scales: {
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true,
                    },
                },
            ],
            xAxes: [
                {
                    type: "time",
                    time: {
                        unitStepSize: 30,
                    },
                    gridLines: {
                        display: false,
                    },
                },
            ],
        },
        tooltips: {
            enabled: true,
        },
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
    };

    let createChart = function (ctx, dataset) {
        return new Chart(ctx, {
            type: "line",
            data: {
                labels: [],
                datasets: dataset,
            },
            options: defaultOptions,
        });
    };

    let addTimestamp = function (point) {
        return point.timestamp;
    };

    let cpuDataset = [Object.create(defaultDataset)];
    let memDataset = [Object.create(defaultDataset)];
    let loadDataset = [Object.create(defaultDataset)];
    let heapDataset = [Object.create(defaultDataset)];
    let eventLoopDataset = [Object.create(defaultDataset)];
    let responseTimeDataset = [Object.create(defaultDataset)];
    let rpsDataset = [Object.create(defaultDataset)];

    let cpuStat = document.getElementById("cpuStat");
    let memStat = document.getElementById("memStat");
    let loadStat = document.getElementById("loadStat");
    let heapStat = document.getElementById("heapStat");
    let eventLoopStat = document.getElementById("eventLoopStat");
    let responseTimeStat = document.getElementById("responseTimeStat");
    let rpsStat = document.getElementById("rpsStat");

    let cpuChartCtx = document.getElementById("cpuChart");
    let memChartCtx = document.getElementById("memChart");
    let loadChartCtx = document.getElementById("loadChart");
    let heapChartCtx = document.getElementById("heapChart");
    let eventLoopChartCtx = document.getElementById("eventLoopChart");
    let responseTimeChartCtx = document.getElementById("responseTimeChart");
    let rpsChartCtx = document.getElementById("rpsChart");
    let statusCodesChartCtx = document.getElementById("statusCodesChart");

    let cpuChart = createChart(cpuChartCtx, cpuDataset);
    let memChart = createChart(memChartCtx, memDataset);
    let heapChart = createChart(heapChartCtx, heapDataset);
    let eventLoopChart = createChart(eventLoopChartCtx, eventLoopDataset);
    let loadChart = createChart(loadChartCtx, loadDataset);
    let responseTimeChart = createChart(responseTimeChartCtx, responseTimeDataset);
    let rpsChart = createChart(rpsChartCtx, rpsDataset);
    let statusCodesChart = new Chart(statusCodesChartCtx, {
        type: "line",
        data: {
            labels: [],
            datasets: [
                Object.create(defaultDataset),
                Object.create(defaultDataset),
                Object.create(defaultDataset),
                Object.create(defaultDataset),
            ],
        },
        options: defaultOptions,
    });

    statusCodesChart.data.datasets.forEach(function (dataset, index) {
        dataset.borderColor = statusCodesColors[index];
    });

    let charts = [
        cpuChart,
        memChart,
        loadChart,
        responseTimeChart,
        rpsChart,
        statusCodesChart,
        heapChart,
        eventLoopChart,
    ];

    let onSpanChange = async function (e) {
        e.target.classList.add("active");
        defaultSpan = parseInt(e.target.id, 10);

        let otherSpans = document.getElementsByTagName("span");

        for (let i = 0; i < otherSpans.length; i++) {
            if (otherSpans[i] !== e.target) otherSpans[i].classList.remove("active");
        }

        await socket.emit("esm_change");
    };

    socket.on("esm_start", async function (data) {
        // Remove last element of Array because it contains malformed responses data.
        // To keep consistency we also remove os data.
        data[defaultSpan].responses.pop();
        data[defaultSpan].os.pop();
        // console.log("start", data);

        let lastOsMetric = data[defaultSpan].os[data[defaultSpan].os.length - 1];

        cpuStat.textContent = "0.0%";
        if (lastOsMetric) {
            cpuStat.textContent = lastOsMetric.cpu.toFixed(1) + "%";
        }

        cpuChart.data.datasets[0].data = data[defaultSpan].os.map(function (point) {
            return point.cpu;
        });
        cpuChart.data.labels = data[defaultSpan].os.map(addTimestamp);

        memStat.textContent = "0.0MB";
        if (lastOsMetric) {
            memStat.textContent = lastOsMetric.memory.toFixed(1) + "MB";
        }

        memChart.data.datasets[0].data = data[defaultSpan].os.map(function (point) {
            return point.memory;
        });
        memChart.data.labels = data[defaultSpan].os.map(addTimestamp);

        loadStat.textContent = "0.00";
        if (lastOsMetric) {
            loadStat.textContent = lastOsMetric.load[defaultSpan].toFixed(2);
        }

        loadChart.data.datasets[0].data = data[defaultSpan].os.map(function (point) {
            return point.load[0];
        });
        loadChart.data.labels = data[defaultSpan].os.map(addTimestamp);

        heapChart.data.datasets[0].data = data[defaultSpan].os.map(function (point) {
            return point.heap.used_heap_size / 1024 / 1024;
        });
        heapChart.data.labels = data[defaultSpan].os.map(addTimestamp);

        eventLoopChart.data.datasets[0].data = data[defaultSpan].os.map(function (point) {
            if (point.loop) {
                return point.loop.sum;
            }
            return 0;
        });
        eventLoopChart.data.labels = data[defaultSpan].os.map(addTimestamp);

        let lastResponseMetric =
            data[defaultSpan].responses[data[defaultSpan].responses.length - 1];

        responseTimeStat.textContent = "0.00ms";
        if (lastResponseMetric) {
            responseTimeStat.textContent = lastResponseMetric.mean;
        }

        responseTimeChart.data.datasets[0].data = data[defaultSpan].responses.map(function (point) {
            return point.mean;
        });
        responseTimeChart.data.labels = data[defaultSpan].responses.map(addTimestamp);

        for (let i = 0; i < 4; i++) {
            statusCodesChart.data.datasets[i].data = data[defaultSpan].responses.map(function (
                point
            ) {
                return point[i + 2];
            });
        }
        statusCodesChart.data.labels = data[defaultSpan].responses.map(addTimestamp);

        if (data[defaultSpan].responses.length >= 2) {
            let deltaTime =
                lastResponseMetric.timestamp -
                data[defaultSpan].responses[data[defaultSpan].responses.length - 2].timestamp;

            if (deltaTime < 1) deltaTime = 1000;
            rpsStat.textContent = ((lastResponseMetric.count / deltaTime) * 1000).toFixed(2);
            rpsChart.data.datasets[0].data = data[defaultSpan].responses.map(function (point) {
                return (point.count / deltaTime) * 1000;
            });
            rpsChart.data.labels = data[defaultSpan].responses.map(addTimestamp);
        }

        charts.forEach(function (chart) {
            chart.update();
        });

        let spanControls = document.getElementById("span-controls");

        if (data.length !== spans.length) {
            await data.forEach(function (span, index) {
                spans.push({
                    retention: span.retention,
                    interval: span.interval,
                });

                let spanNode = document.createElement("span");
                let textNode = document.createTextNode((span.retention * span.interval) / 60 + "M");

                spanNode.appendChild(textNode);
                spanNode.setAttribute("id", index);
                spanNode.onclick = onSpanChange;
                spanControls.appendChild(spanNode);
            });
            document.getElementsByTagName("span")[0].classList.add("active");
        }
    });

    socket.on("nodeStatus", (data) => {
        if (data.retention === 60 && data.interval === 1) {
            let nodeData = document.getElementById(`node-${data.id}`);
            nodeData.textContent =
                data.data.host &&
                data.data.host + " " + data.data.numeric_host + " " + data.data.time + "ms";
        }
    });

    socket.on("esm_stats", async function (data) {
        if (
            data.retention === spans[defaultSpan].retention &&
            data.interval === spans[defaultSpan].interval
        ) {
            let os = data.os;
            let responses = data.responses;

            cpuStat.textContent = "0.0%";
            if (os) {
                cpuStat.textContent = os.cpu.toFixed(1) + "%";
                cpuChart.data.datasets[0].data.push(os.cpu);
                cpuChart.data.labels.push(os.timestamp);
            }

            memStat.textContent = "0.0MB";
            if (os) {
                memStat.textContent = os.memory.toFixed(1) + "MB";
                memChart.data.datasets[0].data.push(os.memory);
                memChart.data.labels.push(os.timestamp);
            }

            loadStat.textContent = "0";
            if (os) {
                loadStat.textContent = os.load[0].toFixed(2);
                loadChart.data.datasets[0].data.push(os.load[0]);
                loadChart.data.labels.push(os.timestamp);
            }

            heapStat.textContent = "0";
            if (os) {
                heapStat.textContent = (os.heap.used_heap_size / 1024 / 1024).toFixed(1) + "MB";
                heapChart.data.datasets[0].data.push(os.heap.used_heap_size / 1024 / 1024);
                heapChart.data.labels.push(os.timestamp);
            }

            eventLoopStat.textContent = "0";
            if (os && os.loop) {
                eventLoopStat.textContent = os.loop.sum.toFixed(2) + "ms";
                eventLoopChart.data.datasets[0].data.push(os.loop.sum);
                eventLoopChart.data.labels.push(os.timestamp);
            }

            responseTimeStat.textContent = "0.00ms";
            if (responses) {
                responseTimeStat.textContent = responses.mean.toFixed(2) + "ms";
                responseTimeChart.data.datasets[0].data.push(responses.mean);
                responseTimeChart.data.labels.push(responses.timestamp);
            }

            if (responses) {
                let deltaTime =
                    responses.timestamp - rpsChart.data.labels[rpsChart.data.labels.length - 1];

                if (deltaTime < 1) deltaTime = 1000;
                rpsStat.textContent = ((responses.count / deltaTime) * 1000).toFixed(2);
                rpsChart.data.datasets[0].data.push((responses.count / deltaTime) * 1000);
                rpsChart.data.labels.push(responses.timestamp);
            }

            if (responses) {
                for (let i = 0; i < 4; i++) {
                    statusCodesChart.data.datasets[i].data.push(data.responses[i + 2]);
                }
                statusCodesChart.data.labels.push(data.responses.timestamp);
            }

            charts.forEach(function (chart) {
                if (spans[defaultSpan].retention < chart.data.labels.length) {
                    chart.data.datasets.forEach(function (dataset) {
                        dataset.data.shift();
                    });

                    chart.data.labels.shift();
                }
                chart.update();
            });
        }
    });
};
