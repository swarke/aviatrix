import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AWSComponent } from './aws/aws.component';
import { AzureComponent } from './azure/azure.component';

const AppRoutes: Routes = [
	{ path: '', component: LandingComponent },
	{ path: 'aws/speedtest', component: AWSComponent },
	{ path: 'azure/speedtest', component: AzureComponent},
];
export const appRoutingProviders: any[] = [];
export const AppRoutingModule = RouterModule.forRoot(AppRoutes);
