export interface HealthTip {
  id: number;
  tip: string;
  tag: string;
}

export const HEALTH_TIPS: HealthTip[] = [
  {
    id: 1,
    tip: 'Hãy uống nước đều đặn trong ngày thay vì uống quá nhiều trong một lần để cơ thể hấp thu tốt nhất.',
    tag: 'Thói quen vàng',
  },
  {
    id: 2,
    tip: 'Một ly nước ấm ngay sau khi thức dậy giúp đánh thức hệ tiêu hóa và đào thải độc tố tự nhiên.',
    tag: 'Buổi sáng',
  },
  {
    id: 3,
    tip: 'Đừng đợi đến khi thật khát mới uống nước, vì khi khát cơ thể bạn đã thiếu hụt khoảng 1-2% lượng nước.',
    tag: 'Nhận biết',
  },
  {
    id: 4,
    tip: 'Uống 1 ly nước trước bữa ăn khoảng 30 phút hỗ trợ quá trình tiêu hóa và kiểm soát cân nặng tốt hơn.',
    tag: 'Dinh dưỡng',
  },
  {
    id: 5,
    tip: 'Khi làm việc trong phòng máy lạnh, cơ thể mất nước qua da nhanh hơn bạn nghĩ. Đừng quên nhấp từng ngụm nhỏ.',
    tag: 'Văn phòng',
  },
  {
    id: 6,
    tip: 'Bổ sung nước trước, trong và sau khi tập thể dục để tránh bị chuột rút và hạ thể lực.',
    tag: 'Thể thao',
  },
];
