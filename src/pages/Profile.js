import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { PageHeader, Typography, Button, Table, Divider } from "antd";

import Container from "../components/Container";
import FlexBox from "../components/FlexBox";

import { logout, getEmail, isLogged } from "../util";

const { Text, Title } = Typography;

export default () => {
    const [history, setHistory] = useState([]);
    const [menu, setMenu] = useState([]);

    const columns = [
        {
            title: "Date",
            dataIndex: "datetime",
            key: "datetime",
        },
        {
            title: "Pizzas",
            dataIndex: "order_comp",
            key: "pizzas",
            render: (pizza) => renderPizza(pizza),
        },
        {
            title: "Address",
            dataIndex: "address",
            key: "address",
        },
        {
            title: "Phone",
            dataIndex: "phone",
            key: "phone",
            render: (phone) => "+7" + phone,
        },
        {
            title: "Total",
            dataIndex: "order_comp",
            key: "total",
            render: (pizza) => renderTotal(pizza),
        },
    ];
    useEffect(() => {
        getHistory();
        getMenu();
    }, []);

    const getMenu = () => {
        axios
            .get("/api/pizzas")
            .then((res) => res.data)
            .then((menu) => setMenu(menu));
    };

    const getHistory = () => {
        axios
            .get("/api/history", { params: { email: getEmail() } })
            .then((res) => res.data.history)
            .then((history) => setHistory(history));
    };

    const renderPizza = (pizzas) => {
        const cell = [];
        for (let pizzaId in pizzas) {
            cell.push(
                <>
                    <Text>
                        {pizzas[pizzaId]} of {menu[pizzaId - 1].name}
                    </Text>
                    <br />
                </>
            );
        }
        return cell;
    };

    const renderTotal = (pizzas) => {
        let s = 0;
        for (let pizzaId in pizzas) {
            s += pizzas[pizzaId] * menu[pizzaId - 1].cost;
        }
        s += 5;
        return (
            <Text>
                ${s} (€{Math.floor(s * 0.8)})
            </Text>
        );
    };
    return (
        <>
            <PageHeader title="Profile" onBack={() => window.history.back()} />
            <Container>
                {isLogged() ? (
                    <>
                        <FlexBox>
                            <Title level={4}>Welcome back, {getEmail()}!</Title>
                            <Link to="./">
                                <Button onClick={() => logout()}>Logout</Button>
                            </Link>
                        </FlexBox>
                        <Divider>Order history</Divider>
                        {history ? (
                            <Table columns={columns} dataSource={history} />
                        ) : (
                            <Title level={4} style={{ textAlign: "center" }}>
                                When you make at least one order, there will be
                                history!
                            </Title>
                        )}
                    </>
                ) : (
                    <Text>You are not logged in</Text>
                )}
            </Container>
        </>
    );
};
