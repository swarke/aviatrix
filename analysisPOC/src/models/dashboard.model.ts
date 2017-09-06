/*
 * Model to handle network data
 */

export class DashboardModel {

	bandwidth: any;
	latency: any;
	responseTime: any;
	packetLoss: any;
	throughput: any;
	latencyChartData: any;
	headerLatency: any;
	headerBandwidth: any;
	pingLatency: any;
	pingBandwidth:any;
	dynamodbLatency:any;
	systemPingLatency:any;

	constructor() {
		this.bandwidth = [];
		this.latency = [];
		this.responseTime = [];
		this.packetLoss = [];
		this.throughput = [];
		this.latencyChartData = [];
		this.headerLatency = [];
		this.headerBandwidth = [];
		this.pingLatency = [];
		this.pingBandwidth = [];
		this.dynamodbLatency = [];
		this.systemPingLatency = [];
	}

	clerModel() {
		this.bandwidth = [];
		this.latency = [];
		this.responseTime = [];
		this.packetLoss = [];
		this.throughput = [];
		this.latencyChartData = [];
		this.headerLatency = [];
		this.headerBandwidth = [];
		this.pingLatency = [];
		this.pingBandwidth = [];
		this.dynamodbLatency = [];
		this.systemPingLatency = [];
	}
}
