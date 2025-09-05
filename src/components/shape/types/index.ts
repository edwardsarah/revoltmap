import { type SVGAttributes } from 'react';
import type { Node } from '@xyflow/react';

import RoundRectangle from './round-rectangle';
import Rectangle from './rectangle';
import Hexagon from './hexagon';
import Circle from './circle';

// here we register all the shapes that are available
// you can add your own here
export const ShapeComponents = {
  'round-rectangle': RoundRectangle,
  rectangle: Rectangle,
  hexagon: Hexagon,
  circle: Circle,
};

export type ShapeType = keyof typeof ShapeComponents;

export type ShapeProps = {
  width: number;
  height: number;
} & SVGAttributes<SVGElement>;

export type ShapeComponentProps = Partial<ShapeProps> & { type: ShapeType };

export type ShapeNode = Node<{
  type: ShapeType;
  color: string;
  label: string;
  showQuestions: boolean;
  likes: number;
}>;
