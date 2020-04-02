import React, {Component} from 'react'
import ConnectGrid from "./ConnectGrid";
import NameForm from "./NameForm";
import AddNewDot from "./AddNewDot";
import Graph from "./Graph";
import TestReader from "./TestReader";
import * as axios from "axios";

class Main extends Component {
    constructor(props) {
        super(props);
        this.onChangeName = this.onChangeName.bind(this);
        this.addNewDot = this.addNewDot.bind(this);
        this.deleteDot = this.deleteDot.bind(this);
        this.updateConnect = this.updateConnect.bind(this);
        this.changeColor = this.changeColor.bind(this);
        this.changeCoordinate = this.changeCoordinate.bind(this);
        this.boruvkaAlgorithm = this.boruvkaAlgorithm.bind(this);
        this.uploadDots = this.uploadDots.bind(this);
        this.travellingSalesmanProblem = this.travellingSalesmanProblem.bind(this);
        this.tvr = this.tvr.bind(this);
        this.eulerianPath = this.eulerianPath.bind(this);
        this.state = {
            list: [], // key, name, x, y, column
            grid: [], // [w]
            conn: [], //key1, key2, x1,x2,y1,y2,color,w
            boruvkaPrint: [],
            tvp:
                {
                    dotListResult: [],
                    connectionListResult: [],
                    weight: []
                },
            randKey: 0,
            test: {mass: [], weight: null},
            changeColorList: [],
            eulerianPath: [],
            fifthResult: []
        }
    }

    uploadDots = (jsonData) => {
        let data = JSON.parse(jsonData);
        data.dots.forEach(e => this.addNewDot(e.name, e.x, e.y));
        data.conn.forEach(e => this.updateConnect(Number.parseInt(e.key1), Number.parseInt(e.key2), Number.parseInt(e.w)));
    };

    changeCoordinate = (key, xx, yy) => {
        if (xx === '' || xx < 0) xx = 0;
        if (yy === '' || yy < 0) yy = 0;
        let x = Number.parseInt(xx);
        let y = Number.parseInt(yy);
        if (xx.toString().startsWith('0') && xx.toString().length > 1) x = Number.parseInt(xx.toString().substr(1));
        if (yy.toString().startsWith('0') && yy.toString().length > 1) y = Number.parseInt(xx.toString().substr(1));;
        if (x > 1100) x = 1099;
        if (y > 1100) y = 1099;

        this.setState(prevState => ({
            list: prevState.list.map(e => e.key === key ? {...e, x: x, y: y} : e)
        }));
        this.setState(prevState => ({
            conn: prevState.conn.map(e => e.key1 === key ? {...e, x1: x, y1: y} : e)
        }));
        this.setState(prevState => ({
            conn: prevState.conn.map(e => e.key2 === key ? {...e, x2: x, y2: y} : e)
        }));
        this.updateGraph();
    };

    onChangeName = (key, name) => {
        this.setState(prevState => ({
            list: prevState.list.map(
                e => e.key === key ? {...e, name: name} : e
            )
        }));
        this.updateGraph();
    };

    deleteDot = (key) => {
        this.deleteAllDotConnect(key);
        this.setState({list: this.state.list.filter(dot => dot.key !== key)}); // delete dot
        this.setState(prevState => ({list: prevState.list.map(e => e.key > key ? {...e, key: e.key - 1} : e)})); // change keys
        this.setState({grid: this.state.grid.filter((line, i) => i !== key)}); // delete grid line
        this.setState(prevState => ({
            grid: prevState.grid.map((line, i) =>
                prevState.grid[i] = line.filter((cell, k) => k !== (this.state.grid.length - key)))
        })); // delete grid column


        this.updateGraph();
    };

    updateGridWeighValue = (key1, key2, w) => this.setState(prevState => ({
        grid: prevState.grid
            .map((e, i) => i === key1 ? e
                .map((s, h) => h === (this.state.list.length - key2 - 1) ? {s, w: w} : s) : e)
    }));

