import { Component, ViewChild} from '@angular/core';
import {NgxSnakeComponent, NgxSnakeModule} from 'ngx-snake';

export class Action {           //object to remember history: timestamp, action
  timeStamp: number = 0;
  act: string = '';
  constructor(act:string){
    this.timeStamp = Math.floor(Date.now()/1000);
    this.act = act;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  public registerView = 'regView1';   //name of page to display
  title = 'Snake';
  public bw = false;
  public score = 0;
  public gameMode = "ready";   
  public playerName = '';
  public playerEmail = '';
  public errorOnInput = '';           //to display info error on login

  rememberHistory: Array<Action>=[];   //array to remember original history

  history: Array<Action>=[];          //array to display history - sorted, filtered
  constructor(){
    this.history = [];
    this.history.push(new Action('game loaded'));
    this.rememberHistory=this.history;    //remember original history
  }


  //***************************************** filter history *****************************************
  selectedAction: string = '';   //for list option

  selectChangeHandler (event: any) {              //event handler for the select element's change event
    this.selectedAction = event.target.value;     //update the ui
    this.history=this.rememberHistory;            //array to display is reloaded
    if(event.target.value != "*"){                //filter history
      this.history = this.history.filter(element => {
        if(event.target.value=='grow'){           //'grow' has score - filter only first 4 characters
          return element.act.substring(0, 4) == event.target.value;
        }else{
          return element.act == event.target.value;
        }
      })
    }
  }
  
  //***************************************** sort history *****************************************
  public sortAscPressed() {
    return this.history.sort((a, b) => {return <any>new Date(b.timeStamp) - <any>new Date(a.timeStamp);});
  }

  public sortDscPressed() {
      return this.history.sort((a, b) => {return <any>new Date(a.timeStamp) - <any>new Date(b.timeStamp);});
  }

//***************************************** timer event *****************************************
  time: number = 0;
  display: string= '0';
  interval: any;

  act:string ='';  //to add string action to object

 startTimer() {
    //this.time = 0;
    this.interval = setInterval(() => {
      if (this.time >= 0) {
        this.time++;
      } 
      this.display = this.time.toString();
    }, 1000);
  }

  pauseTimer() {
    clearInterval(this.interval);
  }

//***************************************** history event *****************************************
//save history
  saveAction(){
    this.history.push(new Action(this.act));
    this.act='';
  }

  clearHistory(){
    this.history =[];
  }

  //***************************************** login page event *****************************************
  public onStartGameButtonPressed() {
    this.errorOnInput = '';
    //name validator
    if(!this.playerName.length){
      this.errorOnInput = 'Plese enter Your name!';
    }
    //email validator
    const regularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!regularExpression.test(String(this.playerEmail).toLowerCase())){
      this.errorOnInput = 'This is not valid email!';
    }

    if(!this.errorOnInput){
      this.errorOnInput = '';
      this.registerView = 'regView2';
    }
  }
  
  @ViewChild('game')
  private _snake!: NgxSnakeComponent;

//***************************************** game event *****************************************
  //counting score, and add to history
  public onGrow() {
    //console.log('grow');
    this.score++;
    this.act='grow - '+ this.score;
    this.saveAction();
  }

  public onGameOver() {
    this.time = 0;
    this.pauseTimer();
    this.gameMode = "over";
    this.act='game over';
    this.saveAction();
    alert('game over');
  }

  //***************************************** buttons event *****************************************
    public onStartButtonPressed() {
      this.gameMode = "started";
      this._snake.actionStart();
      this.startTimer();
      this.act='start game';
      this.saveAction();
  }

  public onStopButtonPressed() {
    this.gameMode = "paused";
    this._snake.actionStop();
    this.pauseTimer();
    this.act='paused';
    this.saveAction();
  }

  public onResetButtonPressed() {
    this.gameMode = "ready";
    this._snake.actionReset();
    this.time = 0;
    this.display = '0';
    this.pauseTimer();
    this.clearHistory();

  }

  public onExitButtonPressed() {
    this.time = 0;
    this.display = '0';
    this.score = 0;
    this.history = [];
    this.rememberHistory = [];
    this.gameMode = "ready";
    this._snake.actionReset();
    this.registerView = 'regView1';
  }
}





