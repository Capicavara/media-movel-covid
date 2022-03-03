import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class CovidProviderService {
  readonly apiURL : string = "";
  public lat : number = 0;
  public long : number = 0;
  constructor(private http: HttpClient) { 
    this.apiURL = 'http://127.0.0.1:5000/';
    this.getLocation();
  }

//TODO criar uma unica função afim retornar os dados dos mêses para respeitar o SOLID.

//Cria uma função obrservavel para passar os dados de 6 mêses no brasil.
getData() : Observable<CovidProviderService[]>{
    return this.http.get<any>('http://127.0.0.1:5000/').pipe(data => {
    return data;
  })   
}

//Cria uma função obervavel para passar os dados de 1 mês no brasil.
getLastMonth() : Observable<CovidProviderService[]>{
  return this.http.get<any>('http://127.0.0.1:5000/lastMonth').pipe(data => {
  return data;
})   
}

//Função para enviar dados tratados pelo front-end para o back-end.
postLastMonth(postData: JSON){
  this.http.post<any>('http://127.0.0.1:5000/post?lat='+this.lat.toString()+'&long='+this.long.toString(), postData).subscribe({
  next: data => {
  },
  error: error => {
    console.error('There was an error!', error);
  }
})
}

//Função para receber a localização atual do usuário.
getLocation(): void{
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position)=>{
      this.lat = position.coords.longitude;
      this.long = position.coords.latitude;
    });
  } else {
    console.log("No support for geolocation")
  }
}
}