    addConnect = (key1, key2, w) => {
        this.setState(prevState => ({
            conn: [...prevState.conn, {
                key1: key1,
                key2: key2,
                color: 'black',
                x1: this.state.list[key1].x,
                y1: this.state.list[key1].y,
                x2: this.state.list[key2].x,
                y2: this.state.list[key2].y,
    w: w
}]
}));
};

    deleteConnect = (key1, key2) => this.setState({conn: this.state.conn.filter(e => e.key1 !== key1 || e.key2 !== key2)}); // false == delete

    deleteAllDotConnect = (key) => {
        this.setState({conn: this.state.conn.filter(e => e.key1 !== key && e.key2 !== key)});
        this.setState(prevState => ({
            conn: prevState.conn.map(
                e => e.key1 >= key ? {...e, key1: e.key1 - 1} : e
            )
        }));
        this.setState(prevState => ({
            conn: prevState.conn.map(
                e => e.key2 >= key ? {...e, key2: e.key2 - 1} : e
            )
        }));
    };

    changeColor = (key1, key2, color) => {
        this.setState(prevState => ({
            conn: prevState.conn.map(e => !(e.key1 !== key1 || e.key2 !== key2) ? {
                ...e,
                color: color
            } : e)
        }));
        this.setState(prevState => ({
            list: prevState.list.map(e => e.key === key1 || e.key === key2 ? {
                ...e,
                color: color
            } : e)
        }));
        this.updateGraph();
    };

    updateConnect = (key1, key2, w) => {
        if (w === '') w = 0;

        let weigh = Number.parseInt(w);
        if (w.toString().startsWith('0') && w.toString().length > 1) weigh = Number.parseInt(w.toString().substr(1));


        this.deleteConnect(key1, key2);
        if (weigh !== 0) this.addConnect(key1, key2, weigh);

        this.updateGridWeighValue(key1, key2, weigh.toString());
        this.updateGraph();
    };

    randomNumber = () => Math.round(50 + (Math.random() * 1000));

    checkXCoordinate = (x, distance) => this.state.list.some(e => Math.abs(e.x - x) < distance); // true = bad coordinate

    addXCoordinate = (distance) => {
        let limiter = 0;
        while (true) {
            let num = this.randomNumber();
            if (!this.checkXCoordinate(num, distance)) return num;
            limiter++;
            if (limiter === 100) {
                console.log('x-limit was decreased: ', distance, ' => ', distance - 1);
                limiter = 0;
                distance--;
            }
        }
    };

    checkYCoordinate = (x, distance) => this.state.list.some(e => Math.abs(e.y - x) < distance); // true = bad coordinate

    addYCoordinate = (distance) => {
        let limiter = 0;
        while (true) {
            let num = this.randomNumber();
            if (!this.checkYCoordinate(num, distance)) return num;
            limiter++;
            if (limiter === 100) {
                console.log('y-limit was decreased: ', distance, ' => ', distance - 1);
                limiter = 0;
                distance--;
            }
        }
    };

    indexOfDot = (arr, key) => {
        for (const [i, res] of arr.entries())
            if (res.some(e => e === key)) return i;
    };

    tvr = () => {
        const l = this.recursive(this.state.list[0], this.state.list.filter(e => e !== this.state.list[0]), 0);
        this.setState(prevState => ({
            test: {...prevState, mass: l.dotMass, weight: l.w}
        }));
        let previouslyDot = null;
        for (let dotName of l.dotMass) {
            const dot = this.state.list.filter(e => e.name === dotName.dot)[0];
            if (previouslyDot !== null) {
                this.setState(prevState => ({ // міняємо на жовтий
                    list: prevState.list.map(e => e.name === previouslyDot.name ? {
                        ...e, color: '#15F928'
                    } : e)
                }));
                const i = this.findConnByDots(previouslyDot, dot)
                this.setState(prevState => ({ // міняємо на жовтий
                    conn: prevState.conn.map(e => e === i ? {
                        ...e, color: '#15F928'
                    } : e)
                }));
                this.addColorChanging('dot', previouslyDot, '#15F928');
                this.addColorChanging('conn', this.findConnByDots(previouslyDot, dot), '#15F928');
            }
            previouslyDot = dot;
        }
        this.updateGraph();
    };

