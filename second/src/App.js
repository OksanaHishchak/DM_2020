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
        this.hardWay = this.hardWay.bind(this);
        this.uploadData = this.uploadData.bind(this);
        this.hierholzerAlgorithm = this.hierholzerAlgorithm.bind(this);
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
                w: e.w,
                color: 'black'
            }]
        })));
        this.updateGraph();
    };

    hierholzerAlgorithm = () => {
        let residualConn = this.state.connList;
        let resultCycle = [];
        let specialDot = residualConn[0].dot1;
        while (residualConn.length !== 0) {
            if (residualConn.filter(e => e.dot1 === specialDot || e.dot2 === specialDot).length === 0) specialDot = residualConn[0].dot1;
            let data = this.cycle(specialDot, residualConn, [], residualConn.filter(e => e.dot1 === specialDot || e.dot2 === specialDot).length - 2);
            data.cl.push(specialDot);
            console.log(data.cl);
            let mass = [];
            data.cl.forEach(e => mass.push(e.key))
            this.addResult('з вершини ' + specialDot.name + '(' + specialDot.key + ') => ' + mass);
            if (resultCycle.length === 0) {
                resultCycle = data.cl;
            } else {
                let mass = [];
                for (let e of resultCycle) {
                    if (data.cl !== null && e === data.cl[0] ) {
                        mass = mass.concat(data.cl);
                        data.cl = null;
                    } else {
                        mass.push(e);
                    }
                }
                resultCycle = mass;
            }
            residualConn = data.rc;
            mass = [];
            resultCycle.forEach(e => mass.push(e.key))
            this.addResult('  остатoчний масив => ' + mass);
        }
    };

    cycle = (thisDot, residualConn, cycleList, exitCond) => {
        const availableConn = residualConn.filter(e => e.dot1 === thisDot || e.dot2 === thisDot);
        if (availableConn.length === exitCond) return {cl: cycleList, rc: residualConn};
        cycleList.push(availableConn[0].dot2 === thisDot ? availableConn[0].dot2 : availableConn[0].dot1);
        return this.cycle(availableConn[0].dot2 === thisDot ? availableConn[0].dot1 : availableConn[0].dot2, residualConn.filter(e => e !== availableConn[0]), cycleList, exitCond)
    };

    hardWay = () => {
        this.setState({resultList: []});
        for (let dotListElement of this.state.dotList) {
            const num = this.state.connList.filter(e => e.dot1 === dotListElement || e.dot2 === dotListElement).length;
            if (num % 2 !== 0) {
                this.addResult('точка ' + dotListElement.name + ' має непарну(' + num + ') кількість зв\'язків!');
                return;
            }
        }
        let resultConnMass = [];
        const firstDot = this.state.dotList[0];
        for (let conn of this.state.connList.filter(e => e.dot1 === firstDot || e.dot2 === firstDot)) {
            const nextDot = this.state.dotList.filter(e => e !== firstDot).filter(e => e === conn.dot1 || e === conn.dot2)[0];
            resultConnMass.push(this.hardWayRecursive(nextDot, conn, this.state.connList.filter(e => e !== conn)))
        }
        for (let elem of resultConnMass) {
            let fullResult = '\r result: ';
            elem.forEach(e => fullResult += ' | ' + e.dot1.name + ' - ' + e.dot2.name);
            this.addResult(fullResult);
        }
        this.updateGraph();
    };

    hardWayRecursive = (currentDot, currentConn, leastConnMass) => {
        if (leastConnMass.length === 0) {
            if (currentDot === this.state.dotList[0])
                return [currentConn];
            else
                return null;
        } else {
            const possibleConnMass = leastConnMass.filter(e => e.dot1 === currentDot || e.dot2 === currentDot);
            let resultConnMass = [];
            for (let possConn of possibleConnMass) {
                const nextDot = this.state.dotList.filter(e => (e === possConn.dot1 && currentDot === possConn.dot2) || (e === possConn.dot2 && currentDot === possConn.dot1))[0];
                resultConnMass.push(this.hardWayRecursive(nextDot, possConn, leastConnMass.filter(e => e !== possConn)));
            }
            resultConnMass = resultConnMass.filter(e => e !== null);
            if (resultConnMass.length !== 0) {
                resultConnMass[0].push(currentConn);
                return resultConnMass[0];
            } else return null;
        }
    };


    updateGraph = () => this.setState({randKey: Math.round((Math.random() * 1000))});

    render() {
        return (
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <div><UploadData key={this.state.key} uploadData={this.uploadData}/></div>
                <div>
                    <button onClick={this.hardWay}> Ейлеровий цикл</button>
                </div>
                <div>
                    <button onClick={this.hierholzerAlgorithm}> Hierholzer algorithm</button>
                </div>
                <div>{this.state.resultList.map(e => <div
                    style={{display: 'flex', flexDirection: 'row'}}>{e}</div>)}</div>
                <div style={{position: "absolute", right: "0"}}><Graph key={this.state.randKey}
                                                                       dotList={this.state.dotList}
                                                                       conn={this.state.connList}/></div>
            </div>
        )
    }
}