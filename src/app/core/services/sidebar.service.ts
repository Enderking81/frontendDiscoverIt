import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// gestiona el estado abierto/cerrado del sidebar desde cualquier componente
@Injectable({ providedIn: 'root' })
export class SidebarService {
  private _open$ = new BehaviorSubject<boolean>(false);
  open$ = this._open$.asObservable();

  toggle() { this._open$.next(!this._open$.value); }
  close()  { this._open$.next(false); }
  open()   { this._open$.next(true); }
}
