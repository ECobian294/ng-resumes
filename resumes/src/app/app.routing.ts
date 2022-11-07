import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthenticationComponent } from "./authentication/authentication.component";
import { AuthGuard } from "./guards/auth.guard";
import { HomeComponent } from "./home/home.component";
import { ProjectsComponent } from "./projects/projects.component";
import { ToolsComponent } from "./tools/tools.component";

const appRoutes: Routes = [
    { path: 'login', component: AuthenticationComponent },
    { path: 'register', component: AuthenticationComponent },
    { path: 'home', canActivate: [AuthGuard], component: HomeComponent },
    { path: 'tools', canActivate: [AuthGuard], component: ToolsComponent },
    { path: 'projects', canActivate: [AuthGuard], component: ProjectsComponent },
];

@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forRoot(appRoutes)],
})
export class AppRouting {

}