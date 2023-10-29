import React, { useState, useMemo } from "react";
import axios from "../commons/axios";
import { formatPrice } from "../commons/helper";

const CartItem = (props) => {
  //   數量狀態的改變
  const [mount, setMount] = useState(props.cart.mount);
  const { id, name, image, price } = props.cart || {};
  
  //   小計 使用 useMemo 當 mount, price 發現變化才重新渲染
  const sumPrice = useMemo(() => {
    return formatPrice(mount * parseInt(price));
  }, [mount, price]);

  const handleChang = (e) => {
    const _mount = parseInt(e.target.value);
    setMount(_mount);
    const newCart = { ...props.cart, mount: _mount };
    axios.put(`/carts/${id}`, newCart).then((res) => {
      // 將newCart 傳遞到 Cart的  updateCart()
      props.updateCart(newCart);
    });
  };

  const deleteCart = () => {
    axios.delete(`/carts/${id}`).then((res) => {
      props.deleteCart(props.cart);
    });
  };

  return (
    <div className="columns is-vcentered">
      <div className="column is-narrow" onClick={deleteCart}>
        <span className="close">X</span>
      </div>
      <div className="column is-narrow">
        <img src={image} alt={name} width="100" />
      </div>
      <div className="column cart-name is-narrow">{name}</div>
      <div className="column ">
        <span className="price">{formatPrice(price)}</span>
      </div>
      <div className="column ">
        <input
          type="number"
          className="input num-input"
          min={1}
          value={mount}
          onChange={handleChang}
        />
      </div>
      <div className="column">
        <span className="sum-price">{sumPrice}</span>
      </div>
    </div>
  );
};

export default CartItem;
