import { KnowledgeNode } from '../types';

export const initialTreeData: KnowledgeNode = {
  id: 'root',
  name: '机器学习',
  completed: true,
  children: [
    {
      id: 'supervised',
      name: '监督学习',
      completed: true,
      children: [
        { id: 'linear-regression', name: '线性回归', completed: true },
        { id: 'logistic-regression', name: '逻辑回归', completed: true },
        { id: 'decision-trees', name: '决策树', completed: false },
      ],
    },
    {
      id: 'unsupervised',
      name: '无监督学习',
      completed: false,
      children: [
        { id: 'clustering', name: '聚类分析' },
        { id: 'dim-reduction', name: '降维' },
      ],
    },
    {
      id: 'deep-learning',
      name: '深度学习',
      completed: false,
      children: [
        { id: 'neural-networks', name: '神经网络' },
        { id: 'cnn', name: '卷积神经网络 (CNN)' },
      ],
    },
  ],
};
