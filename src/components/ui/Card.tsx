import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import styles from './Card.module.css';

interface CardProps extends HTMLAttributes<HTMLDivElement> { }

export const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(styles.card, className)}
                {...props}
            />
        );
    }
);
Card.displayName = "Card";
