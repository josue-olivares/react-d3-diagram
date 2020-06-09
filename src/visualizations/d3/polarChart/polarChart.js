import React, { Component } from 'react';
import * as d3 from "d3";
import d3Tip from "d3-tip";
import './polarChart.scss';


class PolarChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data,
            areaLabels: this.props.areaLabels,
            width: 0,
            height: 0
        }

        this.chartRef = React.createRef();
        this.drawChart = this.drawChart.bind(this, this.props.id);
    }

    getWidth() {
        return this.chartRef.current.parentElement.offsetWidth;
    }

    getHeight() {
        return this.chartRef.current.parentElement.offsetHeight;
    }

    drawChart(chartID) {
        let margin = { top: 5, right: 5, bottom: 5, left: 5 },
            width = this.state.width - margin.left - margin.right,
            height = this.state.height - margin.top - margin.bottom,
            color = '#3FCE9A',
            hoverColor = '#F2AE17',
            axisLineColor = '#4D5058',
            negativeColor = '#F3AE18';


        // http://stackoverflow.com/a/929107
        var reMap = function (oldValue) {
            var oldMin = 0,
                oldMax = -359,
                newMin = 0,
                newMax = (Math.PI * 2),
                newValue = (((oldValue - 90 - oldMin) * (newMax - newMin)) / (oldMax - oldMin)) + newMin;
            return newValue;

        }

        // Create ToolTip
        const tip = d3Tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function (d) {
                return "<strong>Tooltip Example:</strong> <span style='color: " + hoverColor + "'>" + d.size + "</span>";
            })    

        let chartRadius = Math.min(width, height) / 2 - 30;

        let r = d3.scaleLinear()
            .domain([0, 1]).nice()
            .range([0, chartRadius]);

        let svg = d3.select('#' + chartID)
            .append('svg')
                .attr('width', width)
                .attr('height', height)
            .append('g')
                .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
        
        svg.call(tip);

        let gr = svg.append('g')
                .attr('class', 'r axis')
            .selectAll('g')
                .data([0, 0.185, 0.5, 0.75, 1])
                .enter()
                .append('g');

        gr.append('circle')
            .attr('r', r);

        gr.each(function(p, j) {
            if (j === 1) {
                d3.select(this)
                    .select("circle")
                    .style('fill', '#1c2c39')
            }
        });
        
        let line = d3.lineRadial()
            .radius(function (d) {
                return r(d.radialCoord);
            })
            .angle(function (d) {
                return -reMap(d.angularCoord) + Math.PI / 2;
            });

        svg.append("rect")
            .attr('width', 15)
            .attr('height', 15)
            .attr('fill', 'white')
            .style('transform', 'translate(1px, -10px) rotate(45deg)')

        svg.selectAll('point')
            .data(this.state.data)
            .enter()
            .append('circle')
            .attr('class', 'point')
            .attr('transform', function (d) {
                let coords = line([d]).slice(1).slice(0, -1);
                return 'translate(' + coords + ')'
            })
            .attr('r', function (d) {
                return d.size;
            })
            .attr('fill', d => d.fill)
            .attr('stroke', d => d.stroke)
            .attr('stroke-width', 2)
            .on("mouseover", function(d) {
                d3.select(this).style("fill", function() {
                    return d3.rgb(d3.select(this).style("fill")).darker(1);
                })
                tip.show(d, this);
            })
            .on("mouseout", function(d) {
                d3.select(this).style("fill", function() {
                    return d3.rgb(d3.select(this).style("fill")).brighter(1);
                })
                tip.hide(d, this);
            });

        /**
         * Render text area
         */
        const areaGroup = svg.append("g")
            .attr("class", "area-group");

        const areas = areaGroup.selectAll("text").data(this.state.areaLabels);
        const enterAreas = areas.enter().append("text");
        const mergeAreas = areas.merge(enterAreas);

        mergeAreas
            .attr("class", "area-text")
            .attr("x", d => r(d.radius) + 16)
            .attr("text-anchor", "middle")
            .text(d => d.name)

        areas.exit().remove();
    }


    componentDidMount() {
        this.setState({
            data: Object.assign(
                this.state.data
            )
        });
        let width = this.getWidth()
        let height = this.getHeight();
        this.setState({ width: width, height: height }, () => {
            this.drawChart(this.props.id);
        });
        let resizedFn;
        window.addEventListener("resize", () => {
            clearTimeout(resizedFn);
            resizedFn = setTimeout(() => {
                this.redrawChart(this.props.id);
            }, 200)
        });
    }
    redrawChart(chartID) {
        let width = this.getWidth()
        this.setState({ width: width });
        d3.select("#" + chartID + " svg").remove();
        this.drawChart = this.drawChart.bind(this, chartID);
        this.drawChart(chartID);
    }

    render() {
        return <div className="polarChart" id={this.props.id} ref={this.chartRef}></div>
    }

}

export default PolarChart;