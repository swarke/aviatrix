import { Injectable, Inject } from '@angular/core';


@Injectable()
/**
 * @brief      Class for activities service.
 */
export class PropertiesService {

  // Header
  public AWS_TOOL_NAME: string = 'AWS Latency & Throughput Analyzer';
  public AZURE_TOOL_NAME: string = 'AZURE Latency & Throughput Analyzer';
  public GCE_TOOL_NAME: string = 'GCE Latency & Throughput Analyzer';
  public LINK_FEEDBACK: string = 'Feedback';

  public DOWNLOAD_AVIATRIX: string = 'Download Aviatrix!';

  public LEFT_PANEL_AWS_REGION: string  = 'AWS REGIONS';
  public LEFT_PANEL_AZURE_REGION: string  = 'AZURE REGIONS';
  public LEFT_PANEL_GCE_REGION: string  = 'GCE REGIONS';

  // Dashboard
  public RIGHT_PANEL_HEADER: string = 'Network Connectivity to Cloud';
  public RIGHT_PANEL_REGION_COLUMN_HEADER = 'Region';
  public RIGHT_PANEL_LATENCY_COLUMN_HEADER = 'Latency(msec)';
  public RIGHT_PANEL_THROUGHPUT_COLUMN_HEADER = 'Throughput(mbps)';

  public LATENCY_CHART_HEADER: string = 'LATENCY';
  public THROUGHPUT_CHART_HEADER: string = 'THROUGHPUT';

  public LATENCY_CHART_DATA_NOT_AVAILABLE = 'Latency data is not available.';
  public THROUGHPUT_CHART_DATA_NOT_AVAILABLE = 'Throughput data is not available.';

  public CLICK_START_TO_RUN: string = 'Click Start to run.';

  public NA_TEXT: string = 'NA';
  public MS:string = 'ms';
  public MILISECONDS = 'miliseconds';
  public MBPS: string = 'mbps';

  public START: string = 'Start';
  public STOP: string = 'Stop';

  public NA_LATITUDE: number = 46.0730555556;
  public NA_LONGITUDE: number = -100.546666667;

  public BANDWIDTH_IMG: string = 'clouds-01.jpeg';
  public RESPONSE_TIME_HTML: string = 'test.html';

  public AWS_CLOUD_PIN_PATH = '/assets/aws_pin.png';
  public GCE_CLOUD_PIN_PATH = '/assets/aws_pin.png';
  public AZURE_CLOUD_PIN_PATH = '/assets/aws_pin.png';

  public AWS_PAGE_TITLE = 'Aviatrix - AWS Throughput and Latency Analyzer';
  public AZURE_PAGE_TITLE = 'Aviatrix - AZURE Throughput and Latency Analyzer';
  public GCE_PAGE_TITLE = 'Aviatrix - GCE Throughput and Latency Analyzer';

  public RIGHT_PANEL_TOOLTIP: string = "Aviatrix tool measures network connectivity data from your browser to cloud regions. Use this data to confidently plan cloud deployments.";
  public LATENCY_CHART_TOOLTIP: string = "Measures latency from the browser to cloud regions. Use latency to determine deployment of latency sensitive applications.";
  public THROUGHPUT_PANEL_TOOLTIP: string = "Measures throughput from the browser to cloud regions. Use throughput data for data intensive applications.";


  constructor() {
  }
}