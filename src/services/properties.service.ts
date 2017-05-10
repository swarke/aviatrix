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

  public LEFT_PANEL_AWS_REGION: string  = 'AWS REGIONS';
  public LEFT_PANEL_AZURE_REGION: string  = 'AZURE REGIONS';
  public LEFT_PANEL_GCE_REGION: string  = 'GCE REGIONS';

  // Dashboard
  public RIGHT_PANEL_HEADER: string = 'SITE TO CLOUD NETWORK CONNECTIVITY';
  public RIGHT_PANEL_REGION_COLUMN_HEADER = 'Region';
  public RIGHT_PANEL_LATENCY_COLUMN_HEADER = 'Latency';
  public RIGHT_PANEL_THROUGHPUT_COLUMN_HEADER = 'Throughput';

  public LATENCY_CHART_HEADER: string = 'LATENCY';
  public THROUGHPUT_CHART_HEADER: string = 'THROUGHPUT';

  public LATENCY_CHART_DATA_NOT_AVAILABLE = 'Latency data is not available.';
  public THROUGHPUT_CHART_DATA_NOT_AVAILABLE = 'Throughput data is not available.';

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

  constructor() {
  }
}