import {Inject} from 'injection-js';
import * as React from 'react';
import Table from './Table';
import {ProviderConfig} from '../providers';

@ProviderConfig([
    {
        provide: 'key',
        useValue: 'Some value for MineSweeper'
    }
])
export default class MineSweeper extends React.Component<any, any> {
    intervals;
    interval;
    constructor(@Inject('props') props) {
        super(props);
        this.state = {
            level: "easy",
            mineNum : 10,
            rowNum : 9,
            colNum : 9,
            flagNum : 0,
            openNum : 0,
            time : 0,
            status : "playing"   // playing, clear, gameover
        };
    }
    componentWillUpdate() {
        if(this.state.status === "playing"){
            this.judge();
        }
    }
    componentWillMount() {
        this.intervals = [];
    }
    tick() {
        if(this.state.openNum > 0 && this.state.status === "playing"){
            this.setState({time: this.state.time + 1});
        }
    }
    judge() {
        if(this.state.mineNum + this.state.openNum >= this.state.rowNum * this.state.colNum){
            this.setState({status: "clear"});
        }
    }
    gameOver() {
        this.setState({status: "gameover"});
    }
    checkFlagNum(update) {
        this.setState({flagNum: this.state.flagNum + update});
    }
    setMine(){
        var mineTable = this.state.mineTable;
        for(var i = 0; i < this.state.mineNum; i++){
            var cell = mineTable[Math.floor(Math.random()*10)][Math.floor(Math.random()*10)];
            if(cell.hasMine){
                i--;
            } else {
                cell.hasMine = true;
            }
        }
        this.setState({
            mineTable: mineTable
        });
    }
    addOpenNum() {
        if(this.state.openNum === 0){
            this.interval = setInterval(this.tick.bind(this), 1000);
        }
        this.setState({
            openNum : ++ this.state.openNum
        });
    }
    reset() {
        clearInterval(this.interval);
        this.setState({openNum: 0, flagNum: 0, time: 0, status: "playing"});
    }
    setEasy() {
        clearInterval(this.interval);
        this.setState({level: "easy", mineNum: 10, rowNum: 9, colNum: 9, openNum: 0, flagNum: 0, time: 0, status: "playing"});
    }
    setNormal() {
        clearInterval(this.interval);
        this.setState({level: "normal", mineNum: 40, rowNum: 16, colNum: 16, openNum: 0, flagNum: 0, time: 0, status: "playing"});
    }
    setHard() {
        clearInterval(this.interval);
        this.setState({level: "hard", mineNum: 100, rowNum: 16, colNum: 30, openNum: 0, flagNum: 0, time: 0, status: "playing"});
    }
    render() {
        var self = this;
        var level = function () {
            if(self.state.level === "easy"){
                return (
                    <div className="MineSweeper__level">
                        <label><input type="radio" name="level" onChange={this.setEasy.bind(this)} checked />easy</label>
                        <label><input type="radio" name="level" onChange={this.setNormal.bind(this)} />normal</label>
                        <label><input type="radio" name="level" onChange={this.setHard.bind(this)} />hard</label>
                    </div>
                );
            } else if(self.state.level === "normal"){
                return (
                    <div className="MineSweeper__level">
                        <label><input type="radio" name="level" onChange={this.setEasy.bind(this)} />easy</label>
                        <label><input type="radio" name="level" onChange={this.setNormal.bind(this)} checked />normal</label>
                        <label><input type="radio" name="level" onChange={this.setHard.bind(this)} />hard</label>
                    </div>
                );
            } else if(self.state.level === "hard"){
                return (
                    <div className="MineSweeper__level">
                        <label><input type="radio" name="level" onChange={this.setEasy.bind(this)} />easy</label>
                        <label><input type="radio" name="level" onChange={this.setNormal.bind(this)} />normal</label>
                        <label><input type="radio" name="level" onChange={this.setHard.bind(this)} checked />hard</label>
                    </div>
                );
            }
        }.bind(this)();
        return (
            <div>
                {level}
                <div className={"MineSweeper " + this.state.level}>
                    <span className="MineSweeper__flagNum"> {this.state.mineNum - this.state.flagNum}</span>
                    <span className="MineSweeper__face" onClick={this.reset.bind(this)}>
                        <span className={"button " + this.state.status}></span>
                    </span>
                    <span className="MineSweeper__time"> {this.state.time}</span>
                    <Table openNum={this.state.openNum} mineNum={this.state.mineNum} rowNum={this.state.rowNum} colNum={this.state.colNum} gameOver={this.gameOver.bind(this)} addOpenNum={this.addOpenNum.bind(this)} checkFlagNum={this.checkFlagNum.bind(this)}/>
                </div>
            </div>
        );
    }
}
