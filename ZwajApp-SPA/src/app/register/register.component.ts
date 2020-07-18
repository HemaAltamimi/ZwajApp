import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { arLocale } from 'ngx-bootstrap/locale';
import { User } from '../_models/User';
import { Router } from '@angular/router';
defineLocale('ar', arLocale);

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
}) 
export class RegisterComponent implements OnInit {

  
  @Output() cancelRegister = new EventEmitter();
  user:User;
  registerForm:FormGroup;
  bsConfig: Partial<BsDatepickerConfig>;
  locale = 'ar';


  constructor(private authsSrvice:AuthService,private alrtify:AlertifyService ,private fb :FormBuilder,private localeService: BsLocaleService ,private router:Router) {
    this.localeService.use(this.locale);
   }

  ngOnInit() {
    this.bsConfig ={
      containerClass:'theme-red',
      showWeekNumbers:false
    }


    // this.registerForm =new FormGroup(
    //   {
    //     username: new FormControl('',Validators.required),
    //     password :new FormControl('',[Validators.required,Validators.minLength(4),Validators.maxLength(8)]),
    //     confirmPassword : new FormControl('',[Validators.required])
    //   },
    //   this.passwordMatchValidatior
    // );

    this.createRegisterForm();
  }

  createRegisterForm(){
    this.registerForm= this.fb.group({
      gender:['رجل'],
      knownAs: ['', Validators.required],
      dateOfBirth:[null,Validators.required],
      city:['',Validators.required],
      country:['',Validators.required],
      username:['',Validators.required],
      password:['',[Validators.required,Validators.minLength(4),Validators.maxLength(8)]],
      confirmPassword:['',Validators.required]
    },{validator : this.passwordMatchValidatior})
  }

  passwordMatchValidatior(form:FormGroup){
    return form.get('password').value === form.get('confirmPassword').value ? null :{'mismatch':true};
  }

  register(){
    if (this.registerForm.valid) {
      this.user = Object.assign({}, this.registerForm.value);
      this.authsSrvice.register(this.user).subscribe(
        () => { this.alrtify.success('تم الإشتراك بنجاح') },
        error => { this.alrtify.error(error) },
        () => {
          this.authsSrvice.login(this.user).subscribe(
            () => {
              this.router.navigate(['/members']);
            }

          )
        }
      )
    }

    console.log(this.registerForm.value);
    
  }
  cancel(){
    this.cancelRegister.emit(false);
  }

}
