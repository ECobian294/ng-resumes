import { ActivatedRoute, Params, Route, Router, UrlSegment } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {

  isLogin: boolean = false;
  formType: string = 'Register';

  constructor(private route: ActivatedRoute, private authService: AuthenticationService, private router: Router) { }

  ngOnInit(): void {
    this.route.url.subscribe((urls: UrlSegment[]): any => {
      if (urls.length > 0 && urls[0].path === 'login') {
        this.formType = 'Login';
        this.isLogin = true;
      } else {
        this.isLogin = false;
        this.formType = 'Register';
      }
    });
  }

  onSubmit(form: NgForm) {
    const email: string = form.value.email;
    const password: string = form.value.password;
    let subscription: Observable<any>;
    if (!this.isLogin) {
      subscription = this.authService.signUp(email, password);
    } else {
      subscription = this.authService.logIn(email, password);
    }
    if (subscription) {
      this.manageSubscription(subscription, form);
    }
  };

  manageSubscription(subscription: Observable<any>, form: NgForm) {
    subscription.subscribe((response): any => {
      console.log('Successfully:' + response);
      this.router.navigate(['/home']);
      form.reset();
    }, (error): any => {
      console.log('ERROR:' + error);
    });
  }
}
