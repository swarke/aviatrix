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

	constructor() {
		this.bandwidth = [];
		this.latency = [];
		this.responseTime = [];
		this.packetLoss = [];
		this.throughput = [];
		this.latencyChartData = [];
	}

	clerModel() {
		this.bandwidth = [];
		this.latency = [];
		this.responseTime = [];
		this.packetLoss = [];
		this.throughput = [];
		this.latencyChartData = [];
	}
}
