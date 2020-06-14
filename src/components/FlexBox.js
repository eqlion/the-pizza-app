import React from "react";
import { Row } from "antd";

export default ({ children }) => (
    <Row justify="space-between" align="middle">
        {children}
    </Row>
);
