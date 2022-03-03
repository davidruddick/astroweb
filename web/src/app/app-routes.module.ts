import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AboutComponent } from "./about/about/about.component";
import { VettingContainerComponent } from "./vetting/vetting-container/vetting-container.component";

const appRoutes: Routes = [
  {path: '', component: VettingContainerComponent},
  {path: 'about', component: AboutComponent},
  {path: '**', redirectTo: ''}
]

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)]
})

export class AppRoutes{}
