import { SigninButton } from '../SigninButton';
import { ActiveLink } from '../ActiveLink';
import styles from './styles.module.scss';

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src='/images/logo.svg' alt='ig.news logo' />
        <nav>
          <ActiveLink href='/' activeClassName={styles.active}>
            <a>Home</a>
          </ActiveLink>
          <ActiveLink href='/posts' activeClassName={styles.active}>
            <a>Posts</a>
          </ActiveLink>
        </nav>
        <SigninButton />
      </div>
    </header>
  );
}