    eulerianPath = () => {
        let resultConnMass = [];
        const firstDot = this.state.list[0];
        for (let conn of this.state.conn.filter(e => e.key1 === firstDot.key || e.key1 === firstDot.key)) {
            const nextDot = this.state.list.filter(e => (e.key === conn.key1 && firstDot.key === conn.key2) || (e.key === conn.key2 && firstDot.key === conn.key1))[0];

            console.log(nextDot.name, ' = ', conn.key1, '|', conn.key2);
            resultConnMass.push(this.eulerianRecursive(nextDot, conn, this.state.conn.filter(e => e !== conn)))
        }

        resultConnMass.forEach(e => console.log(e));
        this.setState(prevState => ({
            eulerianPath: resultConnMass
        }));

        for (let conn of resultConnMass) {
            this.addColorChanging('dot', this.state.list.filter(e => e.key === conn.key1)[0], '#15F928');
            this.addColorChanging('conn', conn, '#15F928');
        }
        this.updateGraph();
    };

    eulerianRecursive = (currentDot, currentConn, leastConnMass) => {
        if (leastConnMass.length === 0) {
            if (currentDot === this.state.list[0])
                return [currentConn];
            else
                return null;
        } else {
            const possibleConnMass = leastConnMass.filter(e => e.key1 === currentDot.key || e.key2 === currentDot.key);
            let resultConnMass = [];
            for (let possConn of possibleConnMass) {
                const nextDot = this.state.list.filter(e => (e.key === possConn.key1 && currentDot.key === possConn.key2) || (e.key === possConn.key2 && currentDot.key === possConn.key1))[0];
                resultConnMass.push(this.eulerianRecursive(nextDot, possConn, leastConnMass.filter(e => e !== possConn)));
            }
            resultConnMass = resultConnMass.filter(e => e !== null);
            if (resultConnMass.length !== 0) {
                resultConnMass[0].push(currentConn);
                return resultConnMass[0];
            } else return null;
        }
    };

    colorChanger = () => {
        this.state.changeColorList.forEach((e, i) => setTimeout(this.c, (i * 1000) + 4000));
        // for (let i = 0; i < this.state.list.length + this.state.conn.length; i++) {
        //     setTimeout(this.c, (i*1000)+2000 );
        // }
    };

    addColorChanging = (type, element, color) => this.setState(prevState => ({
        changeColorList: [...prevState.changeColorList, {
            type: type,
            element: element,
            color: color
        }]
    }));

    c = () => {
        const element = this.state.changeColorList[0]; // беремо перший елемент
        console.log(element);
        if (element.type === 'dot') {
            // if (this.state.list.filter(e => e.name === element.element.name).length > 0) console.log('HERE IS ', element.element.name, "  ", typeof(element.element));
            // else console.log('HERE MISS ', element.element.name,' ', typeof element.element.name);
            this.setState(prevState => ({ // міняємо на жовтий
                list: prevState.list.map(e => e.name === element.element.name ? {
                    ...e, color: element.color
                } : e)
            }));
        } else {
            this.setState(prevState => ({ // міняємо на жовтий
                conn: prevState.conn.map(e => e === element.element ? {
                    ...e, color: element.color
                } : e)
            }));
        }
        this.setState({changeColorList: this.state.changeColorList.filter(e => e !== element)});
        this.updateGraph(); //здається це костиль, здається мені соромно
    };

    updateGraph = () => this.setState({randKey: this.randomNumber()});

