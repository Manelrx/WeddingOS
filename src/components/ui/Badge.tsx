import { cn } from '@/lib/utils';
import styles from './Badge.module.css';

interface BadgeProps {
    children: React.ReactNode;
    status?: string;
    className?: string;
}

export function Badge({ children, status = 'default', className }: BadgeProps) {
    return (
        <span className={cn(styles.badge, styles[status], className)}>
            {children}
        </span>
    );
}
