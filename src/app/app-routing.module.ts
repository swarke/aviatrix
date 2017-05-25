import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AWSComponent } from './aws/aws.component';
import { AzureComponent } from './azure/azure.component';

const AppRoutes: Routes = [
	{ path: 'aws/speedtest', component: AWSComponent },
	{ path: 'azure/speedtest', component: AzureComponent},
	{ path: '**', redirectTo: 'aws/speedtest', pathMatch: 'full' }
];
export const appRoutingProviders: any[] = [];
export const AppRoutingModule = RouterModule.forRoot(AppRoutes, { useHash: true });