    recursive = (currentDot, leastDotMass, fullWeight) => {
        if (leastDotMass.length === 0) {
            const conn = this.state.conn.filter(e => (e.key2 === currentDot.key && e.key1 === this.state.list[0].key)); //|| (e => (e.key1 === currentDot.key && e.key2 === this.state.list[0].key)
            if (conn.length > 0)
                return {dotMass: [{dot: this.state.list[0].name}, {dot: currentDot.name}], w: fullWeight + conn[0].w};
            else
                return null;
        } else {
            const connMass = this.state.conn
                .filter(e => currentDot.key === e.key1 || currentDot.key === e.key2)
                .filter(e => leastDotMass.some(a => a.key === e.key1 || a.key === e.key2));
            if (connMass.length > 0) {
                let resultMass = [];
                for (const conn of connMass) {
                    const nextDot = leastDotMass.filter(e => e.key === conn.key1 || e.key === conn.key2)[0];
                    resultMass.push(this.recursive(nextDot, leastDotMass.filter(e => e !== nextDot), fullWeight + conn.w));
                }
                resultMass = resultMass.filter(e => e !== null);
                let result;
                if (resultMass.length > 1) result = resultMass.reduce((a, b) => a.w <= b.w ? a : b);
                else if (resultMass.length === 1) result = resultMass[0];
                else return null;
                result.dotMass.push({dot: currentDot.name});
                return result;
            }
        }
        return null;
    };

    findConnByDots = (aDot, bDot) => this.state.conn.filter(e => (e.key1 === aDot.key && e.key2 === bDot.key) || (e.key2 === aDot.key && e.key1 === bDot.key))[0];

