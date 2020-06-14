import React, { useState } from "react";
import { PageHeader, Card } from "antd";

import UserForm from "../components/UserForm";
import Container from "../components/Container";

export default () => {
    const [type, setType] = useState("login");
    const tabList = [
        { key: "login", tab: "Log In" },
        { key: "signup", tab: "Sign Up" },
    ];

    return (
        <>
            <PageHeader
                title="Registration"
                onBack={() => window.history.back()}
            />
            <Container>
                <Card
                    style={{ width: "100%" }}
                    tabList={tabList}
                    activeTabKey={type}
                    onTabChange={(key) => setType(key)}
                >
                    <UserForm type={type} />
                </Card>
            </Container>
        </>
    );
};
