import { getInitials, getAvatarColor } from '../../utils/helpers';

interface AvatarProps {
  name: string;
  size?: number;
}

export default function Avatar({ name, size = 40 }: AvatarProps) {
  const initials = getInitials(name);
  const bgColor = getAvatarColor(name);

  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-medium"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: bgColor,
        fontSize: `${size * 0.4}px`,
      }}
    >
      {initials}
    </div>
  );
}
