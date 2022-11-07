import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ThisReceiver } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../models/user.model';

export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered: boolean;
}

@Injectable(
    { providedIn: 'root' }
)
export class AuthenticationService {

    user = new BehaviorSubject<User | null>(null);

    private tokenExpirationTimer: any;

    constructor(private http: HttpClient, private router: Router) {

    }

    signUp(email: string, password: string) {
        console.log(email, password);
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAan00lATV0XQRNioWZNjOvj_UX4_N7c5I',
            {
                email: email,
                password: password,
                returnSecureToken: true
            }).pipe(
                tap(
                    (responseData: AuthResponseData): any => {
                        this.handleAuthentication(responseData.email, responseData.localId, responseData.idToken, responseData.expiresIn);
                    }
                ),
                catchError(this.handleError),
            );
    }

    logIn(email: string, password: string) {
        console.log(email, password);
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAan00lATV0XQRNioWZNjOvj_UX4_N7c5I',
            {
                email: email,
                password: password,
                returnSecureToken: true
            }).pipe(
                tap(
                    (responseData: AuthResponseData): any => {
                        this.handleAuthentication(responseData.email, responseData.localId, responseData.idToken, responseData.expiresIn);
                    }
                ),
                catchError(this.handleError),
            );
    }

    logOut() {
        this.user.next(null);
        localStorage.removeItem('userData');
        this.router.navigate(['/login']);
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
            this.tokenExpirationTimer = null;
        }
    }

    autoLogout(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(
            (): any => {
                this.logOut();
            },
            expirationDuration
        );
    }

    autoLogin() {
        const localuserData: string | null = localStorage.getItem('userData');
        if (!localuserData) {
            return;
        }
        const userData: {
            email: string,
            id: string,
            _token: string,
            _tokenExpirationDate: number
        } = JSON.parse(localuserData);
        if (!userData) {
            return;
        }
        const loadedUser = new User(userData.email, userData.id, userData._token, userData._tokenExpirationDate);

        if (loadedUser._token) {
            this.user.next(loadedUser);
            this.autoLogout((userData._tokenExpirationDate - new Date().getTime()));
        }

    }

    private handleAuthentication(email: string, localId: string, idToken: string, expiresIn: string) {
        const expirationDate = (new Date().getTime() + (+expiresIn * 10000));
        const user = new User(
            email,
            localId,
            idToken,
            expirationDate);

        this.user.next(user);
        this.autoLogout(expirationDate);
        localStorage.setItem('userData', JSON.stringify(user));
    }

    private handleError(errorRes: HttpErrorResponse): Observable<Object> {
        let errorMessage = 'An unknown error ocurred';
        if (!errorRes.error || !errorRes.error.error) {
            return throwError(errorMessage);
        }
        switch (errorRes.error.error.message) {
            case 'EMAIL_NOT_FOUND': errorMessage = 'User not found!!';
                break;
            case 'INVALID_PASSWORD': errorMessage = 'Invalid password!!';
                break;
            case 'USER_DISABLED': errorMessage = 'This user is disabled!!';
                break;
            case 'EMAIL_EXISTS': errorMessage = 'This email exists already!!';
                break;
        }
        return throwError(errorMessage);
    }
}