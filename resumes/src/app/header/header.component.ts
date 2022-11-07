import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  pageTitle: string = 'Resumes';

  isAuthenticated: boolean = false;

  constructor(private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.authService.user.subscribe(
      (user): any => {
        this.isAuthenticated = !!user;
      }
    )
  }

  onDropdownProfile() {
    const dropDownUlDiv: HTMLDivElement = <HTMLDivElement>document.getElementById('dropdownProfile');
    console.log(dropDownUlDiv);
    const classList: DOMTokenList = dropDownUlDiv.classList;
    if (classList.contains('hidden')) {
      dropDownUlDiv.classList.remove('hidden');
      dropDownUlDiv.classList.add('block');
    } else {
      dropDownUlDiv.classList.remove('block');
      dropDownUlDiv.classList.add('hidden');
    }
    console.log(dropDownUlDiv);
  }

  onLogout() {
    this.authService.logOut();
  }

}
