import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { KnowledgeNode } from '../types';
import { motion } from 'motion/react';
import { ZoomIn, ZoomOut, Maximize2, ChevronRight, ChevronDown } from 'lucide-react';

interface RoadmapTreeProps {
  data: KnowledgeNode;
  onNodeSelect: (node: KnowledgeNode) => void;
  selectedNodeId?: string;
}

export const RoadmapTree: React.FC<RoadmapTreeProps> = ({ data, onNodeSelect, selectedNodeId }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    svg.selectAll('*').remove();

    const g = svg.append('g');

    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 2])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
        setZoom(event.transform.k);
      });

    svg.call(zoomBehavior);

    const tree = d3.tree<KnowledgeNode>()
      .nodeSize([100, 250]);

    const root = d3.hierarchy(data);
    tree(root);

    // Links with curved paths
    g.selectAll('.link')
      .data(root.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', d3.linkHorizontal<any, any>()
        .x(d => d.y)
        .y(d => d.x)
      )
      .attr('fill', 'none')
      .attr('stroke', '#E2E8F0')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', d => d.target.data.completed ? '0' : '5,5');

    // Nodes
    const node = g.selectAll('.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', d => `node ${d.data.id === selectedNodeId ? 'active' : ''}`)
      .attr('transform', d => `translate(${d.y},${d.x})`)
      .on('click', (event, d) => {
        onNodeSelect(d.data);
      })
      .style('cursor', 'pointer');

    // Node Background
    node.append('rect')
      .attr('x', -10)
      .attr('y', -25)
      .attr('width', 200)
      .attr('height', 50)
      .attr('rx', 16)
      .attr('fill', d => {
        if (d.data.id === selectedNodeId) return '#6366F1';
        if (d.data.completed) return '#F0FDF4';
        return '#FFFFFF';
      })
      .attr('stroke', d => {
        if (d.data.id === selectedNodeId) return '#4F46E5';
        if (d.data.completed) return '#BBF7D0';
        return '#F1F5F9';
      })
      .attr('stroke-width', 2)
      .style('filter', 'drop-shadow(0 4px 6px -1px rgb(0 0 0 / 0.1))');

    // Progress Indicator (Circle)
    node.append('circle')
      .attr('cx', 20)
      .attr('cy', 0)
      .attr('r', 8)
      .attr('fill', d => d.data.completed ? '#10B981' : '#E2E8F0')
      .attr('stroke', '#FFFFFF')
      .attr('stroke-width', 2);

    // Node Text
    node.append('text')
      .attr('dx', 40)
      .attr('dy', 5)
      .text(d => d.data.name)
      .attr('font-size', '14px')
      .attr('font-weight', '600')
      .attr('fill', d => d.data.id === selectedNodeId ? '#FFFFFF' : '#1E293B');

    // Initial positioning
    const initialTransform = d3.zoomIdentity.translate(100, height / 2).scale(0.8);
    svg.call(zoomBehavior.transform, initialTransform);

  }, [data, selectedNodeId, onNodeSelect]);

  return (
    <div ref={containerRef} className="relative w-full h-full bg-slate-50/50 overflow-hidden">
      <svg ref={svgRef} className="w-full h-full" />
      
      <div className="absolute bottom-6 left-6 flex flex-col gap-2">
        <div className="bg-white p-1 rounded-2xl shadow-xl border border-slate-100 flex flex-col">
          <button className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-600 transition-colors">
            <ZoomIn className="w-5 h-5" />
          </button>
          <div className="h-px bg-slate-100 mx-2" />
          <button className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-600 transition-colors">
            <ZoomOut className="w-5 h-5" />
          </button>
        </div>
        <button className="bg-white p-3 rounded-2xl shadow-xl border border-slate-100 text-slate-600 hover:bg-slate-50 transition-colors">
          <Maximize2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
