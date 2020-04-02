import * as d3 from "d3";
import React from "react";

export default class Graph extends React.Component {
    constructor(props) {
        super(props);
        this.state ={
        }
    }


    componentDidMount() {
        this.drawBarChart();
    }

    drawBarChart() {
        const data = this.props.dotList;
        const data2 = this.props.conn;

        const svG = d3.select(this.refs.canvas)
            .append("svg")
            .attr("width", 1100)
            .attr("height", 1100)
            .style("border", "1px solid black");

        svG
            .selectAll("whatever").data(data).enter()
            .append("circle")
            .style('fill', d => d.color)
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .attr("r", 10);
        svG
            .selectAll("whatever").data(data).enter()
            .append("text")
            .style("fill", "black")
            .attr("x", d => Number.parseInt(d.x) + 10)
            .attr("y", d => Number.parseInt(d.y) - 4)
            .text((d, i) => d.name.toString()+'('+i+')'); //.toLowerCase());
        svG
            .selectAll("whatever").data(data2).enter()
            .append("text")
            .style("fill", d => d.color)
            .attr("x", d => Math.round((Number.parseInt(d.x1) + Number.parseInt(d.x2))/2) + 15)
            .attr("y", d => Math.round((Number.parseInt(d.y1) + Number.parseInt(d.y2))/2) - 6)
            .text(d => d.w.toString());
        svG
            .selectAll("whatever").data(data2).enter()
            .append("line")
            .style("stroke", d=>d.color)
            .attr("x1", d=>d.x1)
            .attr("y1", d=>d.y1)
            .attr("x2", d=>d.x2)
            .attr("y2", d=>d.y2);
    }

    render() {
        return (
            <div ref="canvas"/>
        )
    }
}