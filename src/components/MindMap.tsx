import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { KnowledgeNode } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { ZoomIn, ZoomOut, Maximize2, CheckCircle2, Circle } from 'lucide-react';

interface MindMapProps {
  data: KnowledgeNode;
  onNodeClick: (node: KnowledgeNode) => void;
  selectedNodeId?: string;
}

export const MindMap: React.FC<MindMapProps> = ({ data, onNodeClick, selectedNodeId }) => {
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
      .size([height - 100, width - 300])
      .nodeSize([80, 240]);

    const root = d3.hierarchy(data);
    tree(root);

    // Links
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
      .attr('stroke-width', 2);

    // Nodes
    const node = g.selectAll('.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', d => `node ${d.data.id === selectedNodeId ? 'active' : ''}`)
      .attr('transform', d => `translate(${d.y},${d.x})`)
      .on('click', (event, d) => {
        onNodeClick(d.data);
      })
      .style('cursor', 'pointer');

    // Node rect
    node.append('rect')
      .attr('x', -10)
      .attr('y', -20)
      .attr('width', 180)
      .attr('height', 40)
      .attr('rx', 12)
      .attr('fill', d => d.data.id === selectedNodeId ? '#EEF2FF' : '#FFFFFF')
      .attr('stroke', d => d.data.id === selectedNodeId ? '#6366F1' : '#F1F5F9')
      .attr('stroke-width', 2)
      .style('filter', 'drop-shadow(0 1px 2px rgb(0 0 0 / 0.05))');

    // Node text
    node.append('text')
      .attr('dx', 35)
      .attr('dy', 5)
      .text(d => d.data.name)
      .attr('font-size', '14px')
      .attr('font-weight', '500')
      .attr('fill', d => d.data.id === selectedNodeId ? '#4338CA' : '#1E293B');

    // Completion icon
    node.append('foreignObject')
      .attr('x', 5)
      .attr('y', -10)
      .attr('width', 20)
      .attr('height', 20)
      .html(d => {
        const color = d.data.completed ? '#10B981' : '#CBD5E1';
        return `<div style="color: ${color}">${d.data.completed ? '✓' : '○'}</div>`;
      });

    // Center the tree initially
    const initialTransform = d3.zoomIdentity.translate(100, height / 2).scale(0.9);
    svg.call(zoomBehavior.transform, initialTransform);

  }, [data, selectedNodeId, onNodeClick]);

  return (
    <div ref={containerRef} className="relative w-full h-full bg-slate-50 overflow-hidden">
      <svg ref={svgRef} className="w-full h-full" />
      
      {/* Controls */}
      <div className="absolute bottom-6 left-6 flex flex-col gap-2">
        <div className="bg-white p-1 rounded-xl shadow-lg border border-slate-100 flex flex-col">
          <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors">
            <ZoomIn className="w-5 h-5" />
          </button>
          <div className="h-px bg-slate-100 mx-2" />
          <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors">
            <ZoomOut className="w-5 h-5" />
          </button>
        </div>
        <button className="bg-white p-3 rounded-xl shadow-lg border border-slate-100 text-slate-600 hover:bg-slate-50 transition-colors">
          <Maximize2 className="w-5 h-5" />
        </button>
      </div>

      {/* Legend */}
      <div className="absolute top-6 left-6 bg-white/80 backdrop-blur-md px-4 py-3 rounded-2xl border border-white shadow-sm flex gap-6 items-center">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-xs font-medium text-slate-600">已掌握</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-slate-300" />
          <span className="text-xs font-medium text-slate-600">学习中</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-indigo-500" />
          <span className="text-xs font-medium text-slate-600">当前选择</span>
        </div>
      </div>
    </div>
  );
};
