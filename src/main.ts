import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component'; // Asegúrate de importar AppComponent

bootstrapApplication(AppComponent)
  .catch(err => console.error(err));
