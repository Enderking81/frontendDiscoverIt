import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ToastComponent } from './components/toast/toast.component';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, ToastComponent]
})
export class AppComponent implements OnInit {
  constructor(private theme: ThemeService) {}

  // aplica el tema guardado antes de que se renderice cualquier componente
  ngOnInit() { this.theme.init(); }
}
