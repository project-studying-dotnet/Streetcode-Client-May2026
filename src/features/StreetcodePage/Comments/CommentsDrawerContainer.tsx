/* eslint-disable max-len */
import "./CommentDrawerContainer.styles.scss";

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Drawer, Grid } from "antd";

const { useBreakpoint } = Grid;

const CommentsDrawerContainer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(location.pathname.endsWith("/comments"));
  }, [location.pathname]);

  const handleClose = () => {
    setIsOpen(false);
    const currentBaseUrl = location.pathname.replace(/\/comments\/?$/, "");
    navigate(currentBaseUrl || "/");
  };

  const drawerWidth = screens.md ? 500 : "100%";

  return (
    <Drawer title="Коментарі" placement="right" onClose={handleClose} width={drawerWidth} maskClosable mask={false} open={isOpen} zIndex={10000}>
      <div className="comments-shell-content">
        <p style={{ color: "#bfbfbf", textAlign: "center", marginTop: "20px" }}>Тут скоро з&apos;являться коментарі...</p>
      </div>
    </Drawer>
  );
};

export default CommentsDrawerContainer;
