import Link from 'next/link';
import { Heart } from 'lucide-react';
import styles from './Header.module.css';

export function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    <div className={styles.iconWrapper}>
                        <Heart size={18} fill="currentColor" />
                    </div>
                    <span className={styles.title}>WeddingOS</span>
                </Link>
            </div>
        </header>
    );
}
