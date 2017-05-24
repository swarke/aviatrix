import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AWSComponent } from './aws/aws.component';
import { AzureComponent } from './azure/azure.component';
import { Azure1Component } from './azure/azure1.component';

const AppRoutes: Routes = [
	{ path: 'aws/speedtest', component: AWSComponent },
	{ path: 'azure/speedtest', component: AzureComponent},
	{ path: 'azure1', component: Azure1Component}
];
export const appRoutingProviders: any[] = [];
export const AppRoutingModule = RouterModule.forRoot(AppRoutes, { useHash: true });