    travellingSalesmanProblem() {
        let data = this;
        axios.post('http://localhost:8085/tvp', {
            'dotList': this.state.list,
            'connectionList': this.state.conn
        })
            .then(function (response) {
                console.log(response);
                data.setState(prevState => ({
                    tvp: {
                        dotListResult: response.data.dotListResult,
                        connectionListResult: response.data.connectionListResult,
                        weight: response.data.w
                    }
                }));
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    boruvkaAlgorithm = () => {
        let blackConn = this.state.conn;
        let result = [];
        this.state.list.forEach((e, i) => result[i] = [i]);
        while (blackConn.length !== 0) {
            let lowestConn;
            let lowestDotsGroup = result.reduce((a, b) => (a.length !== 0 && a.length <= b.length) || b.length === 0 ? a : b);
            let lowestDotsGroupConn = blackConn.filter(f => lowestDotsGroup.some(b => b === f.key1 || b === f.key2));
            if (lowestDotsGroupConn.length > 1)
                lowestConn = lowestDotsGroupConn.reduce((a, b) => a.w < b.w ? a : b);
            else if (lowestDotsGroupConn.length === 1)
                lowestConn = lowestDotsGroupConn[0];
            else
                lowestConn = blackConn.reduce((a, b) => a.w < b.w ? a : b);
            let k1 = this.indexOfDot(result, lowestConn.key1);
            let k2 = this.indexOfDot(result, lowestConn.key2);
            if (k1 !== k2) {
                result[k1] = result[k1].concat(result[k2]);
                result[k2] = [];
                this.setState(prevState => ({
                    boruvkaPrint: [...prevState.boruvkaPrint, {
                        text: 'добавлено звязок ' + this.state.list[lowestConn.key1].name + ' '
                            + ' ' + this.state.list[lowestConn.key2].name + ' - ' + lowestConn.w + '  \n',
                        mass: lowestDotsGroup
                    }]
                }));

                // this.addColorChanging('conn', lowestConn, 'green');
                this.setState(prevState => ({
                    conn: prevState.conn.map(e => e === lowestConn ? {...e, color: 'green'} : e)
                }));
                // this.addColorChanging('dot', this.state.list.filter(e => e.key === lowestConn.key2 || e.key === lowestConn.key1).filter(e => e !== undefined)[0], 'green');
                this.setState(prevState => ({
                    list: prevState.list.map(e => e.key === lowestConn.key2 || e.key === lowestConn.key1 ? {
                        ...e, color: 'green'
                    } : e)
                }));
            } else {
                this.setState(prevState => ({
                    boruvkaPrint: [...prevState.boruvkaPrint, {
                        text: this.state.list[lowestConn.key1].name + ' '
                            + ' ' + this.state.list[lowestConn.key2].name + ' - ' + lowestConn.w + ' добавлено \n',
                        mass: lowestDotsGroup
                    }]
                }));
                // this.addColorChanging('conn', lowestConn, 'violet');
                this.setState(prevState => ({
                    conn: prevState.conn.map(e => e === lowestConn ? {...e, color: 'violet'} : e)
                }));
            }
            blackConn = blackConn.filter(e => e !== lowestConn);
            this.updateGraph();
        }
    };

    fifthLab = () => {
        let data = this;
        axios.post('http://localhost:8085/fifth', {
            'dotList': this.state.list,
            'connectionList': this.state.conn
        })
            .then(function (response) {
                data.setState({fifthResult: response.data});
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    addNewDot = (name, x = this.addXCoordinate(100), y = this.addYCoordinate(100)) => {
        if (name !== "") {
            if (name === "start") {
                this.colorChanger();
                return;
            } else if (name === "test") {
                this.eulerianPath();
                return;
            } else if (name === "fifth") {
                this.fifthLab();
                return;
            }
            this.setState(prevState => ({
                list: [...prevState.list, {
                    key: this.state.list.length,
                    name: name,
                    x: x,
                    y: y,
                    color: 'black'
                }]
            }));

            this.setState(prevState => ({
                grid: [...prevState.grid, []]
            }));

            this.setState(prevState => ({
                grid: prevState.grid.map(m => [...m, {w: 0}])
            }));

            this.setState(prevState => ({
                grid: prevState.grid
                    .map((e, i) => e.map((s, h) => h > 0 ? {s, w: e[h - 1].w} : {s, w: 0}))
            }));

        }
        this.setState(prevState => ({
            boruvkaPrint: []
        }));
        this.updateGraph();
    };

    render() {
        const d = {
            display: 'flex',
            flexDirection: 'row'
        };

        const f = {
            position: "absolute",
            right: "0"
        };

        return (
            <div style={d}>
                <div>
                    <div style={d}>
                        <AddNewDot addNewDot={this.addNewDot}/>
                        <TestReader uploadDots={this.uploadDots}/>
                        {/*<span>{this.state.test}</span>*/}
                    </div>
                    <div style={d}>
                        <div>
                            {this.state.list.map((e, i) => <NameForm dot={e}
                                                                     onChangeName={this.onChangeName}
                                                                     deleteDot={this.deleteDot}
                                                                     changeCoordinate={this.changeCoordinate}/>)}
                        </div>
                        <ConnectGrid updateConnect={this.updateConnect}
                                     grid={this.state.grid}
                                     l={this.state.list.length}
                                     changeColor={this.changeColor}/>
                    </div>

                    {/*<button onClick={this.boruvkaAlgorithm}>Алгоритм Борувки</button>*/}
                    {/*<button onClick={this.travellingSalesmanProblem}>Гамільтонів граф (методом грубої сили)</button>*/}
                    <button onClick={this.tvr}>Гамільтонів граф (методом грубої сили)</button>
                    {/*<button onClick={this.tvr}>Гамільтонів граф (методом границь та гілок)</button>*/}
                    {/*<button onClick={this.eulerianPath}> Ейлеровий цикл</button>*/}
                    <div>
                        {this.state.tvp.dotListResult.map((e, i) => <div style={d}>{i}){e.map(e =>
                            <span> {e.name} =></span>)}</div>)}
                        {this.state.tvp.connectionListResult
                            .map((e, i) => <div style={d}>{i}){e
                                .map((e, i) => <span> {e.key1}|{e.key2} =></span>)}</div>)}
                        {this.state.tvp.weight.map((e, i) => <div style={d}>{i}) weight: {e}</div>)}
                        {this.state.fifthResult.map(e => <div>{e}</div>)}
                    </div>
                    {this.state.boruvkaPrint.map(e => <div style={d}> для массиву [{e.mass.map(e =>
                        <span>{e}</span>)}]{e.text}</div>)}
                    <span>{this.state.eulerianPath.map(e => <div style={d}> {e.map(o =>
                        <div>{o.key1}|{o.key2}=></div>)}</div>)}</span>
                    <div style={d}>{this.state.test.mass.map(e => <div>{e.dot},</div>)}
                        <span>{this.state.test.weight}</span></div>
                </div>
                <div style={f}><Graph key={this.state.randKey} dotList={this.state.list} conn={this.state.conn}/></div>
            </div>
        );
    }
}

export default Main