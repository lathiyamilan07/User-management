import { AfterViewInit, Component, OnInit, ViewChild , Inject} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { FormGroup, FormControl, Validators } from '@angular/forms';
export interface User {
  id : number,
  name: string;
  email: string;
  role: string;
}
@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.scss']
})
export class UserlistComponent implements OnInit, AfterViewInit {

  searchText : any;
  UserData: User[] = [
    {id : 1, name : 'abc', email : 'abc@email.com', role : 'user'},
    {id : 2, name : 'xyz', email : 'xyz@email.com', role : 'admin'},
  ];
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  displayedColumns: string[] = ['name', 'email', 'role', 'edit', 'delete'];
  dataSource :any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.getUserData()
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  
  applyFilter(filterValue: any) {
    this.dataSource.filter = filterValue.target.value.trim().toLowerCase();
    this.dataSource.filterPredicate = (data: User, filter: string) => {
      const searchText = filter.toLowerCase();
      return (
        data.name.toLowerCase().includes(searchText) ||
        data.email.toLowerCase().includes(searchText)
      );
    };
  }

  // get user data 
  getUserData(){
    if(localStorage.getItem('userData')){
      let data : any = localStorage.getItem('userData')
      this.UserData = JSON.parse(data)
      this.dataSource = new MatTableDataSource<User>(this.UserData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
    else{
      localStorage.setItem('userData',JSON.stringify(this.UserData))
      this.dataSource = new MatTableDataSource<User>(this.UserData);
    }
  }

  addUser(){
    const dialogRef = this.dialog.open(AddUser, {
      width: '350px',
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result !== undefined){
        this.pushnewData(result)
      }
    });
  }

  // add new data 
  pushnewData(result:any){
      let id = Math.floor(Math.random() * 1000)
      result['id'] = id
      let data : any = localStorage.getItem('userData')
      data = JSON.parse(data)
      data.push(result)
      localStorage.setItem('userData',JSON.stringify(data))
      this.getUserData()
  }

  // edit usert 
  EditData(id:number){
    if(id !== undefined){
      const dialogRef = this.dialog.open(EditUser, {
        width: '350px',
        data: id,
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if(result !== undefined){
          this.updateData(result)
        }
      });
    }
  }

  // update use data 
  updateData(data:any){
    const updatedUserData = this.UserData.map(user => {
      if (user.id === data?.id) {
        return {
          ...user,
          name: data?.name,
          email: data?.email,
          role: data?.role,
        };
      }
      return user; // Return unchanged users
    });
    localStorage.setItem('userData',JSON.stringify(updatedUserData))
    this.getUserData()
  }

  // delete data 
  DeleteData(id:number){

    if(id !== undefined){
      const dialogRef = this.dialog.open(DeleteUser, {
        width: '250px',
        data: id,
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if(result !== undefined){
          let newdata : any = localStorage.getItem('userData')
          newdata = JSON.parse(newdata)
          newdata = newdata.filter((i:any) => i.id !== result)
          localStorage.setItem('userData',JSON.stringify(newdata))
          this.getUserData()
        }
      });
    }
  }
}


// add user component 

@Component({
  selector: 'add-user',
  templateUrl: './addUser/adduser.html',
})
export class AddUser implements OnInit {
  selected : any; 
  userForm! : FormGroup;
  constructor(
    public dialogRef: MatDialogRef<AddUser>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    
  ) {}

  ngOnInit(): void {
    this.userForm = new FormGroup({
      'name' : new FormControl('',Validators.required),
      'email' : new FormControl('',[Validators.required,Validators.email]),
      'role' : new FormControl('',Validators.required),
    })
  }

  submitForm(){
    if(this.userForm.valid){
      this.dialogRef.close(this.userForm.value);
    }
  }
}

// edit user component 

@Component({
  selector: 'edit-user',
  templateUrl: './addUser/edituser.html',
})
export class EditUser implements OnInit {
  selected : any; 
  EdituserForm! : FormGroup;
  constructor(
    public dialogRef: MatDialogRef<AddUser>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    
  ) {
  }
  ngOnInit(): void {
    this.EdituserForm = new FormGroup({
      'id' : new FormControl(this.data?.id,Validators.required),
      'name' : new FormControl(this.data?.name,Validators.required),
      'email' : new FormControl(this.data?.email,[Validators.required,Validators.email]),
      'role' : new FormControl(this.data?.role,Validators.required),
    })
  }

  submitForm(){
    if(this.EdituserForm.valid){
      this.dialogRef.close(this.EdituserForm.value);
    }
  }
}

// delte user component

@Component({
  selector: 'delete-user',
  templateUrl: './addUser/deleteuser.html',
})
export class DeleteUser implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AddUser>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    
  ) {
  }
  ngOnInit(): void {
  }

  onDelete(){
    this.dialogRef.close(this.data);
  }

  onNo(){
    this.dialogRef.close();
  }

}

