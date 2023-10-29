import React, { useState, useEffect, useMemo } from "react";
import CartItem from "../components/CartItem";
import Layout from "Layout";
import axios from "../commons/axios";
import { formatPrice } from "commons/helper";
import { CSSTransition, TransitionGroup } from "react-transition-group";

const Cart = () => {
  const [carts, setCart] = useState([]);

  useEffect(() => {
    const user = global.auth.getUser() || {}
    axios.get(`/carts?userId=${user.email}`).then((res) => setCart(res.data));
  }, []);

  // 使用  useMemo 優化
  const totalPrice = useMemo(() => {
    const totalPrice = carts
      .map((cart) => cart.mount * parseInt(cart.price))
      .reduce((a, value) => a + value, 0);
    return formatPrice(totalPrice);
  }, [carts]);

  const updateCart = (cart) => {
    const newCarts = [...carts];
    const _index = newCarts.findIndex((c) => c.id === cart.id);
    newCarts.splice(_index, 1, cart);
    setCart(newCarts);
  };
  const deleteCart = (cart) => {
    const _carts = carts.filter((c) => c.id !== cart.id);
    setCart(_carts);
  };

  return (
    <Layout>
      <div className="cart-page">
        <span className="cart-title">shopping Cart</span>
        <div className="cart-list">
          <TransitionGroup component={null}>
            {carts.map((cart) => (
              <CSSTransition classNames="cart-item" timeout={300} key={cart.id}>
                <CartItem
                  key={cart.id}
                  cart={cart}
                  updateCart={updateCart}
                  deleteCart={deleteCart}
                />
              </CSSTransition>
            ))}
          </TransitionGroup>
        </div>
        {carts.length === 0 ? <p className="no-cart">NO GOODS</p> : ""}
        <div className="cart-total">
          Total:
          <span className="total-price">{totalPrice}</span>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
