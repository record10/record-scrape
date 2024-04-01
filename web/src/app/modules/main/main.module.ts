import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';
import { SettingComponent } from './components/setting/setting.component';
import { MainComponent } from './main.component';

@NgModule({
  declarations: [
    LoginComponent,
    LandingComponent,
    SettingComponent,
    MainComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule, 
    MatDialogModule,
    RouterModule.forRoot(routes)
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  bootstrap: [MainComponent],
  providers: [
    provideAnimationsAsync()
  ]
})
export class MainModule { }
