import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
import { List, PageHeader, Button, Badge } from "antd";
import { UserOutlined, ShoppingCartOutlined } from "@ant-design/icons";

import Card from "../components/Card";
import Container from "../components/Container";

import { isLogged } from "../util";

const Home = ({ count }) => {
    let [pizzas, setPizzas] = useState([]);
    useEffect(() => {
        getPizzas();
    }, []);

    const getPizzas = () => {
        axios
            .get("/api/pizzas")
            .then((res) => res.data)
            .then((pizzas) => setPizzas(pizzas));
    };
    isLogged();

    return (
        <>
            <PageHeader
                title="Let's order some pizza!"
                extra={[
                    <Link to={isLogged() ? "./profile" : "./user"}>
                        <Button
                            key="account"
                            icon={<UserOutlined />}
                            size="large"
                        />
                    </Link>,
                    <Link to="./cart">
                        <Button
                            key="cart"
                            icon={
                                <Badge count={count}>
                                    <ShoppingCartOutlined />
                                </Badge>
                            }
                            size="large"
                        />
                    </Link>,
                ]}
            />
            <Container>
                <List
                    grid={{ gutter: 32, column: 6 }}
                    dataSource={pizzas}
                    renderItem={(pizza) => (
                        <List.Item key={pizza.id}>
                            <Card pizza={pizza} />
                        </List.Item>
                    )}
                />
            </Container>
        </>
    );
};

const mapStateToProps = (state) => ({
    count: Object.values(state.cart).reduce((a, b) => a + b, 0),
});

export default connect(mapStateToProps)(Home);
