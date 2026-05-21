import React from "react";

interface Props {
  className?: string;
}

export const ComponentName: React.FC<Props> = ({ className }) => (
  <div className={className}>
    <div>Lol</div>
  </div>
);

export default ComponentName;
