import React, { Component } from 'react';
import * as d3 from "d3";
import d3Tip from "d3-tip";
import './arcsChart.scss';


class ArcsChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data,
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
        let margin = { top: 5, right: 5, bottom: 28, left: 5 };
        let width = this.state.width - margin.left - margin.right;
        let height = this.state.height - margin.top - margin.bottom;
        const color = '#3FCE9A';
        const hoverColor = '#F2AE17';
        const axisLineColor = '#4D5058';
        const negativeColor = '#F3AE18';


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
                .attr('width', this.state.width)
                .attr('height', this.state.height)
            .append('g')
                .attr('transform', `translate(${margin.left}, ${margin.right})`);
        
        svg.call(tip);

        const loopGroup = svg.append('g').attr('class', 'arc-loop');
        const circleGroup = svg.append('g').attr('class', 'arc-cirlce');
        const originGroup = svg.append('g').attr('class', 'arc-origin');

        /**
         * Render origin
         */
        originGroup
            .attr('transform', `translate(${width / 2}, ${height})`)
        originGroup.append('circle')
            .attr('class', 'arc-origin--circle')
            .attr('r', 28);
        originGroup.append('rect')
            .attr('class', 'arc-origin--rect')
            .attr('width', 12)
            .attr('height', 12)
            .attr('x', -6)
            .attr('y', -6);

         /**
          * Render loop
          */
        const anchorsGroup = loopGroup.selectAll('g').data(this.state.data.loops);
        const enterAnchorGroup = anchorsGroup.enter().append('g');
        const mergeAnchorGroup = anchorsGroup.merge(enterAnchorGroup);

        /**
         * Render anchors
         */
        const loopsDataIndex = this.state.data.loops.map((_, i) => i);
        const anchorCircleScale = d3.scaleLinear()
            .domain([Math.min(...loopsDataIndex), Math.max(...loopsDataIndex)])
            .range([chartRadius, chartRadius / 2]);
        
        enterAnchorGroup.append('circle')
            .attr('class', 'anchor-circle')
            .attr('cx', width / 2)
            .attr('cy', (_, i) => height - anchorCircleScale(i))
            .attr('r', (_, i) => anchorCircleScale(i));
        
        const anchorBox = enterAnchorGroup.append('g').attr('class', 'anchor-box');
        anchorBox.attr('transform', (_, i) => `translate(${width / 2}, ${height - 6 - 2 * anchorCircleScale(i)})`);
        anchorBox.append('rect')
            .attr('x', -6)
            .attr('y', 0)
            .attr('width', 12)
            .attr('height', 12);
        anchorBox.append('text')
            .attr('x', 0)
            .attr('y', 28)
            .attr('text-anchor', 'middle')
            .text(d => d.name);
        
        const circlesGroup = circleGroup.selectAll('g')
            .data(this.state.data.loops)
            .enter()
            .append('g');
        circlesGroup.append('g').attr('class', 'anchor-inbound');
        circlesGroup.append('g').attr('class', 'anchor-outbound');

        const inboundGroup = circlesGroup.select('g.anchor-inbound')
            .selectAll('circle')
            .data((d, i) => d.inbound.map(bound => ({ bound, i })));
        const enterInboundGroup = inboundGroup.enter().append('circle');
        const mergeInboundGroup = inboundGroup.merge(enterInboundGroup);

        const radiusScale = d3.scaleLinear()
            .domain(this.getRadiusDomain(this.state.data.loops))
            .range([0, 10]);

        const inBoundScale = d3.scaleLinear()
            .domain([0, 1])
            .range([-90, 90]);

        mergeInboundGroup
            .attr('r', d => radiusScale(d.bound.size))
            .attr('cx', (d) => {
                const angle = inBoundScale(d.bound.distanceFraction);
                const radius = anchorCircleScale(d.i);
                let cx = radius * Math.cos(angle * (Math.PI / 180));
                return width / 2 - cx;
            })
            .attr('cy', (d) => {
                const angle = inBoundScale(d.bound.distanceFraction);
                const radius = anchorCircleScale(d.i);
                let cy = radius * Math.sin(angle * (Math.PI / 180));
                return height - radius - cy;
            })
            .attr('fill', d => d.bound.filled ? d.bound.status : 'none')
            .attr('stroke', d => !d.bound.filled ? d.bound.status : 'none')
            .attr('stroke-width', 2);
        
        const outboundGroup = circlesGroup.select('g.anchor-outbound')
            .selectAll('circle')
            .data((d, i) => d.outbound.map(bound => ({ bound, i })));
        const enterOutboundGroup = outboundGroup.enter().append('circle');
        const mergeOutboundGroup = outboundGroup.merge(enterOutboundGroup);

        const outBoundScale = d3.scaleLinear()
            .domain([0, 1])
            .range([-180, 180]);

        mergeOutboundGroup
            .attr('r', d => radiusScale(d.bound.size))
            .attr('cx', (d) => {
                const angle = outBoundScale(d.bound.distanceFraction);
                const radius = anchorCircleScale(d.i);
                let cx = radius * Math.cos(angle * (Math.PI / 180));
                return width / 2 - cx;
            })
            .attr('cy', (d) => {
                const angle = outBoundScale(d.bound.distanceFraction);
                const radius = anchorCircleScale(d.i);
                let cy = radius * Math.sin(angle * (Math.PI / 180));
                return height - radius - cy;
            })
            .attr('fill', d => d.bound.filled ? d.bound.status : 'none')
            .attr('stroke', d => !d.bound.filled ? d.bound.status : 'none')
            .attr('stroke-width', 2);

        anchorsGroup.exit().remove();
    }

    getRadiusDomain(loops) {
        const radiusSizes = loops.reduce((sizes, loop) => {
            const boundSizes = [...loop.inbound, ...loop.outbound].map(b => b.size);
            return sizes.concat(boundSizes);
        }, []);

        return [0, Math.max(...radiusSizes)];
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

export default ArcsChart;