import { Component, Inject } from '@angular/core';
import { element } from 'protractor';
import { CovidProviderService } from './provider/covid-provider.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DialogData {
  mobile: number;
  mobile2: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  //Váriaveis
  title = 'covid';

  public covidData : Array<any> = [];
  public mobileMedia : number = 0;
  public mobile : number = 0;
  public mediaSemana : number = 0;
  public mediaSemana2 : number = 0;
  public isTrue : boolean = false;
  public loading : boolean = true;
  
  constructor(private covid: CovidProviderService, public dialog: MatDialog) {
    //TODO Otimizar operações
    //Inscreve no observable criado no service (covid-provider) e realiza calculos com os dados do objeto retornado.
    covid.getData().subscribe(data =>{
      this.covidData = data.slice(Math.max(data.length - 7, 0))
      this.covidData.forEach(element => {
        this.mobileMedia = (this.mobileMedia + element.Deaths);
      });
      this.mobileMedia = this.mobileMedia / 7;
      this.mediaSemana = this.mobileMedia;
      this.covidData = data.slice(Math.max(data.length - 21, 0));
      this.covidData.splice(-14);
      this.covidData.forEach(element => {
        this.mobile = (this.mobile + element.Deaths);
      });
      this.mobile = this.mobile / 7;
      this.mobileMedia = Math.round(((this.mobileMedia / this.mobile)-1) * 100 );
      if(this.mobileMedia == 0){
        this.loading = true;
      }
      else{
        this.loading = false;
      }
      if(this.mobileMedia >= 15){
        this.isTrue = true
      }
      else{
        this.isTrue = false
      }
    });
    //Executa função para receber os dados do ultimo mês
    this.getLastMonth();
  }
  
  //Função para receber tratar e enviar os dados do ultimo mês
  getLastMonth(){
    this.covid.getData().subscribe(data=>{
      data.sort((a:any, b:any) => parseFloat(b.Deaths) - parseFloat(a.Confirmed));
      let jsonData = JSON.stringify(data);
      this.covid.postLastMonth(JSON.parse(jsonData));
    })
  }
  
  //Função para abrir o modal/dialog para exibir os calculos realizados.
  openDialog(mediaM:number) {
    this.dialog.open(calcDialog, {
      data: {mobile: Math.round(this.mobile),mobile2: Math.round(this.mediaSemana)}
    });
  }
  
}

//Componente do modal/dialog

@Component({
  selector: 'calcDialog',
  templateUrl: 'calcDialog.html',
})
export class calcDialog {
  
  constructor(
    public dialogRef: MatDialogRef<calcDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
    
    onNoClick(): void {
      this.dialogRef.close();
    }
    
  }
  