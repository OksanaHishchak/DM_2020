import React from 'react';
import Graph from "./Graph";
import UploadData from "./UploadData";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dotList: [],
            connList: [],
            randKey: 0,
            resultList: [],
        };
        this.boruvkaAlgorithm = this.boruvkaAlgorithm.bind(this);
        this.uploadData = this.uploadData.bind(this);
    }

    addResult = (text) => this.setState(ps => ({resultList: [...ps.resultList, text]}));

    uploadData = (data) => {
        data.dotList.forEach((e, i) => {
            this.setState(ps => ({
                dotList: [...ps.dotList, {
                    key: i,
                    name: e.name,
                    x: e.x,
                    y: e.y,
                    color: 'black'
                }]
            }))
        });
        data.connList.forEach((e, i) => this.setState(ps => ({
            connList: [...ps.connList, {
                dot1: this.state.dotList[e.key1],
                dot2: this.state.dotList[e.key2],
                w: Number.parseInt(e.w),
                color: 'black'
            }]
        })));
        this.updateGraph();
    };


    boruvkaAlgorithm = () => {
        let blackConn = this.state.connList;
        let result = [];
        this.state.dotList.forEach((e, i) => result[i] = [e]);
        while (blackConn.length !== 0) {
            let lowestConn;
            let lowestDotsGroup = result.reduce((a, b) => (a.length !== 0 && a.length <= b.length) || b.length === 0 ? a : b);
            let lowestDotsGroupConn = blackConn.filter(f => lowestDotsGroup.some(b => b === f.dot1 || b === f.dot2));
            if (lowestDotsGroupConn.length > 1)
                lowestConn = lowestDotsGroupConn.reduce((a, b) => a.w < b.w ? a : b);
            else if (lowestDotsGroupConn.length === 1)
                lowestConn = lowestDotsGroupConn[0];
            else
                lowestConn = blackConn.reduce((a, b) => (a.w < b.w) ? a : b);
            let names = '[';
            lowestDotsGroup.forEach(e => names += ' ' + e.name);
            let dot1Res = result.indexOf(result.reduce((r, e) => e.some(s => s === lowestConn.dot1) ? e : r));
            let dot2Res = result.indexOf(result.reduce((r, e) => e.some(s => s === lowestConn.dot2) ? e : r));
            if (dot1Res !== dot2Res) {

                this.addResult('для масиву ' + names + '] добавляємо звязок'
                    + lowestConn.dot1.name + '(' + lowestConn.dot1.key + ')|'
                    + lowestConn.dot2.name + '(' + lowestConn.dot2.key + ')');
                result[dot1Res] = result[dot1Res].concat(result[dot2Res]);
                result[dot2Res] = [];

                this.setState(prevState => ({
                    connList: prevState.connList.map(e => e === lowestConn ? {...e, color: 'green'} : e)
                }));
                this.setState(prevState => ({
                    dotList: prevState.dotList.map(e => e === lowestConn.dot2 || e === lowestConn.dot1 ? {
                        ...e, color: 'green'
                    } : e)
                }));
            } else {
                this.addResult('звязок ' + lowestConn.dot1.name + '|' + lowestConn.dot2.name + ' => ' + lowestConn.w + ' не було добавлено');
                this.setState(prevState => ({
                    connList: prevState.connList.map(e => e === lowestConn ? {...e, color: 'violet'} : e)
                }));
            }
            blackConn = blackConn.filter(e => e !== lowestConn);
            this.updateGraph();
        }
    };

    updateGraph = () => this.setState({randKey: Math.round((Math.random() * 1000))});

    render() {
        return (
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <div>
                    <UploadData key={this.state.key} uploadData={this.uploadData}/></div>
                <div>
                    <button onClick={this.boruvkaAlgorithm}> Алгоритм Борувки</button></div>
                <div>{this.state.resultList.map(e => <div
                    style={{display: 'flex', flexDirection: 'row'}}>{e}</div>)}</div>
                <div style={{position: "absolute", right: "0"}}><Graph key={this.state.randKey}
                                                                       dotList={this.state.dotList}
                                                                       conn={this.state.connList}/></div>
            </div>
        )
    }
}