import { Component } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { error } from 'console';
import { response } from 'express';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
    selector: 'app-rh-employes',
    templateUrl: './rh-employes.component.html',
    styleUrl: './rh-employes.component.css',
    standalone: false
})
export class RhEmployesComponent {
   employes:Array<User>=[]
   rhs:Array<User>=[]
   token:string| null =''
   isEditModalOpen=false
   isDeleteModalOpen=false
   employe!:User
   paginatedEmployes: User[] = [];
  paginatedRhs: User[] = [];
  page: number = 1;
  pageSize: number = 5;
  pageEmployes: number = 1;
pageRhs: number = 1;


   constructor(private userService:UserService,private localStorageService:LocalStorageService){}
   ngOnInit(): void {
    // Récupérer le token lors de l'initialisation du composant
    this.token = this.localStorageService.getItem("token");
    if (!this.token) {
      console.error("Aucun token trouvé dans le localStorage.");
    } else {
      console.log("Token récupéré:", this.token);
    }
  }
  
  ngAfterViewInit(): void {
    if (this.token) {
      // Appels liés à la vue et aux données
      this.getAllEmployes(this.token);
      this.getAllRhs(this.token);
    } else {
      console.warn("Les appels pour les employés et RH n'ont pas été effectués car le token est manquant.");
    }
  }
  
   getAllEmployes(token:string){
    if (token) {
      this.userService.getEmployes(token).subscribe({
        next: (response: any) => {
          console.log('Réponse de l\'API:', response);
            this.employes = response; 
            this.paginateEmployes();
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des congés', err);
        }
      });
    } else {
      console.error('Token non disponible');
    }
   }
   getAllRhs(token:string){
    if (token) {
      this.userService.getRhs(token).subscribe({
        next: (response: any) => {
          console.log('Réponse de l\'API:', response);
            this.rhs = response; 
            this.paginateRhs();
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des congés', err);
        }
      });
    } else {
      console.error('Token non disponible');
    }
   }
   editerUser(employe:User){
    this.isEditModalOpen=true
    this.employe=employe
   }
   closeModal(){
    this.isEditModalOpen=false
   }
   modifier(id: number | undefined) {
    if (id === undefined) {
        console.error("ID utilisateur non défini");
        return;
    }
    this.token = this.localStorageService.getItem("token");
    const userData = {
        lastName: this.employe.lastName,
        firstName: this.employe.firstName,
        email: this.employe.email
    };
    if (this.token) {
        this.userService.modifierUser(this.token, userData, id).subscribe({
            next: (response: any) => {
                this.closeModal();
                if(this.token)
                this.getAllEmployes(this.token);
                console.log('Utilisateur modifié avec succès');
            },
            error: (err) => {
                console.error('Erreur lors de la modification de l\'utilisateur', err);
            }
        });
    } else {
        console.log("Token invalide");
    }
  }
  deleteUser(employe:User){
    this.isDeleteModalOpen=true
    this.employe=employe
  }
  closeDeleteModal(){
    this.isDeleteModalOpen=false
  }
  delete(id:number|undefined){
      if (id === undefined) {
          console.error("ID utilisateur non défini");
          return;
      }
      this.token = this.localStorageService.getItem("token");
      const userData = {
          lastName: this.employe.lastName,
          firstName: this.employe.firstName,
          email: this.employe.email
      };
      if (this.token) {
          this.userService.deleteUser(this.token, id).subscribe({
              next: (response: any) => {
                  this.closeDeleteModal();
                  if(this.token){
                  this.getAllEmployes(this.token);
                  this.getAllRhs(this.token)
                  }
                  console.log('Utilisateur modifié avec succès');
              },
              error: (err) => {
                  console.error('Erreur lors de la modification de l\'utilisateur', err);
              }
          });
      } else {
          console.log("Token invalide");
      }
  }
  
  getTotalPages(data: User[]): number {
    return Math.ceil(data.length / this.pageSize);
  }

 
  paginateEmployes(): void {
    const start = (this.pageEmployes - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedEmployes = this.employes.slice(start, end);
  }
  
  paginateRhs(): void {
    const start = (this.pageRhs - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedRhs = this.rhs.slice(start, end);
  }
  
  onEmployesPageChange(newPage: number): void {
    this.pageEmployes = newPage;
    this.paginateEmployes();
  }
  
  onRhsPageChange(newPage: number): void {
    this.pageRhs = newPage;
    this.paginateRhs();
  }
  
}