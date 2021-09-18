import { Component } from '@angular/core';
import { SocketService } from './services/socket.service';
import { ServiceWorkerLoggerService } from './services/service-worker-logger.service';
import { Router } from '@angular/router';
import { AuthService } from './services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ViswaAccounts';

  constructor(
    public sck: SocketService,
    public svrc: ServiceWorkerLoggerService,
    public router: Router,
    private authSrvc: AuthService
  ) {

    // window.addEventListener('storage', (event) => {

    //   this.userDs(event)

    // }, false);

  }

  private userDs(event){
    if( event.storageArea == localStorage ){

      if(this.authSrvc.getAccessToken())
      {
        setTimeout( () => {
          this.router.navigateByUrl('/dashboard');
        }, 1000)
      }
      else
        this.authSrvc.logout(true);
    }
  }
}
