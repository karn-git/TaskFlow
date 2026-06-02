import React from 'react';

interface AvatarProps {
  userId: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ userId, name, size = 'md', className = '' }) => {
  // Generate a premium gradient based on user id so that each team member gets a consistent distinctive color
  const getGradient = (id: string) => {
    const colors = [
      'from-blue-500 to-indigo-600 text-white',
      'from-emerald-500 to-teal-600 text-white',
      'from-amber-500 to-orange-600 text-white',
      'from-purple-500 to-pink-600 text-white',
      'from-rose-500 to-red-600 text-white',
      'from-cyan-500 to-blue-600 text-white',
      'from-violet-500 to-fuchsia-600 text-white'
    ];
    let index = 0;
    if (id) {
      let sum = 0;
      for (let i = 0; i < id.length; i++) {
        sum += id.charCodeAt(i);
      }
      index = sum % colors.length;
    }
    return colors[index];
  };

  // Extract initials
  const getInitials = (fullName: string) => {
    if (!fullName) return '';
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px] font-bold',
    sm: 'w-8 h-8 text-[12px] font-semibold',
    md: 'w-10 h-10 text-[14px] font-semibold',
    lg: 'w-12 h-12 text-[16px] font-bold',
    xl: 'w-14 h-14 text-[18px] font-bold',
  };

  const gradient = getGradient(userId);
  const initials = getInitials(name);

  return (
    <div
      id={`avatar-${userId}`}
      className={`relative inline-flex items-center justify-center rounded-full bg-gradient-to-br shadow-xs select-none border border-white/20 uppercase font-sans ${sizeClasses[size]} ${gradient} ${className}`}
      title={name}
    >
      <span>{initials}</span>
    </div>
  );
};
