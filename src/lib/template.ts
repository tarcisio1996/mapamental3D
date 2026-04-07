import { Node, Edge } from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';

export type NodeType = 'folder' | 'file' | 'concept' | 'model' | 'texture' | 'engine' | 'reference';

export interface NodeData extends Record<string, unknown> {
  label: string;
  type: NodeType;
  status?: 'todo' | 'wip' | 'review' | 'done';
  assignee?: string;
}

interface TemplateItem {
  name: string;
  type: NodeType;
  children?: TemplateItem[];
}

export const medievalGateTemplate: TemplateItem = {
  name: 'Medieval Fantasy Gate',
  type: 'folder',
  children: [
    {
      name: '00_Reference',
      type: 'folder',
      children: [
        {
          name: 'Concept_Art',
          type: 'folder',
          children: [{ name: 'concept_medieval_fantasy_gate.png', type: 'concept' }]
        },
        {
          name: 'PureRef',
          type: 'folder',
          children: [{ name: 'MedievalGate_References.pur', type: 'reference' }]
        },
        {
          name: 'Style_Guide',
          type: 'folder',
          children: [{ name: 'art_direction_palette.png', type: 'reference' }]
        }
      ]
    },
    {
      name: '01_Preproduction',
      type: 'folder',
      children: [
        { name: 'asset_list.pdf', type: 'file' },
        { name: 'blockout_screenshot_aprovado.png', type: 'file' }
      ]
    },
    {
      name: '02_WIP',
      type: 'folder',
      children: [
        {
          name: 'Hero_Portal_Arco',
          type: 'folder',
          children: [
            {
              name: 'Modeling',
              type: 'folder',
              children: [
                { name: 'portal_midpoly_v01.max', type: 'model' },
                { name: 'portal_hipoly_v01.ztl', type: 'model' },
                { name: 'portal_lowpoly_uv_v01.max', type: 'model' }
              ]
            },
            {
              name: 'Textures',
              type: 'folder',
              children: [
                { name: 'portal_albedo.png', type: 'texture' },
                { name: 'portal_normal.png', type: 'texture' },
                { name: 'portal_roughness.png', type: 'texture' }
              ]
            },
            {
              name: 'Substance',
              type: 'folder',
              children: [
                { name: 'portal.spp', type: 'texture' },
                { name: 'portal_trimsheet.sbs', type: 'texture' }
              ]
            }
          ]
        },
        { name: 'Hero_Torre_Cilindrica', type: 'folder' },
        { name: 'Hero_Edificio_Lateral', type: 'folder' },
        { name: 'Hero_Ponte', type: 'folder' },
        {
          name: 'Modular_Kit',
          type: 'folder',
          children: [
            { name: 'Modeling', type: 'folder' },
            { name: 'Textures', type: 'folder' }
          ]
        },
        {
          name: 'Foliage',
          type: 'folder',
          children: [
            { name: 'Ivy', type: 'folder' },
            { name: 'Trees', type: 'folder' },
            { name: 'Grass_Flowers', type: 'folder' }
          ]
        },
        {
          name: 'Props',
          type: 'folder',
          children: [
            { name: 'Bandeiras', type: 'folder' },
            { name: 'Lanterna', type: 'folder' },
            { name: 'Placa', type: 'folder' }
          ]
        },
        {
          name: 'Decals',
          type: 'folder',
          children: [{ name: 'runas_v01.png', type: 'texture' }]
        }
      ]
    },
    {
      name: '03_TrimSheets',
      type: 'folder',
      children: [
        { name: 'trimsheet_pedra_cinza.sbs', type: 'texture' },
        { name: 'trimsheet_madeira.sbs', type: 'texture' },
        { name: 'trimsheet_telhado.sbs', type: 'texture' }
      ]
    },
    {
      name: '04_UE5_Project',
      type: 'folder',
      children: [
        { name: 'MedievalGate_UE5_blockout.zip', type: 'engine' },
        { name: 'MedievalGate_UE5_modeling_v01.zip', type: 'engine' },
        { name: 'MedievalGate_UE5_final.zip', type: 'engine' }
      ]
    },
    {
      name: '05_Recordings',
      type: 'folder',
      children: [
        { name: 'Fase0_Preproduction', type: 'folder' },
        { name: 'Fase1_Blockout', type: 'folder' },
        {
          name: 'Fase2_Modeling',
          type: 'folder',
          children: [
            { name: 'Portal_Arco', type: 'folder' },
            { name: 'Torre', type: 'folder' },
            { name: 'Modular_Kit', type: 'folder' }
          ]
        },
        { name: 'Fase3_Texturizacao', type: 'folder' },
        { name: 'Fase4_Assembly', type: 'folder' },
        { name: 'Fase5_Lighting_Polish', type: 'folder' },
        { name: 'Fase6_Portfolio', type: 'folder' }
      ]
    },
    {
      name: '06_Screenshots_Progress',
      type: 'folder',
      children: [
        { name: '2026-04-07_blockout_v01.png', type: 'file' },
        { name: '2026-04-14_portal_midpoly.png', type: 'file' }
      ]
    },
    {
      name: '07_Final_Portfolio',
      type: 'folder',
      children: [
        { name: 'beauty_shot_4k.png', type: 'file' },
        { name: 'closeup_portal.png', type: 'file' },
        { name: 'wireframe_overlay.png', type: 'file' },
        { name: 'flat_texture_breakdown.png', type: 'file' },
        { name: 'artstation_post_description.txt', type: 'file' }
      ]
    }
  ]
};

export function generateNodesAndEdges(template: TemplateItem): { nodes: Node[], edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  function traverse(item: TemplateItem, parentId: string | null = null, depth: number = 0, index: number = 0) {
    const id = uuidv4();
    
    nodes.push({
      id,
      type: 'custom', // We will use a custom node type
      position: { x: 0, y: 0 }, // Position will be calculated by dagre
      data: {
        label: item.name,
        type: item.type,
        status: 'todo'
      }
    });

    if (parentId) {
      edges.push({
        id: `e-${parentId}-${id}`,
        source: parentId,
        target: id,
        type: 'smoothstep',
        animated: false,
      });
    }

    if (item.children) {
      item.children.forEach((child, i) => {
        traverse(child, id, depth + 1, i);
      });
    }
  }

  traverse(template);
  return { nodes, edges };
}
