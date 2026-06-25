import React, { memo } from "react";

import styles from "./styles.module.scss";


interface ShimmerProps {
  className?: string;
}

const ShimmerUiContainer = (props: ShimmerProps) => {
  const { className } = props;

  return <div className={`${styles.shimmer} ${className}`} />;
};

export default memo(ShimmerUiContainer);
