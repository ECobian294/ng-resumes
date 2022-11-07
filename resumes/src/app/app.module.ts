import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { HeaderComponent } from './header/header.component';
import { AppRouting } from './app.routing';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { ToolsComponent } from './tools/tools.component';
import { ProjectsComponent } from './projects/projects.component';

import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from '../environments/environment';
@NgModule({
  declarations: [
    AppComponent,
    AuthenticationComponent,
    HeaderComponent,
    HomeComponent,
    ToolsComponent,
    ProjectsComponent
  ],
  imports: [
    AppRouting,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig, 'ng-resume'),
    AngularFireAuthModule,
    AngularFirestoreModule
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
