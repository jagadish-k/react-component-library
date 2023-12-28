import React, { FC } from 'react';

import styles from './Button.module.css';

interface IButtonProps {
  label: string;
  // Define your prop types here
}

const Button = ({ label }: IButtonProps) => {
  return <div className={styles.btn}>{label}</div>;
};

export default Button;
