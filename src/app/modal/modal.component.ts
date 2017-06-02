import { Component, ViewEncapsulation } from '@angular/core';
import { DashboardService, PropertiesService } from '../../services';
import { DashboardModel} from '../../models';
import { MdDialog, MdDialogRef, MdDialogConfig } from '@angular/material';

@Component({
  selector: 'app-modal',
  styleUrls:  ['./modal.scss?v=${new Date().getTime()}'],
  templateUrl: './modal.html?v=${new Date().getTime()}',
  viewProviders: [DashboardService],
  encapsulation:  ViewEncapsulation.None,
})

export class ModalComponent {
  bestLatencyRegion: any;
  bestBandwidthRegion: any;
 constructor(public dialogRef: MdDialogRef<ModalComponent>) {
  }
}