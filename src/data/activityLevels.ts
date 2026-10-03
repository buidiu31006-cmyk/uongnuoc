import { ActivityOption } from '../types';

export const ACTIVITY_OPTIONS: ActivityOption[] = [
  {
    id: 'sedentary',
    label: 'Ít vận động',
    bonusMl: 0,
    description: 'Ngồi văn phòng nhiều, làm việc tĩnh tại, ít tập luyện',
  },
  {
    id: 'moderate',
    label: 'Vận động vừa',
    bonusMl: 300,
    description: 'Đi bộ, làm việc nhà nhẹ nhàng hoặc tập thể dục 20-40 phút',
  },
  {
    id: 'active',
    label: 'Vận động nhiều',
    bonusMl: 500,
    description: 'Chơi thể thao cường độ cao, lao động nặng hoặc tập gym > 1 giờ',
  },
];
