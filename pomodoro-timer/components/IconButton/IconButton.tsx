import styles from './IconButton.module.scss';
import IconButtonProps from './IconButton.types';

const IconButton = (props: IconButtonProps) => {
  return <h1 className={styles.iconButton}>{props.text}</h1>;
};

export default IconButton;
