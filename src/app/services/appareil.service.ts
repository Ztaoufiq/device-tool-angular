import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable()
export class AppareilService {
    
    appareilSubject = new Subject<any[]>();

    private appareils = [
    {id: 0, name:'', status:''}
  ];
  constructor(private httpClient: HttpClient) {}
  emitAppareilSubject() {
    this.appareilSubject.next(this.appareils.slice());
  }

  switchOnAll() {
  	for(let appareil of this.appareils) {
  		appareil.status = 'allumé';
  	}
    this.emitAppareilSubject();
  }

  switchOffAll() {
  	for(let appareil of this.appareils) {
  		appareil.status = 'éteint';
  	}
    this.emitAppareilSubject();
  }

  switchOnOne(index: number) {
  	this.appareils[index].status = 'allumé';
    this.emitAppareilSubject();
  }

  switchOffOne(index: number) {
  	this.appareils[index].status = 'éteint';
    this.emitAppareilSubject();
  }

  getAppareilById(id: number) {
  	const appareil = this.appareils.find(
  		(appareilObject) => {
  			return appareilObject.id === id;
  		}
  	);
  	return appareil;
  }

  addAppareil(name: string, status: string) {
    const appareilObject = {
      id: 0,
      name: '',
      status: ''
    };
    appareilObject.name = name;
    appareilObject.status = status;
    appareilObject.id = this.appareils[(this.appareils.length - 1)].id + 1;
    this.appareils.push(appareilObject);
    this.emitAppareilSubject();
  }

  saveAppareilToServer() {
    this.httpClient
      .put('https://my-demo-12256-default-rtdb.firebaseio.com/appareils.json', this.appareils)
      .subscribe(
          () => {
            console.log('Enregistrement terminé !');
          },
          (error) => {
            console.log('Erreur de sauvegarde !' + error);
          }
        );
  }

  getAppareilFromServer() {
    this.httpClient
      .get<any[]>('https://my-demo-12256-default-rtdb.firebaseio.com/appareils.json')
      .subscribe(
          (response) => {
            this.appareils = response;
            this.emitAppareilSubject();
          },
          (error) => {
            console.log('Erreur de chargement !' + error);
          }
        );
  }
}